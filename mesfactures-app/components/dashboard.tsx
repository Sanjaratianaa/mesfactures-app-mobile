"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Wallet, Target, PieChartIcon, BarChart3, Trophy, Zap, Star } from "lucide-react"
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"

interface DashboardProps {
  user: any
  transactions: any[]
  userStats: any
  goals: any[]
}

export function Dashboard({ user, transactions, userStats, goals }: DashboardProps) {
  const totalBalance = transactions.reduce((sum, t) => sum + t.amount, 0)
  const monthlyExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)
  const monthlyIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

  const recentTransactions = transactions.slice(0, 3)

  const expensesByCategory = transactions
    .filter((t) => t.type === "expense")
    .reduce(
      (acc, t) => {
        const category = t.category
        acc[category] = (acc[category] || 0) + Math.abs(t.amount)
        return acc
      },
      {} as Record<string, number>,
    )

  const pieData = Object.entries(expensesByCategory).map(([category, amount]) => ({
    name: category,
    value: amount,
    color: getCategoryColor(category),
  }))

  // Monthly evolution data (mock data for demo)
  const monthlyData = [
    { month: "Jan", revenus: 2400, depenses: 1800 },
    { month: "Fév", revenus: 2600, depenses: 2100 },
    { month: "Mar", revenus: 2500, depenses: 1900 },
    { month: "Avr", revenus: 2800, depenses: 2200 },
    { month: "Mai", revenus: 2700, depenses: 2000 },
    { month: "Juin", revenus: 2900, depenses: 2300 },
  ]

  const budgetData = [
    { category: "Alimentation", budget: 400, spent: expensesByCategory["Alimentation"] || 0 },
    { category: "Transport", budget: 200, spent: expensesByCategory["Transport"] || 0 },
    { category: "Loisirs", budget: 150, spent: expensesByCategory["Loisirs"] || 0 },
    { category: "Shopping", budget: 100, spent: expensesByCategory["Shopping"] || 0 },
  ]

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Bonjour, {user.username || user.name || 'Utilisateur'}</h1>
            <p className="text-muted-foreground">Voici un aperçu de vos finances</p>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <Badge variant="secondary" className="bg-gradient-to-r from-yellow-100 to-orange-100">
              Niveau {userStats.level}
            </Badge>
          </div>
        </div>
      </div>

      <Card className="shadow-md border-l-4 border-l-yellow-500">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium">Progression</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {userStats.xp}/{userStats.xpToNext} XP
            </span>
          </div>
          <Progress value={(userStats.xp / userStats.xpToNext) * 100} className="h-2" />
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <span>🔥 {userStats.streak} jours de suite</span>
            <span>
              +{userStats.xpToNext - userStats.xp} XP pour niveau {userStats.level + 1}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Balance Card */}
      <Card className="gradient-card border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Solde total</p>
              <p className="text-3xl font-bold text-foreground">{totalBalance.toFixed(2)} €</p>
            </div>
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
              <Wallet className="w-6 h-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      {goals.length > 0 && (
        <Card className="shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Objectifs en cours
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {goals.slice(0, 2).map((goal) => (
              <div key={goal.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{goal.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {goal.current}€ / {goal.target}€
                  </span>
                </div>
                <Progress
                  value={(goal.current / goal.target) * 100}
                  className="h-2"
                  style={{
                    background: `linear-gradient(to right, ${goal.color}20, ${goal.color}40)`,
                  }}
                />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{Math.round((goal.current / goal.target) * 100)}% atteint</span>
                  <span>Échéance: {new Date(goal.deadline).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Dépenses</p>
                <p className="text-lg font-semibold text-foreground">{monthlyExpenses.toFixed(2)} €</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Revenus</p>
                <p className="text-lg font-semibold text-foreground">{monthlyIncome.toFixed(2)} €</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-md border-l-4 border-l-blue-500">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Star className="w-5 h-5 text-blue-500" />
            Défi du mois
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">{userStats.monthlyChallenge.name}</span>
              <Badge
                variant={
                  userStats.monthlyChallenge.progress >= userStats.monthlyChallenge.target ? "default" : "secondary"
                }
              >
                {userStats.monthlyChallenge.progress >= userStats.monthlyChallenge.target ? "Terminé!" : "En cours"}
              </Badge>
            </div>
            <Progress
              value={(userStats.monthlyChallenge.progress / userStats.monthlyChallenge.target) * 100}
              className="h-3"
            />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {userStats.monthlyChallenge.progress}€ / {userStats.monthlyChallenge.target}€
              </span>
              <span className="text-blue-600 font-medium">+{userStats.monthlyChallenge.reward} XP</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pie Chart - Expenses by Category */}
      <Card className="shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <PieChartIcon className="w-5 h-5 text-primary" />
            Dépenses par catégorie
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={80} paddingAngle={5} dataKey="value">
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${Number(value).toFixed(2)} €`, "Montant"]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1">
            {pieData.map((entry, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span>{entry.name}</span>
                </div>
                <span className="font-medium">{Number(entry.value).toFixed(2)} €</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Budget Progress Bars */}
      <Card className="shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Progression budgets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={budgetData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="category" type="category" width={80} />
              <Tooltip formatter={(value) => [`${Number(value).toFixed(2)} €`, "Montant"]} />
              <Bar dataKey="budget" fill="#e5e7eb" name="Budget" />
              <Bar dataKey="spent" fill="#9bc53d" name="Dépensé" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Monthly Evolution */}
      <Card className="shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Évolution mensuelle
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`${Number(value).toFixed(2)} €`, "Montant"]} />
              <Line type="monotone" dataKey="revenus" stroke="#9bc53d" strokeWidth={3} name="Revenus" />
              <Line type="monotone" dataKey="depenses" stroke="#ef4444" strokeWidth={3} name="Dépenses" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Budget Progress */}
      <Card className="shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Budget mensuel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Dépensé ce mois</span>
              <span className="font-medium">{monthlyExpenses.toFixed(2)} € / 1500 €</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((monthlyExpenses / 1500) * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {monthlyExpenses < 1500
                ? `Il vous reste ${(1500 - monthlyExpenses).toFixed(2)} € ce mois`
                : "Budget dépassé !"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card className="shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Transactions récentes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">{transaction.title}</p>
                <p className="text-xs text-muted-foreground">{transaction.category}</p>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                  {transaction.amount > 0 ? "+" : ""}
                  {transaction.amount.toFixed(2)} €
                </p>
                <p className="text-xs text-muted-foreground">{transaction.date}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    Alimentation: "#f97316",
    Transport: "#3b82f6",
    Loisirs: "#8b5cf6",
    Revenus: "#10b981",
    Santé: "#ef4444",
    Shopping: "#ec4899",
  }
  return colors[category] || "#6b7280"
}
