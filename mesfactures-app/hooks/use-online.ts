"use client"

import { useState, useEffect } from 'react'


// Variable globale pour le mode test
let testModeOverride: boolean | null = null

export function setTestMode(isOnline: boolean | null) {
  testModeOverride = isOnline
  // Déclencher un événement personnalisé
  window.dispatchEvent(new CustomEvent('test-network-change', { detail: isOnline }))
}

export function useOnline() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    // Fonction pour vérifier la connexion
    const checkConnection = async () => {
      // Si on est en mode test, utiliser la valeur forcée
      if (testModeOverride !== null) {
        setIsOnline(testModeOverride)
        console.log('🧪 Test mode:', testModeOverride ? 'ONLINE' : 'OFFLINE')
        return
      }

      // En développement/local : utiliser uniquement navigator.onLine
      if (process.env.NODE_ENV !== 'production' || window.location.hostname === 'localhost') {
        setIsOnline(navigator.onLine)
        console.log('🌐 [DEV] navigator.onLine:', navigator.onLine)
        return
      }
    }

    // Fonction pour mettre à jour le statut de connexion
    const updateOnlineStatus = () => {
      checkConnection()
    }

    // Gestionnaire pour les changements de mode test
    const handleTestModeChange = (event: any) => {
      checkConnection()
    }

    // Initialiser le statut au chargement
    updateOnlineStatus()

    // Vérification périodique toutes les 10 secondes
    const interval = setInterval(checkConnection, 10000)

    // Écouter les événements de changement de connexion
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)
    window.addEventListener('test-network-change', handleTestModeChange)

    // Nettoyage des événements lors du démontage du composant
    return () => {
      clearInterval(interval)
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
      window.removeEventListener('test-network-change', handleTestModeChange)
    }
  }, [])

  return isOnline
}
