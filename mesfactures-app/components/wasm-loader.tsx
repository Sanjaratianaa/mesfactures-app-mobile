"use client"

import { useEffect, useState } from 'react'

export function WasmLoader({ children }: { children: React.ReactNode }) {
  const [isWasmReady, setIsWasmReady] = useState(false)

  useEffect(() => {
    // Check if WebAssembly is supported
    if (typeof WebAssembly === 'object' && 
        typeof WebAssembly.instantiate === 'function') {
      
      // Simple test to check if WebAssembly works
      const testWasm = async () => {
        try {
          // This is a simple test to check if WebAssembly works
          const importObject = { 
            env: { 
              memory: new WebAssembly.Memory({ initial: 1 }) 
            } 
          };
          
          // Try to instantiate a simple wasm module
          const wasmModule = await WebAssembly.instantiate(
            new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0]), 
            importObject
          );
          
          if (wasmModule && wasmModule.instance) {
            setIsWasmReady(true);
          }
        } catch (error) {
          console.error("WebAssembly test failed:", error);
          // Fallback to non-WASM mode
          setIsWasmReady(true); // Still continue but with degraded functionality
        }
      };
      
      testWasm();
    } else {
      // WebAssembly is not supported
      console.warn("WebAssembly is not supported in this browser");
      setIsWasmReady(true); // Continue with degraded functionality
    }
  }, []);

  if (!isWasmReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Initializing WebAssembly...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}