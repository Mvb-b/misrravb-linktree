'use client'

import { useState, useEffect } from 'react'
import { X, Mail, Check, Bell, Sparkles } from 'lucide-react'

interface NewsletterModalProps {
  isOpen: boolean
  onClose: () => void
}

export function NewsletterModal({ isOpen, onClose }: NewsletterModalProps) {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsVisible(true), 50)
    } else {
      setIsVisible(false)
      setEmail('')
      setIsSuccess(false)
      setError('')
    }
  }, [isOpen])

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.trim()) {
      setError('Por favor ingresa tu email')
      return
    }
    if (!validateEmail(email)) {
      setError('Por favor ingresa un email válido')
      return
    }

    setIsSubmitting(true)
    
    await new Promise(r => setTimeout(r, 800))
    
    const subs = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]')
    if (!subs.includes(email)) {
      subs.push(email)
      localStorage.setItem('newsletter_subscribers', JSON.stringify(subs))
    }
    
    setIsSuccess(true)
    setIsSubmitting(false)
  }

  if (!isOpen) return null

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />
      
      <div className={`relative w-full max-w-md transform transition-all duration-300 ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
        <div className="absolute -inset-1 bg-gradient-to-r from-fire-orange via-twitch-purple to-fire-orange rounded-2xl opacity-50 blur-sm animate-pulse" />
        
        <div className="relative glass-card rounded-xl overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-fire-orange via-twitch-purple to-fire-orange" />
          
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10" aria-label="Cerrar">
            <X size={20} />
          </button>

          <div className="p-6 md:p-8">
            {!isSuccess ? (
              <>
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-fire-orange/20 to-twitch-purple/20 flex items-center justify-center border border-white/10">
                      <Bell className="w-7 h-7 text-fire-orange" />
                    </div>
                    <div className="absolute -top-1 -right-1">
                      <Sparkles className="w-4 h-4 text-fire-coral animate-pulse" />
                    </div>
                  </div>
                </div>

                <h3 className="font-display text-xl md:text-2xl font-bold text-white text-center mb-2">
                  No te pierdas ningún stream
                </h3>

                <p className="text-gray-400 text-center text-sm mb-6">
                  Suscríbete y recibe notificaciones cuando esté en vivo
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@email.com"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-fire-orange/50 focus:ring-1 focus:ring-fire-orange/30 transition-all font-body"
                      disabled={isSubmitting}
                    />
                  </div>

                  {error && (
                    <p className="text-fire-orange text-sm text-center">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-fire-orange to-twitch-purple opacity-80 group-hover:opacity-100 transition-opacity rounded-xl" />
                    <div className="relative py-3 px-6 font-display font-semibold text-white flex items-center justify-center gap-2">
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Suscribiendo...</span>
                        </>
                      ) : (
                        <>
                          <span>Suscribirme</span>
                          <Bell size={16} className="group-hover:animate-bounce" />
                        </>
                      )}
                    </div>
                  </button>
                </form>

                <p className="text-gray-600 text-xs text-center mt-4">
                  Solo te enviaremos notificaciones de streams. Sin spam.
                </p>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500/20 to-green-400/20 flex items-center justify-center border border-green-500/30 animate-bounce">
                    <Check className="w-8 h-8 text-green-400" />
                  </div>
                </div>
                
                <h3 className="font-display text-xl font-bold text-white mb-2">
                  ¡Suscripción exitosa!
                </h3>
                <p className="text-gray-400 text-sm mb-6">
                  Te notificaremos cuando <span className="text-fire-orange">MisrraVB</span> esté en vivo
                </p>

                <button onClick={onClose} className="w-full py-3 px-6 bg-white/10 hover:bg-white/20 text-white rounded-xl font-display font-semibold transition-colors border border-white/20">
                  Entendido, ¡gracias!
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
