"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, Zap, Target, Award, TrendingUp, Gift } from "lucide-react"

interface GamificationProps {
  userStats: any
  setUserStats: (stats: any) => void
}

export function Gamification({ userStats, setUserStats }: GamificationProps) {
  const badges = [
    { id: "first_budget", name: "Premier budget", description: "Créer votre premier budget", icon: "🎯", earned: true },
    {
      id: "savings_master",
      name: "Maître de l'épargne",
      description: "Économiser 500€ en un mois",
      icon: "💰",
      earned: true,
    },
    {
      id: "consistent_tracker",
      name: "Suivi régulier",
      description: "Ajouter des transactions 7 jours de suite",
      icon: "📊",
      earned: true,
    },
    {
      id: "goal_achiever",
      name: "Objectif atteint",
      description: "Atteindre un objectif d'épargne",
      icon: "🏆",
      earned: false,
    },
    {
      id: "expense_cutter",
      name: "Réducteur de dépenses",
      description: "Réduire les dépenses de 20%",
      icon: "✂️",
      earned: false,
    },
    {
      id: "investment_starter",
      name: "Investisseur débutant",
      description: "Faire son premier investissement",
      icon: "📈",
      earned: false,
    },
  ]

  const challenges = [
    {
      id: 1,
      name: "Économiser 200€",
      description: "Atteignez 200€ d'économies ce mois",
      progress: userStats.monthlyChallenge.progress,
      target: userStats.monthlyChallenge.target,
      reward: 100,
      type: "monthly",
      icon: "💰",
    },
    {
      id: 2,
      name: "Zéro fast-food",
      description: "Pas de dépenses en restauration rapide cette semaine",
      progress: 5,
      target: 7,
      reward: 50,
      type: "weekly",
      icon: "🥗",
    },
    {
      id: 3,
      name: "Suivi quotidien",
      description: "Ajouter au moins une transaction par jour",
      progress: userStats.streak,
      target: 30,
      reward: 200,
      type: "daily",
      icon: "📱",
    },
  ]

  const financialHealthScore = Math.min(
    100,
    Math.max(0, userStats.xp / 10 + userStats.streak * 2 + badges.filter((b) => b.earned).length * 5),
  )

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getHealthScoreLabel = (score: number) => {
    if (score >= 80) return "Excellente"
    if (score >= 60) return "Bonne"
    if (score >= 40) return "Moyenne"
    return "À améliorer"
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="pt-4">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-500" />
          Gamification
        </h1>
        <p className="text-muted-foreground">Défis, badges et progression</p>
      </div>

      {/* Level & XP Card */}
      <Card className="shadow-md bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-purple-800">Niveau {userStats.level}</h2>
              <p className="text-purple-600">Gestionnaire financier</p>
            </div>
            <div className="text-right">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Trophy className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progression vers niveau {userStats.level + 1}</span>
              <span>
                {userStats.xp}/{userStats.xpToNext} XP
              </span>
            </div>
            <Progress value={(userStats.xp / userStats.xpToNext) * 100} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Financial Health Score */}
      <Card className="shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Score de santé financière
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className={`text-4xl font-bold ${getHealthScoreColor(financialHealthScore)}`}>
              {financialHealthScore}/100
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {getHealthScoreLabel(financialHealthScore)}
            </Badge>
            <Progress value={financialHealthScore} className="h-4" />
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="font-semibold">{userStats.streak}</div>
                <div className="text-muted-foreground">Jours de suite</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">{badges.filter((b) => b.earned).length}</div>
                <div className="text-muted-foreground">Badges obtenus</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">{userStats.xp}</div>
                <div className="text-muted-foreground">XP total</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Challenges */}
      <Card className="shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Défis actifs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {challenges.map((challenge) => (
            <Card key={challenge.id} className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{challenge.icon}</span>
                    <div>
                      <h3 className="font-semibold">{challenge.name}</h3>
                      <p className="text-sm text-muted-foreground">{challenge.description}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    +{challenge.reward} XP
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progression</span>
                    <span>
                      {challenge.progress}/{challenge.target}
                    </span>
                  </div>
                  <Progress value={(challenge.progress / challenge.target) * 100} className="h-2" />
                  {challenge.progress >= challenge.target && (
                    <div className="flex items-center gap-2 text-green-600 text-sm">
                      <Gift className="w-4 h-4" />
                      <span>Défi terminé ! Réclamez votre récompense</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Badges Collection */}
      <Card className="shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Collection de badges
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {badges.map((badge) => (
              <Card
                key={badge.id}
                className={`text-center p-4 ${badge.earned ? "bg-yellow-50 border-yellow-200" : "bg-gray-50 border-gray-200 opacity-60"}`}
              >
                <div className="text-3xl mb-2">{badge.icon}</div>
                <h3 className="font-semibold text-sm">{badge.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
                {badge.earned && (
                  <Badge variant="default" className="mt-2 bg-yellow-500">
                    Obtenu
                  </Badge>
                )}
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Streak Counter */}
      <Card className="shadow-md border-l-4 border-l-orange-500">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold">Série en cours</h3>
                <p className="text-sm text-muted-foreground">Jours consécutifs d'activité</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-orange-600">🔥 {userStats.streak}</div>
              <p className="text-xs text-muted-foreground">jours</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
