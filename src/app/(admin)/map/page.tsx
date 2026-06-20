'use client'

import dynamic from 'next/dynamic'

const HivenMap = dynamic(
  () => import('@/components/map/hiven-map').then(mod => ({ default: mod.HivenMap })),
  {
    ssr: false,
    loading: () => (
      <div className="h-[calc(100vh-160px)] bg-hiven-bg/50 rounded-2xl flex items-center justify-center">
        <span className="text-sm text-hiven-text-3">Carregando mapa...</span>
      </div>
    ),
  }
)

export default function MapPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-hiven-text">Mapa de Locais</h1>
        <p className="text-sm text-hiven-text-3">
          Visualize todos os locais e experiencias na plataforma
        </p>
      </div>
      <HivenMap fullHeight />
    </div>
  )
}
