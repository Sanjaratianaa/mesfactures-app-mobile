"use client"

import { useEffect, useState } from 'react'
import { useOnline } from '@/hooks/use-online'
import { Wifi, WifiOff } from 'lucide-react'

export function NetworkStatusToast() {
  const isOnline = useOnline()
  const [showToast, setShowToast] = useState(false)
  const [lastStatus, setLastStatus] = useState<boolean | null>(null)

  useEffect(() => {
    // Ne pas afficher le toast au premier chargement
    if (lastStatus === null) {
      setLastStatus(isOnline)
      return
    }

    // Afficher le toast seulement si le statut a changé
    if (lastStatus !== isOnline) {
      setShowToast(true)
      setLastStatus(isOnline)

      // Masquer le toast après 3 secondes
      const timer = setTimeout(() => {
        setShowToast(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [isOnline, lastStatus])

  if (!showToast) return null

  return (
    <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-lg shadow-lg text-white text-sm font-medium transition-all duration-300 ${
      isOnline 
        ? 'bg-green-500' 
        : 'bg-red-500'
    }`}>
      <div className="flex items-center gap-2">
        {isOnline ? (
          <>
            <Wifi className="w-4 h-4" />
            <span>Connexion rétablie</span>
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4" />
            <span>Mode hors ligne</span>
          </>
        )}
      </div>
    </div>
  )
}
