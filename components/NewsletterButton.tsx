'use client'

import { useState } from 'react'
import { Bell } from 'lucide-react'
import { NewsletterModal } from './NewsletterModal'

export function NewsletterButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full link-button flex items-center gap-4 p-4 md:p-5 rounded-xl group"
      >
        <span className="shine-effect" />
        
        <div className="flex-shrink-0 icon-glow text-fire-orange">
          <Bell size={28} className="transition-transform duration-300 group-hover:scale-110" />
        </div>

        <div className="flex-grow min-w-0 text-left">
          <h3 className="font-display font-semibold text-white group-hover:text-fire-orange transition-colors">
            Notificaciones
          </h3>
          <p className="text-xs md:text-sm text-gray-500 truncate">
            Recibe alertas cuando esté en vivo
          </p>
        </div>
      </button>

      <NewsletterModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
