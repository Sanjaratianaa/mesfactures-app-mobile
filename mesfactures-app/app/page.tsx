"use client"

import { useState } from "react"
import { LoginScreen } from "@/components/login-screen"
import { RegisterScreen } from "@/components/register-screen"
import { MainApp } from "@/components/main-app"

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<"login" | "register" | "app">("login")
  const [user, setUser] = useState<any>(null)

  const handleLogin = (userData: any) => {
    setUser(userData)
    setCurrentScreen("app")
  }

  const handleRegister = (userData: any) => {
    setUser(userData)
    setCurrentScreen("app")
  }

  if (currentScreen === "app" && user) {
    return (
      <MainApp
        user={user}
        onLogout={() => {
          setUser(null)
          setCurrentScreen("login")
        }}
      />
    )
  }

  if (currentScreen === "register") {
    return <RegisterScreen onRegister={handleRegister} onBackToLogin={() => setCurrentScreen("login")} />
  }

  return <LoginScreen onLogin={handleLogin} onGoToRegister={() => setCurrentScreen("register")} />
}
