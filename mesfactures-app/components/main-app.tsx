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
import { AddInvoiceModal } from "@/components/add-invoice-modal"
import { NetworkStatusToast } from "@/components/network-status-toast"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useOnline } from "@/hooks/use-online"
import { offlineDataService } from "@/services/offline-data"
import { Transaction, Goal, Loan, UserStats } from "@/services/offline-data"
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
  AlertCircle,
  RefreshCw as Sync,
  FileText
} from "lucide-react"

// Extended types for UI-specific fields
interface GoalWithColor extends Goal {
  color: string
}

interface LoanWithExtras extends Loan {
  remainingAmount: number
  nextPaymentDate: string
}

interface MainAppProps {
  user: any
  onLogout: () => void
}

export function MainApp({ user, onLogout }: MainAppProps) {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [showAddExpense, setShowAddExpense] = useState(false)
  const [showFabOptions, setShowFabOptions] = useState(false)
  const [showAddInvoice, setShowAddInvoice] = useState(false)
  const isOnline = useOnline()
  const [syncStatus, setSyncStatus] = useState<"synced" | "syncing" | "offline">("synced")
  const [dataServiceReady, setDataServiceReady] = useState(false)
  const [serviceError, setServiceError] = useState<string | null>(null)
  const [pendingSyncCount, setPendingSyncCount] = useState(0)

  // Data
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [goals, setGoals] = useState<GoalWithColor[]>([])
  const [loans, setLoans] = useState<LoanWithExtras[]>([])
  const [userStats, setUserStats] = useState<UserStats>({
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
    transactionCount: 0,
    totalExpenses: 0,
    totalRevenues: 0,
    balance: 0,
  })

  // Initialize offline data service
  useEffect(() => {
    const initializeService = async () => {
      try {
        await offlineDataService.initialize()
        setDataServiceReady(true)
        setServiceError(null)
        await loadUserData()
      } catch (error: any) {
        setServiceError(`Service initialization failed: ${error.message || error}`)
        setDataServiceReady(false)
      }
    }
    initializeService()
  }, [user])

  const loadUserData = async () => {
    if (!dataServiceReady || !user?.id) return;

    try {
      // Transactions
      const rawTransactions = await offlineDataService.getTransactions(user.id, 50, 0);
      const normalizedTransactions: Transaction[] = rawTransactions.map(t => ({
        ...t,
        type: t.type === 'income' ? 'revenu' : 'depense',
      }));
      setTransactions(normalizedTransactions);

      // Goals
      const rawGoals = await offlineDataService.getGoals(user.id);
      const colorPalette = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];
      setGoals(
        rawGoals.map(g => ({
          ...g,
          color: colorPalette[(g.id ?? 0) % colorPalette.length],
        }))
      );

      // Loans
      const rawLoans = await offlineDataService.getLoans(user.id);
      setLoans(
        rawLoans.map(l => ({
          ...l,
          remainingAmount: l.montant,
          nextPaymentDate: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0]
        }))
      );

      // Stats
      const stats = await offlineDataService.getUserStats(user.id);
      setUserStats(prev => ({ ...prev, ...stats }));
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };


  // Network & Sync
  useEffect(() => {
    const handleOnline = async () => {
      setSyncStatus("syncing")
      try {
        const pendingCount = offlineDataService.getSyncQueueSize()
        setPendingSyncCount(pendingCount)
        if (pendingCount > 0) await offlineDataService.processSyncQueue()
        setPendingSyncCount(0)
        setSyncStatus("synced")
        await loadUserData()
      } catch {
        setSyncStatus("offline")
      }
    }

    const handleOffline = () => {
      setSyncStatus("offline")
      setPendingSyncCount(offlineDataService.getSyncQueueSize())
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)
    isOnline ? handleOnline() : handleOffline()

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [dataServiceReady])

  // Add functions
  const addTransaction = async (transaction: Transaction) => {
    if (!dataServiceReady || !user?.id) return;

    try {
      await offlineDataService.addTransaction(user.id, {
        title: transaction.title,
        amount: transaction.amount,
        category: transaction.category,
        type: transaction.type === 'depense' ? 'expense' : 'income',
        date: transaction.date
      });

      await loadUserData();
    } catch (error) {
      console.error(error);
    }
  };

  const addLoan = async (loan: Loan) => {
    if (!dataServiceReady || !user?.id) return;

    try {
      await offlineDataService.addLoan(user.id, {
        name: loan.description,
        amount: loan.montant,
        rate: loan.taux,
        duration: loan.duree,
        monthlyPayment: loan.mensualite
      });

      await loadUserData();
    } catch (error) {
      console.error(error);
    }
  };

  const addGoal = async (goal: GoalWithColor) => {
    if (!dataServiceReady || !user?.id) return;

    try {
      await offlineDataService.addGoal(user.id, {
        name: goal.nom,
        target: goal.montant_cible,
        deadline: goal.date_limite,
        category: goal.description
      });

      await loadUserData();
    } catch (error) {
      console.error(error);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard user={user} transactions={transactions} goals={goals} userStats={userStats} />
      case "transactions":
        return <Transactions user={user} />
      case "budgets":
        return <Budgets transactions={transactions} />
      case "loans":
        return <Loans
          loans={loans.map(l => ({
            id: l.id ?? 0,
            name: l.description,        // correspond à 'name' attendu
            amount: l.montant,
            rate: l.taux,
            duration: l.duree,
            startDate: l.date_debut,
            monthlyPayment: l.mensualite,
            remainingAmount: l.remainingAmount,
            nextPaymentDate: l.nextPaymentDate,
          }))}
          onAddLoan={addLoan}
        />
      case "goals":
        return <Goals utilisateurId={user.id} goals={goals} onAddGoal={addGoal} transactions={transactions} />
      case "gamification":
        return <Gamification userStats={userStats} setUserStats={setUserStats} />
      case "profile":
        return <Profile user={user} onLogout={onLogout} />
      default:
        return <Dashboard user={user} transactions={transactions} goals={goals} userStats={userStats} />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Network Status Toast */}
      <NetworkStatusToast />
      
      {/* Header */}
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
              {!dataServiceReady && !isOnline && (
                <span title="Service de données non disponible">
                  <AlertCircle className="w-4 h-4 text-yellow-500 ml-1" />
                </span>
              )}
              {pendingSyncCount > 0 && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  <Sync className="w-3 h-3 mr-1" />
                  {pendingSyncCount}
                </Badge>
              )}
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

        {/* Status Banners */}
        {!isOnline && (
          <div className="bg-red-500 text-white text-center py-2 text-sm">
            <WifiOff className="w-4 h-4 inline mr-2" />
            Mode hors ligne - {dataServiceReady ? "Données sauvegardées localement" : "Fonctionnalités limitées"}
            {pendingSyncCount > 0 && ` • ${pendingSyncCount} en attente de synchronisation`}
          </div>
        )}
        {syncStatus === "syncing" && (
          <div className="bg-blue-500 text-white text-center py-2 text-sm">
            <Sync className="w-4 h-4 inline mr-2 animate-spin" />
            Synchronisation en cours...
          </div>
        )}
        {serviceError && (
          <div className="bg-yellow-500 text-white text-center py-2 text-sm">
            <AlertCircle className="w-4 h-4 inline mr-2" />
            Avertissement: {serviceError}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className={`pt-16 pb-20 ${(!isOnline || syncStatus === "syncing" || serviceError) ? "pt-24" : ""}`}>
        {renderContent()}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-20 right-4 z-20">
        {showFabOptions && (
          <div className="flex flex-col gap-3 mb-3">
            <Button
              className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
              onClick={() => {
                setShowFabOptions(false);
              }}
            >
              <X className="w-5 h-5 text-white" />
            </Button>
            <Button
              className="w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-600 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
              onClick={() => {
                setShowAddExpense(true);
                setShowFabOptions(false);
              }}
              disabled={!dataServiceReady}
              title={!dataServiceReady ? "Service de données non disponible" : "Ajouter une dépense"}
            >
              <TrendingDown className="w-5 h-5 text-white" />
            </Button>
            <Button
              className="w-12 h-12 rounded-full bg-yellow-500 hover:bg-yellow-600 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
              onClick={() => {
                // TODO: Open add income modal
                setShowFabOptions(false);
              }}
              disabled={!dataServiceReady}
              title={!dataServiceReady ? "Service de données non disponible" : "Ajouter un revenu"}
            >
              <TrendingUp className="w-5 h-5 text-white" />
            </Button>
            <Button
              className="w-12 h-12 rounded-full bg-green-700 hover:bg-green-800 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
              onClick={() => {
                setShowAddInvoice(true);
                setShowFabOptions(false);
              }}
              disabled={!isOnline}
              title={!isOnline ? "Fonctionnalité disponible uniquement en ligne" : "Ajouter une facture (OCR)"}
            >
              <FileText className="w-5 h-5 text-white" />
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

      {/* Modals */}
      <AddExpenseModal 
        open={showAddExpense} 
        onClose={() => setShowAddExpense(false)} 
        onAdd={addTransaction} 
      />
      <AddInvoiceModal 
        open={showAddInvoice} 
        onClose={() => setShowAddInvoice(false)} 
      />
    </div>
  )
}