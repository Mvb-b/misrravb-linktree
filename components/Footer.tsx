'use client'
import { Flame, Heart } from 'lucide-react'
import { VisitorCounterBadge } from './VisitorCounterBadge'

export function Footer() {
  return (
    <footer className="mt-8 py-6 text-center">
      {/* Visitor Counter Badge */}
      <div className="flex justify-center mb-4">
        <VisitorCounterBadge />
      </div>
      
      <div className="flex items-center justify-center gap-2 mb-2">
        <Flame className="w-4 h-4 text-fire-orange" />
        <span className="text-sm text-gray-500 font-body"> MisrraVB </span>
      </div>
      <p className="text-xs text-gray-600 flex items-center justify-center gap-1">
        Hecho con <Heart className="w-3 h-3 text-red-500 inline" /> y fracasos
      </p>
    </footer>
  )
}
