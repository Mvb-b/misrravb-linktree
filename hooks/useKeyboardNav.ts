'use client'

import { useEffect, useCallback } from 'react'

export function useKeyboardNav(linkCount: number) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Focus trap for Tab key
    const focusableElements = document.querySelectorAll(
      'a[href], button, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    // Arrow key navigation for links
    if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) {
      e.preventDefault()
      
      const links = document.querySelectorAll('.link-button')
      const currentIndex = Array.from(links).findIndex(link => link === document.activeElement)
      
      let nextIndex: number
      switch (e.key) {
        case 'ArrowDown':
          nextIndex = currentIndex < links.length - 1 ? currentIndex + 1 : 0
          break
        case 'ArrowUp':
          nextIndex = currentIndex > 0 ? currentIndex - 1 : links.length - 1
          break
        case 'Home':
          nextIndex = 0
          break
        case 'End':
          nextIndex = links.length - 1
          break
        default:
          nextIndex = currentIndex
      }
      
      ;(links[nextIndex] as HTMLElement)?.focus()
    }

    // Escape to blur
    if (e.key === 'Escape') {
      ;(document.activeElement as HTMLElement)?.blur()
    }
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Focus management helper
  const focusLink = useCallback((index: number) => {
    const links = document.querySelectorAll('.link-button')
    ;(links[index] as HTMLElement)?.focus()
  }, [])

  return { focusLink }
}
