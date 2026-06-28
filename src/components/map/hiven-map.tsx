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
import { useThemeStore } from '@/stores/theme-store'

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

const MAP_STYLES = {
  light: 'mapbox://styles/mapbox/standard',
  dark: 'mapbox://styles/mapbox/dark-v11',
}

function getColor(category: string | null): string {
  if (!category) return CATEGORY_COLORS.default
  const key = Object.keys(CATEGORY_COLORS).find(k =>
    category.toLowerCase().includes(k)
  )
  return key ? CATEGORY_COLORS[key] : CATEGORY_COLORS.default
}

function getPopupStyles(isDark: boolean) {
  if (isDark) {
    return {
      bg: '#2C2826',
      titleColor: '#EEE8E4',
      subColor: '#9B968F',
      ratingColor: '#FB923C',
      expSubColor: '#6B6560',
      borderColor: '#3A3330',
    }
  }
  return {
    bg: '#FEFCFB',
    titleColor: '#2A2320',
    subColor: '#6E625C',
    ratingColor: '#F97316',
    expSubColor: '#A99E98',
    borderColor: '#EAE2DD',
  }
}

export function HivenMap({ className, fullHeight }: { className?: string; fullHeight?: boolean }) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const markersRef = useRef<mapboxgl.Marker[]>([])
  const markerIdsRef = useRef<Set<string>>(new Set())
  const expMarkersRef = useRef<mapboxgl.Marker[]>([])
  const expMarkerIdsRef = useRef<Set<string>>(new Set())
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [showExperiences, setShowExperiences] = useState(false)
  const { theme } = useThemeStore()
  const isDark = theme === 'dark'

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
      style: isDark ? MAP_STYLES.dark : MAP_STYLES.light,
      center: [-43.9386, -19.9208],
      zoom: 12,
      pitch: 20,
      attributionControl: false,
    })

    map.current.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right')

    map.current.on('load', () => {
      setLoaded(true)
    })

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (!map.current) return
          const { longitude: lng, latitude: lat } = pos.coords
          map.current.flyTo({ center: [lng, lat], zoom: 13, duration: 1200 })

          if (userMarkerRef.current) userMarkerRef.current.remove()

          const el = document.createElement('div')
          el.style.cssText = 'width: 16px; height: 16px; cursor: pointer;'

          const pulse = document.createElement('div')
          pulse.style.cssText = `
            width: 16px; height: 16px; border-radius: 50%;
            background: ${isDark ? '#38BDF8' : '#0EA5E9'};
            border: 2.5px solid ${isDark ? '#1A1714' : 'white'};
            box-shadow: 0 0 0 4px ${isDark ? 'rgba(56,189,248,0.2)' : 'rgba(14,165,233,0.25)'};
            animation: user-pulse 2s ease-in-out infinite;
          `
          el.appendChild(pulse)

          userMarkerRef.current = new mapboxgl.Marker({ element: el })
            .setLngLat([lng, lat])
            .addTo(map.current)
        },
        () => {},
        { enableHighAccuracy: false, timeout: 8000 }
      )
    }

    return () => {
      markersRef.current.forEach(m => m.remove())
      markersRef.current = []
      markerIdsRef.current.clear()
      expMarkersRef.current.forEach(m => m.remove())
      expMarkersRef.current = []
      expMarkerIdsRef.current.clear()
      userMarkerRef.current?.remove()
      userMarkerRef.current = null
      map.current?.remove()
      map.current = null
    }
  }, [])

  useEffect(() => {
    if (!map.current) return
    const style = isDark ? MAP_STYLES.dark : MAP_STYLES.light
    map.current.setStyle(style)

    markersRef.current.forEach(m => m.remove())
    markersRef.current = []
    markerIdsRef.current.clear()
    expMarkersRef.current.forEach(m => m.remove())
    expMarkersRef.current = []
    expMarkerIdsRef.current.clear()
  }, [isDark])

  useEffect(() => {
    if (!map.current || !loaded || !places) return

    const currentIds = new Set(places.map(p => p.id))

    markersRef.current = markersRef.current.filter(m => {
      const id = m.getElement().dataset.placeId
      if (id && !currentIds.has(id)) {
        m.remove()
        markerIdsRef.current.delete(id)
        return false
      }
      return true
    })

    const styles = getPopupStyles(isDark)

    places.forEach((pin: MapPin) => {
      if (markerIdsRef.current.has(pin.id)) return

      const color = getColor(pin.category)

      const el = document.createElement('div')
      el.dataset.placeId = pin.id
      el.style.cssText = 'width: 28px; height: 28px; cursor: pointer;'

      const pinInner = document.createElement('div')
      pinInner.style.cssText = `
        width: 28px;
        height: 28px;
        border-radius: 50% 50% 50% 0;
        background: ${color};
        transform: rotate(-45deg);
        border: 2.5px solid ${isDark ? '#3A3330' : 'white'};
        box-shadow: 0 2px 8px rgba(0,0,0,${isDark ? '0.4' : '0.25'});
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        pointer-events: none;
      `
      el.appendChild(pinInner)

      el.addEventListener('mouseenter', () => {
        pinInner.style.transform = 'rotate(-45deg) scale(1.2)'
        pinInner.style.boxShadow = `0 4px 14px rgba(0,0,0,${isDark ? '0.5' : '0.35'})`
      })
      el.addEventListener('mouseleave', () => {
        pinInner.style.transform = 'rotate(-45deg) scale(1)'
        pinInner.style.boxShadow = `0 2px 8px rgba(0,0,0,${isDark ? '0.4' : '0.25'})`
      })

      const popup = new mapboxgl.Popup({
        offset: 20,
        closeButton: false,
        maxWidth: '220px',
      }).setHTML(`
        <div style="padding: 8px 2px; font-family: inherit; background: ${styles.bg}; border-radius: 8px;">
          <div style="font-weight: 600; font-size: 13px; color: ${styles.titleColor}; margin-bottom: 4px;">${pin.name}</div>
          ${pin.category ? `<div style="font-size: 11px; color: ${styles.subColor}; margin-bottom: 2px;">${pin.category}</div>` : ''}
          ${pin.rating ? `<div style="font-size: 11px; color: ${styles.ratingColor};">★ ${pin.rating.toFixed(1)}</div>` : ''}
        </div>
      `)

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([pin.lng, pin.lat])
        .setPopup(popup)
        .addTo(map.current!)

      markerIdsRef.current.add(pin.id)
      markersRef.current.push(marker)
    })
  }, [loaded, places, isDark])

  useEffect(() => {
    if (!map.current || !loaded) return

    if (!showExperiences || !experiences) {
      expMarkersRef.current.forEach(m => m.remove())
      expMarkersRef.current = []
      expMarkerIdsRef.current.clear()
      return
    }

    const currentIds = new Set(experiences.map((e: any) => e.id))

    expMarkersRef.current = expMarkersRef.current.filter(m => {
      const id = m.getElement().dataset.expId
      if (id && !currentIds.has(id)) {
        m.remove()
        expMarkerIdsRef.current.delete(id)
        return false
      }
      return true
    })

    const styles = getPopupStyles(isDark)

    experiences.forEach((exp: any) => {
      if (expMarkerIdsRef.current.has(exp.id)) return

      const el = document.createElement('div')
      el.dataset.expId = exp.id
      el.style.cssText = 'width: 14px; height: 14px; cursor: pointer;'

      const dotInner = document.createElement('div')
      dotInner.style.cssText = `
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: ${isDark ? '#E11D48' : '#BE123C'};
        border: 2px solid ${isDark ? '#3A3330' : 'white'};
        box-shadow: 0 1px 4px rgba(0,0,0,${isDark ? '0.5' : '0.3'});
        opacity: 0.9;
        transition: transform 0.2s ease;
        pointer-events: none;
      `
      el.appendChild(dotInner)

      el.addEventListener('mouseenter', () => {
        dotInner.style.transform = 'scale(1.3)'
      })
      el.addEventListener('mouseleave', () => {
        dotInner.style.transform = 'scale(1)'
      })

      const popup = new mapboxgl.Popup({
        offset: 12,
        closeButton: false,
        maxWidth: '200px',
      }).setHTML(`
        <div style="padding: 6px 2px; font-family: inherit; background: ${styles.bg}; border-radius: 8px;">
          <div style="font-weight: 600; font-size: 12px; color: ${styles.titleColor};">${exp.title}</div>
          <div style="font-size: 10px; color: ${styles.expSubColor}; margin-top: 2px;">Experiencia aberta</div>
        </div>
      `)

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([exp.lng, exp.lat])
        .setPopup(popup)
        .addTo(map.current!)

      expMarkerIdsRef.current.add(exp.id)
      expMarkersRef.current.push(marker)
    })
  }, [loaded, showExperiences, experiences, isDark])

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
