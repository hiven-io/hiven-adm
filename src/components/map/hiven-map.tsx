'use client'

import { useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPinned, Loader2, Layers, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''

type MapPin = {
  id: string
  name: string
  lng: number
  lat: number
  category: string | null
  rating: number | null
  status: string
  photos: string[] | null
}

const CATEGORY_COLORS: Record<string, string> = {
  bar: '#BE123C',
  restaurante: '#F97316',
  cafe: '#CA8A04',
  parque: '#16A34A',
  loja: '#0EA5E9',
  padaria: '#7B2CBF',
  default: '#6E625C',
}

function getColor(category: string | null): string {
  if (!category) return CATEGORY_COLORS.default
  const key = Object.keys(CATEGORY_COLORS).find(k =>
    category.toLowerCase().includes(k)
  )
  return key ? CATEGORY_COLORS[key] : CATEGORY_COLORS.default
}

export function HivenMap({ className, fullHeight }: { className?: string; fullHeight?: boolean }) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const markers = useRef<mapboxgl.Marker[]>([])
  const [loaded, setLoaded] = useState(false)
  const [showExperiences, setShowExperiences] = useState(false)

  const { data: places } = useQuery({
    queryKey: ['map-places'],
    queryFn: async () => {
      const sb = supabase as any
      const { data, error } = await sb.rpc('places_in_viewport', {
        min_lng: -50.0,
        min_lat: -25.0,
        max_lng: -38.0,
        max_lat: -14.0,
      }).maybeSingle()

      if (error) {
        const fallback = await sb
          .from('places')
          .select('id, name, address_city, category_id, rating_avg, status, photos')
          .eq('status', 'active')
          .limit(100)

        if (fallback.error) throw fallback.error

        const placesList = (fallback.data || []) as any[]
        const enriched = await Promise.all(
          placesList.map(async (p: any) => {
            const coord = await sb.rpc('experience_place_coords', { p_experience_id: p.id }).maybeSingle()
            return {
              id: p.id,
              name: p.name,
              lng: coord?.data?.lng || -43.9386,
              lat: coord?.data?.lat || -19.9208,
              category: null,
              rating: p.rating_avg,
              status: p.status,
              photos: p.photos,
            }
          })
        )
        return enriched.filter((p: MapPin) => p.lng && p.lat)
      }

      const features = data?.features || data || []
      if (Array.isArray(features)) {
        return features.map((f: any) => ({
          id: f.id || f.properties?.id,
          name: f.properties?.name || f.name || 'Local',
          lng: f.geometry?.coordinates?.[0] || f.lng || -43.9386,
          lat: f.geometry?.coordinates?.[1] || f.lat || -19.9208,
          category: f.properties?.category || f.category || null,
          rating: f.properties?.rating_avg || f.rating_avg || null,
          status: f.properties?.status || 'active',
          photos: f.properties?.photos || null,
        }))
      }

      return []
    },
  })

  const { data: experiences } = useQuery({
    queryKey: ['map-experiences'],
    queryFn: async () => {
      const sb = supabase as any
      const { data, error } = await sb
        .from('experiences')
        .select('id, title, status, starts_at')
        .eq('status', 'open')
        .limit(50)

      if (error) throw error

      const enriched = await Promise.all(
        (data || []).map(async (e: any) => {
          const coord = await sb.rpc('experience_place_coords', { p_experience_id: e.id }).maybeSingle()
          return {
            id: e.id,
            title: e.title,
            lng: coord?.data?.lng || -43.9386,
            lat: coord?.data?.lat || -19.9208,
            starts_at: e.starts_at,
          }
        })
      )
      return enriched.filter((e: any) => e.lng && e.lat)
    },
    enabled: showExperiences,
  })

  useEffect(() => {
    if (!mapContainer.current || map.current) return

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/standard',
      center: [-43.9386, -19.9208],
      zoom: 12,
      pitch: 20,
      attributionControl: false,
    })

    map.current.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right')

    map.current.on('load', () => {
      setLoaded(true)
    })

    return () => {
      markers.current.forEach(m => m.remove())
      markers.current = []
      map.current?.remove()
      map.current = null
    }
  }, [])

  useEffect(() => {
    if (!map.current || !loaded || !places) return

    markers.current.forEach(m => m.remove())
    markers.current = []

    places.forEach((pin: MapPin) => {
      const color = getColor(pin.category)
      const el = document.createElement('div')
      el.className = 'map-pin'
      el.style.cssText = `
        width: 28px;
        height: 28px;
        border-radius: 50% 50% 50% 0;
        background: ${color};
        transform: rotate(-45deg);
        border: 2.5px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.25);
        cursor: pointer;
        transition: transform 0.15s ease;
      `

      const inner = document.createElement('div')
      inner.style.cssText = `
        width: 100%;
        height: 100%;
        border-radius: 50% 50% 50% 0;
        display: flex;
        align-items: center;
        justify-content: center;
        transform: rotate(45deg);
      `
      el.appendChild(inner)

      el.addEventListener('mouseenter', () => {
        el.style.transform = 'rotate(-45deg) scale(1.15)'
      })
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'rotate(-45deg) scale(1)'
      })

      const popup = new mapboxgl.Popup({
        offset: 20,
        closeButton: false,
        maxWidth: '220px',
      }).setHTML(`
        <div style="padding: 8px 2px; font-family: inherit;">
          <div style="font-weight: 600; font-size: 13px; color: #2A2320; margin-bottom: 4px;">${pin.name}</div>
          ${pin.category ? `<div style="font-size: 11px; color: #6E625C; margin-bottom: 2px;">${pin.category}</div>` : ''}
          ${pin.rating ? `<div style="font-size: 11px; color: #F97316;">★ ${pin.rating.toFixed(1)}</div>` : ''}
        </div>
      `)

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([pin.lng, pin.lat])
        .setPopup(popup)
        .addTo(map.current!)

      markers.current.push(marker)
    })
  }, [loaded, places])

  useEffect(() => {
    if (!map.current || !loaded || !showExperiences || !experiences) return

    const expMarkers = experiences.map((exp: any) => {
      const el = document.createElement('div')
      el.style.cssText = `
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: #E11D48;
        border: 2px solid white;
        box-shadow: 0 1px 4px rgba(0,0,0,0.3);
        cursor: pointer;
        opacity: 0.85;
      `

      const popup = new mapboxgl.Popup({
        offset: 12,
        closeButton: false,
        maxWidth: '200px',
      }).setHTML(`
        <div style="padding: 6px 2px; font-family: inherit;">
          <div style="font-weight: 600; font-size: 12px; color: #2A2320;">${exp.title}</div>
          <div style="font-size: 10px; color: #A99E98; margin-top: 2px;">Experiencia aberta</div>
        </div>
      `)

      return new mapboxgl.Marker({ element: el })
        .setLngLat([exp.lng, exp.lat])
        .setPopup(popup)
        .addTo(map.current!)
    })

    return () => {
      expMarkers.forEach(m => m.remove())
    }
  }, [loaded, showExperiences, experiences])

  return (
    <Card className={cn('border-hiven-border/60 overflow-hidden', className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-hiven-orange/10">
            <MapPinned className="h-4 w-4 text-hiven-orange" />
          </div>
          <div>
            <CardTitle className="text-sm font-semibold text-hiven-text">
              Mapa da Plataforma
            </CardTitle>
            <p className="text-[11px] text-hiven-text-3 mt-0.5">
              {places?.length || 0} locais ativos
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowExperiences(!showExperiences)}
          className={cn(
            'h-7 text-[11px] rounded-lg gap-1.5 transition-all duration-200',
            showExperiences
              ? 'bg-hiven-red/10 text-hiven-red'
              : 'text-hiven-text-3 hover:text-hiven-text-2'
          )}
        >
          {showExperiences ? <Eye className="h-3 w-3" /> : <Layers className="h-3 w-3" />}
          {showExperiences ? 'Experiencias' : 'Ver experiencias'}
        </Button>
      </CardHeader>
      <CardContent className="p-0 relative">
        <div
          ref={mapContainer}
          className={cn('w-full', fullHeight ? 'h-[calc(100vh-160px)]' : 'h-[320px]')}
        />
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-hiven-bg/80 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-hiven-text-3">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Carregando mapa...</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
