"use client"

import { useState, useEffect } from "react"
import { LoginScreen } from "@/components/login-screen"
import { RegisterScreen } from "@/components/register-screen"
import { MainApp } from "@/components/main-app"
import { AuthService } from "@/services/auth"
import { WasmLoader } from "@/components/wasm-loader"

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<"login" | "register" | "app" | "loading">("loading")
  const [user, setUser] = useState<any>(null)
  const [dbInitialized, setDbInitialized] = useState(false)
  const [initError, setInitError] = useState<string | null>(null)

  // Initialize IndexedDB instead of SQLite
  useEffect(() => {
    const initializeDB = async () => {
      try {
        console.log("🚀 Starting IndexedDB initialization...");
        if (typeof window === "undefined") return;

        // Import IndexedDB module instead of SQLite
        const { initDatabase } = await import("@/lib/database");

        // Initialize IndexedDB
        await initDatabase();

        console.log("✅ IndexedDB initialized successfully");
        setDbInitialized(true);
      } catch (error) {
        console.error("❌ IndexedDB initialization failed:", error);
        setInitError(`IndexedDB initialization failed: ${error}`);
        setDbInitialized(true); // Continue with degraded functionality
      }
    };

    initializeDB();
  }, []);

  
  // Check authentication status after DB is initialized
  useEffect(() => {
    if (!dbInitialized) return;

    const checkAuth = async () => {
      try {
        console.log('🔍 Checking authentication status...');
        
        // Add a small delay to ensure everything is ready
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const authStatus = await AuthService.checkAuthStatus();
        
        if (authStatus.isAuthenticated && authStatus.user) {
          console.log('✅ User is authenticated:', authStatus.user.email);
          setUser(authStatus.user);
          setCurrentScreen("app");
        } else {
          console.log('ℹ️ User not authenticated, showing login screen');
          setCurrentScreen("login");
        }
      } catch (error) {
        console.error('❌ Auth check error:', error);
        // Even if auth check fails, show login screen
        setCurrentScreen("login");
      }
    }

    checkAuth();
  }, [dbInitialized]);

  const handleLogin = (userData: any) => {
    console.log('✅ Login successful:', userData.email);
    setUser(userData);
    setCurrentScreen("app");
    setInitError(null); // Clear any previous errors
  }

  const handleRegister = (userData: any) => {
    console.log('✅ Registration completed for:', userData.email);
    setCurrentScreen("login");
  }

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      setUser(null);
      setCurrentScreen("login");
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Force logout even if there's an error
      setUser(null);
      setCurrentScreen("login");
    }
  }

  // Show loading screen while checking authentication
  if (currentScreen === "loading" || !dbInitialized) {
    return (
      <WasmLoader>
        <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground mb-2">
              {!dbInitialized ? "Initialisation de la base de données..." : "Vérification de l'authentification..."}
            </p>
            {initError && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800">
                  ⚠️ Avertissement: {initError}
                </p>
                <p className="text-xs text-yellow-600 mt-1">
                  L'application continuera à fonctionner avec des fonctionnalités limitées.
                </p>
              </div>
            )}
          </div>
        </div>
      </WasmLoader>
    )
  }

  // Show main app if user is authenticated
  if (currentScreen === "app" && user) {
    return (
      <>
        <MainApp
          user={user}
          onLogout={handleLogout}
        />
      </>
    )
  }

  // Show register screen
  if (currentScreen === "register") {
    return (
      <>
        <RegisterScreen 
          onRegister={handleRegister} 
          onBackToLogin={() => setCurrentScreen("login")} 
        />
      </>
    )
  }

  // Show login screen (default)
  return (
    <>
      <div>
        {initError && (
          <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-50 border-b border-yellow-200 p-2">
            <p className="text-sm text-yellow-800 text-center">
              ⚠️ Base de données en mode dégradé - Certaines fonctionnalités peuvent être limitées
            </p>
          </div>
        )}
        <LoginScreen 
          onLogin={handleLogin} 
          onGoToRegister={() => setCurrentScreen("register")} 
        />
      </div>
    </>
  )
}