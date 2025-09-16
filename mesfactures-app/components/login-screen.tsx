"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Wallet, Eye, EyeOff, AlertCircle } from "lucide-react"
import { AuthService } from "@/services/auth"
import { useOnline } from "@/hooks/use-online"
import { saveLocalUser, checkLocalUser } from "@/lib/database"

interface LoginScreenProps {
  onLogin: (userData: any) => void
  onGoToRegister: () => void
}

export function LoginScreen({ onLogin, onGoToRegister }: LoginScreenProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({})

  const isOnline = useOnline();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {}

    if (!email.trim()) {
      newErrors.email = "L'email est requis"
    } else if (!validateEmail(email)) {
      newErrors.email = "Format d'email invalide"
    }

    if (!password.trim()) {
      newErrors.password = "Le mot de passe est requis"
    } else if (password.length < 6) {
      newErrors.password = "Le mot de passe doit contenir au moins 6 caractères"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({}); // Clear any previous errors

    if (isOnline) {
      // Authentification en ligne (backend)
      try {
        const loginResponse = await AuthService.login({
          email: email.trim(),
          password: password
        });
        // Sauvegarde locale pour usage offline
        await saveLocalUser(email.trim(), password);
        onLogin(loginResponse.user);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Erreur lors de la connexion";
        setErrors({ general: errorMessage });
      } finally {
        setIsLoading(false);
      }
    } else {
      // Authentification offline (locale)
      try {
        const result = await checkLocalUser(email.trim(), password);
        if (result && result.dateCreation) {
          // On simule un user minimal pour le mode offline
          onLogin({ 
            email: email.trim(), 
            offline: true, 
            dateCreation: result.dateCreation,
            id: result.id 
          });
        } else {
          setErrors({ general: "Identifiants invalides (mode hors-ligne)" });
        }
      } catch (error) {
        setErrors({ general: "Erreur lors de la vérification locale" });
      } finally {
        setIsLoading(false);
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-card/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">MesFactures</CardTitle>
            <CardDescription className="text-muted-foreground">Connectez-vous à votre compte</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center gap-2 text-red-700 text-sm">
                <AlertCircle className="w-4 h-4" />
                {errors.general}
              </div>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`bg-background ${errors.email ? "border-red-500" : ""}`}
              />
              {errors.email && (
                <div className="flex items-center gap-2 text-red-500 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.email}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={`bg-background pr-10 ${errors.password ? "border-red-500" : ""}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {errors.password && (
                <div className="flex items-center gap-2 text-red-500 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.password}
                </div>
              )}
            </div>
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={isLoading}
            >
              {isLoading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Pas encore de compte ?{" "}
              <Button variant="link" className="p-0 h-auto text-primary hover:text-primary/80" onClick={onGoToRegister}>
                S'inscrire
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}