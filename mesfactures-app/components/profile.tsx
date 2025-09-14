"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User, Settings, Bell, HelpCircle, LogOut, ChevronRight, Wifi, WifiOff } from "lucide-react"
import { useOnline } from "@/hooks/use-online"

interface ProfileProps {
  user: any
  onLogout: () => void
}

export function Profile({ user, onLogout }: ProfileProps) {
  const isOnline = useOnline()
  
  const menuItems = [
    { icon: Settings, label: "Paramètres", action: () => {} },
    { icon: Bell, label: "Notifications", action: () => {} },
    { icon: HelpCircle, label: "Aide & Support", action: () => {} },
  ]

  // Log user data pour debugging
  console.log('👤 User data in Profile:', user)

  // Fonction pour formater la date de création
  const formatMemberSince = (user: any) => {
    // Si l'utilisateur a une date de création
    if (user.dateCreation || user.createdAt || user.created_at) {
      const dateCreation = new Date(user.dateCreation || user.createdAt || user.created_at)
      const options: Intl.DateTimeFormatOptions = { 
        year: 'numeric', 
        month: 'long' 
      }
      return `Membre depuis ${dateCreation.toLocaleDateString('fr-FR', options)}`
    }
    
    // Si pas de date, utiliser la date actuelle comme fallback
    const now = new Date()
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long' 
    }
    return `Membre depuis ${now.toLocaleDateString('fr-FR', options)}`
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header avec statut de connexion */}
      <div className="pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <User className="w-6 h-6 text-primary" />
              Profil
            </h1>
            <p className="text-muted-foreground">Gérez votre compte</p>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
            isOnline 
              ? 'bg-green-100 text-green-700 border border-green-200' 
              : 'bg-red-100 text-red-700 border border-red-200'
          }`}>
            {isOnline ? (
              <>
                <Wifi className="w-4 h-4" />
                En ligne
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4" />
                Hors ligne
              </>
            )}
          </div>
        </div>
      </div>

      {/* User Info Card */}
      <Card className="gradient-card border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                {(user.username || user.name || 'U')
                  .substring(0, 2)
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold text-foreground">{user.username || user.name || 'Utilisateur'}</h2>
              <p className="text-muted-foreground">{user.email}</p>
              <p className="text-sm text-primary font-medium mt-1">{formatMemberSince(user)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="shadow-md">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">12</p>
            <p className="text-sm text-muted-foreground">Transactions ce mois</p>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-accent">4</p>
            <p className="text-sm text-muted-foreground">Budgets actifs</p>
          </CardContent>
        </Card>
      </div>

      {/* Menu Items */}
      <Card className="shadow-md">
        <CardContent className="p-0">
          {menuItems.map((item, index) => (
            <Button
              key={item.label}
              variant="ghost"
              className="w-full justify-between h-auto p-4 rounded-none"
              onClick={item.action}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5 text-muted-foreground" />
                <span className="text-foreground">{item.label}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Logout Button */}
      <Button
        variant="outline"
        className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 bg-transparent"
        onClick={onLogout}
      >
        <LogOut className="w-4 h-4 mr-2" />
        Se déconnecter
      </Button>
    </div>
  )
}
