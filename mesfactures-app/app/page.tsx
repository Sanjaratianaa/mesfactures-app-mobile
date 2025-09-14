"use client"

import { useState, useEffect } from "react"
import { LoginScreen } from "@/components/login-screen"
import { RegisterScreen } from "@/components/register-screen"
import { MainApp } from "@/components/main-app"
import { AuthService } from "@/services/auth"

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<"login" | "register" | "app" | "loading">("loading")
  const [user, setUser] = useState<any>(null)

  // Check authentication status on app start
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authStatus = await AuthService.checkAuthStatus()
        
        if (authStatus.isAuthenticated && authStatus.user) {
          setUser(authStatus.user)
          setCurrentScreen("app")
        } else {
          setCurrentScreen("login")
        }
      } catch (error) {
        console.error("Auth check error:", error)
        setCurrentScreen("login")
      }
    }

    checkAuth()
  }, [])

  const handleLogin = (userData: any) => {
    console.log('🔑 handleLogin called with:', userData)
    setUser(userData)
    setCurrentScreen("app")
  }

  const handleRegister = (userData: any) => {
    console.log('📝 handleRegister called with:', userData)
    // For registration, we redirect to login instead of auto-login
    setCurrentScreen("login")
  }

  const handleLogout = () => {
    AuthService.logout()
    setUser(null)
    setCurrentScreen("login")
  }

  // Show loading screen while checking authentication
  if (currentScreen === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    )
  }

  if (currentScreen === "app" && user) {
    return (
      <MainApp
        user={user}
        onLogout={handleLogout}
      />
    )
  }

  if (currentScreen === "register") {
    return <RegisterScreen onRegister={handleRegister} onBackToLogin={() => setCurrentScreen("login")} />
  }

  return <LoginScreen onLogin={handleLogin} onGoToRegister={() => setCurrentScreen("register")} />
}
