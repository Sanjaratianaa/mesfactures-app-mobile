// components/sqlite-scripts.tsx
"use client"

import { Capacitor } from '@capacitor/core'
import Script from 'next/script'

export function SQLiteScripts() {
  if (Capacitor.getPlatform() !== 'web') return null

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/jeep-sqlite@2.4.26/dist/jeep-sqlite/jeep-sqlite.js"
        strategy="beforeInteractive"
      />
    </>
  )
}
