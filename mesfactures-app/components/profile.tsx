"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User, Settings, Bell, HelpCircle, LogOut, ChevronRight } from "lucide-react"

interface ProfileProps {
  user: any
  onLogout: () => void
}

export function Profile({ user, onLogout }: ProfileProps) {
  const menuItems = [
    { icon: Settings, label: "Paramètres", action: () => {} },
    { icon: Bell, label: "Notifications", action: () => {} },
    { icon: HelpCircle, label: "Aide & Support", action: () => {} },
  ]

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="pt-4">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <User className="w-6 h-6 text-primary" />
          Profil
        </h1>
        <p className="text-muted-foreground">Gérez votre compte</p>
      </div>

      {/* User Info Card */}
      <Card className="gradient-card border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                {user.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
              <p className="text-muted-foreground">{user.email}</p>
              <p className="text-sm text-primary font-medium mt-1">Membre depuis janvier 2024</p>
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
