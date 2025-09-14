"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Wifi, WifiOff } from 'lucide-react'

interface NetworkTestButtonProps {
  onToggle: (isOnline: boolean) => void
}

export function NetworkTestButton({ onToggle }: NetworkTestButtonProps) {
  const [testMode, setTestMode] = useState<boolean | null>(null)

  const handleToggle = () => {
    const newState = testMode === null ? false : !testMode
    setTestMode(newState)
    onToggle(newState)
  }

  const resetToAuto = () => {
    setTestMode(null)
    // Trigger real network check
    window.dispatchEvent(new Event('online'))
  }

  if (process.env.NODE_ENV !== 'development') {
    return null // Ne montrer qu'en développement
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-2">
      <Button
        size="sm"
        variant="outline"
        onClick={handleToggle}
        className={`text-xs ${testMode === false ? 'bg-red-100 text-red-700' : testMode === true ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}
      >
        {testMode === false ? (
          <>
            <WifiOff className="w-3 h-3 mr-1" />
            Test: OFF
          </>
        ) : testMode === true ? (
          <>
            <Wifi className="w-3 h-3 mr-1" />
            Test: ON
          </>
        ) : (
          <>
            <Wifi className="w-3 h-3 mr-1" />
            Auto
          </>
        )}
      </Button>
      {testMode !== null && (
        <Button
          size="sm"
          variant="ghost"
          onClick={resetToAuto}
          className="text-xs"
        >
          Reset
        </Button>
      )}
    </div>
  )
}
