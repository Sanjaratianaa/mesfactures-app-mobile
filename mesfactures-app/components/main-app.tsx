"use client"

import { useState, useEffect } from "react"
import { Dashboard } from "@/components/dashboard"
import { Transactions } from "@/components/transactions"
import { Budgets } from "@/components/budgets"
import { Profile } from "@/components/profile"
import { Loans } from "@/components/loans"
import { Goals } from "@/components/goals"
import { Gamification } from "@/components/gamification"
import { AddExpenseModal } from "@/components/add-expense-modal"
import { NetworkStatusToast } from "@/components/network-status-toast"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useOnline } from "@/hooks/use-online"
import {
  Home,
  CreditCard,
  PieChart,
  User,
  Plus,
  Banknote,
  Target,
  Trophy,
  Wifi,
  WifiOff,
  X,
  TrendingDown,
  TrendingUp,
} from "lucide-react"
import { initDatabase } from "@/lib/sqlite";

interface MainAppProps {
  user: any
  onLogout: () => void
}

export function MainApp({ user, onLogout }: MainAppProps) {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [showAddExpense, setShowAddExpense] = useState(false)
  const [showFabOptions, setShowFabOptions] = useState(false)
  const isOnline = useOnline() // Utilisation du hook pour la détection dynamique
  const [syncStatus, setSyncStatus] = useState<"synced" | "syncing" | "offline">("synced")

  const [userStats, setUserStats] = useState({
    level: 3,
    xp: 750,
    xpToNext: 1000,
    streak: 12,
    badges: ["first_budget", "savings_master", "consistent_tracker"],
    monthlyChallenge: {
      name: "Économiser 200€",
      progress: 150,
      target: 200,
      reward: 100,
    },
  })

  const [goals, setGoals] = useState([
    {
      id: 1,
      name: "Vacances d'été",
      target: 2000,
      current: 1200,
      deadline: "2024-06-01",
      category: "Loisirs",
      color: "#3b82f6",
    },
    {
      id: 2,
      name: "Fonds d'urgence",
      target: 5000,
      current: 3200,
      deadline: "2024-12-31",
      category: "Épargne",
      color: "#10b981",
    },
  ])

  const [loans, setLoans] = useState([
    {
      id: 1,
      name: "Prêt immobilier",
      amount: 150000,
      rate: 1.5,
      duration: 240,
      startDate: "2023-01-01",
      monthlyPayment: 717.42,
      remainingAmount: 145000,
      nextPaymentDate: "2024-02-01",
    },
    {
      id: 2,
      name: "Prêt auto",
      amount: 25000,
      rate: 3.2,
      duration: 60,
      startDate: "2023-06-01",
      monthlyPayment: 451.58,
      remainingAmount: 18500,
      nextPaymentDate: "2024-02-15",
    },
  ])

  const [transactions, setTransactions] = useState([
    { id: 1, title: "Courses Carrefour", amount: -45.5, category: "Alimentation", date: "2024-01-15", type: "expense" },
    { id: 2, title: "Salaire", amount: 2500, category: "Revenus", date: "2024-01-01", type: "income" },
    { id: 3, title: "Essence", amount: -65.2, category: "Transport", date: "2024-01-14", type: "expense" },
    { id: 4, title: "Restaurant", amount: -32.8, category: "Loisirs", date: "2024-01-13", type: "expense" },
  ])

  useEffect(() => {
    initDatabase()
      .then(() => console.log("📦 Base SQLite initialisée"))
      .catch((err) => console.error("Erreur SQLite:", err));

    const handleOnline = () => {
      setSyncStatus("syncing")
      console.log('🔄 Connexion rétablie, synchronisation en cours...')
      // Simuler la synchronisation
      setTimeout(() => setSyncStatus("synced"), 2000)
    }

    const handleOffline = () => {
      setSyncStatus("offline")
      console.log('📱 Mode hors ligne activé')
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const addTransaction = (transaction: any) => {
    const newTransaction = {
      id: Date.now(),
      ...transaction,
      date: new Date().toISOString().split("T")[0],
    }
    setTransactions((prev) => [newTransaction, ...prev])

    setUserStats((prev) => ({
      ...prev,
      xp: prev.xp + 10,
      streak: prev.streak + (Math.random() > 0.7 ? 1 : 0),
    }))
  }

  const addLoan = (loan: any) => {
    const newLoan = {
      id: Date.now(),
      ...loan,
      startDate: new Date().toISOString().split("T")[0],
      remainingAmount: loan.amount,
      nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    }
    setLoans((prev) => [...prev, newLoan])
  }

  const addGoal = (goal: any) => {
    const newGoal = {
      id: Date.now(),
      ...goal,
      current: 0,
      color: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"][Math.floor(Math.random() * 5)],
    }
    setGoals((prev) => [...prev, newGoal])
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard user={user} transactions={transactions} userStats={userStats} goals={goals} />
      case "transactions":
        return <Transactions transactions={transactions} setTransactions={setTransactions} />
      case "budgets":
        return <Budgets transactions={transactions} />
      case "loans":
        return <Loans loans={loans} onAddLoan={addLoan} />
      case "goals":
        return <Goals goals={goals} onAddGoal={addGoal} transactions={transactions} />
      case "gamification":
        return <Gamification userStats={userStats} setUserStats={setUserStats} />
      case "profile":
        return <Profile user={user} onLogout={onLogout} />
      default:
        return <Dashboard user={user} transactions={transactions} userStats={userStats} goals={goals} />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Toast de statut réseau */}
      <NetworkStatusToast />
      
      <div className="fixed top-0 left-0 right-0 z-30 bg-card border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
              MesFactures
            </h1>
            <div className="flex items-center gap-1">
              {isOnline ? <Wifi className="w-4 h-4 text-green-500" /> : <WifiOff className="w-4 h-4 text-red-500" />}
              <span className={`text-xs ${isOnline ? "text-green-600" : "text-red-600"}`}>
                {isOnline ? "En ligne" : "Hors ligne"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className={activeTab === "goals" ? "text-primary" : "text-muted-foreground"}
              onClick={() => setActiveTab("goals")}
            >
              <Target className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`relative ${activeTab === "gamification" ? "text-primary" : "text-muted-foreground"}`}
              onClick={() => setActiveTab("gamification")}
            >
              <Trophy className="w-5 h-5" />
              {userStats.monthlyChallenge.progress >= userStats.monthlyChallenge.target && (
                <Badge className="absolute -top-1 -right-1 w-2 h-2 p-0 bg-red-500" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={activeTab === "profile" ? "text-primary" : "text-muted-foreground"}
              onClick={() => setActiveTab("profile")}
            >
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {!isOnline && (
          <div className="bg-red-500 text-white text-center py-2 text-sm">
            <WifiOff className="w-4 h-4 inline mr-2" />
            Mode hors ligne - Les données seront synchronisées à la reconnexion
          </div>
        )}
        {syncStatus === "syncing" && (
          <div className="bg-blue-500 text-white text-center py-2 text-sm">
            <Wifi className="w-4 h-4 inline mr-2 animate-pulse" />
            Synchronisation en cours...
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className={`pt-16 pb-20 ${!isOnline || syncStatus === "syncing" ? "pt-24" : ""}`}>{renderContent()}</div>

      <div className="fixed bottom-20 right-4 z-20">
        {showFabOptions && (
          <div className="flex flex-col gap-3 mb-3">
            <Button
              className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
              onClick={() => {
                setShowFabOptions(false)
              }}
            >
              <X className="w-5 h-5 text-white" />
            </Button>
            <Button
              className="w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-600 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
              onClick={() => {
                setShowAddExpense(true)
                setShowFabOptions(false)
              }}
            >
              <TrendingDown className="w-5 h-5 text-white" />
            </Button>
            <Button
              className="w-12 h-12 rounded-full bg-yellow-500 hover:bg-yellow-600 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
              onClick={() => {
                // TODO: Open add income modal
                setShowFabOptions(false)
              }}
            >
              <TrendingUp className="w-5 h-5 text-white" />
            </Button>
          </div>
        )}
        <Button
          className="w-14 h-14 rounded-full bg-gradient-to-r from-green-500 to-green-600 shadow-lg hover:shadow-xl transition-all duration-200 z-20 hover:scale-110"
          onClick={() => setShowFabOptions(!showFabOptions)}
        >
          <Plus
            className={`w-6 h-6 text-white transition-transform duration-200 ${showFabOptions ? "rotate-45" : ""}`}
          />
        </Button>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-10">
        <div className="flex items-center justify-around py-2">
          {[
            { id: "dashboard", icon: Home, label: "Accueil" },
            { id: "transactions", icon: CreditCard, label: "Transactions" },
            { id: "budgets", icon: PieChart, label: "Budgets" },
            { id: "loans", icon: Banknote, label: "Prêts" },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant="ghost"
              className={`flex flex-col items-center gap-1 h-auto py-2 px-3 relative ${
                activeTab === tab.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon className="w-5 h-5" />
              <span className="text-xs">{tab.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Add Expense Modal */}
      <AddExpenseModal open={showAddExpense} onClose={() => setShowAddExpense(false)} onAdd={addTransaction} />
    </div>
  )
}
