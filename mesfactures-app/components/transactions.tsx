"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  CreditCard,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Download,
  FileText,
  Trash2,
  RefreshCw,
  Calendar,
  AlertCircle,
  WifiOff,
} from "lucide-react"
import { useState, useEffect } from "react"
// import { offlineDataService } from "@/services/offline-data"
// import { useOnline } from "@/hooks/use-online"

// Données de test directement dans le composant
const testTransactions = [
  // Revenus
  { 
    id: 1, 
    title: "Salaire mensuel", 
    category: "Revenus", 
    type: "income", 
    amount: 3200, 
    date: "2025-09-01",
    description: "Salaire du mois de septembre"
  },
  { 
    id: 2, 
    title: "Prime de performance", 
    category: "Revenus", 
    type: "income", 
    amount: 500, 
    date: "2025-09-15",
    description: "Prime trimestrielle"
  },
  { 
    id: 3, 
    title: "Remboursement frais", 
    category: "Revenus", 
    type: "income", 
    amount: 125, 
    date: "2025-09-10",
    description: "Remboursement frais de transport"
  },

  // Alimentation
  { 
    id: 4, 
    title: "Courses Carrefour", 
    category: "Alimentation", 
    type: "expense", 
    amount: -89.50, 
    date: "2025-09-14",
    description: "Courses hebdomadaires"
  },
  { 
    id: 5, 
    title: "Restaurant Le Jardin", 
    category: "Alimentation", 
    type: "expense", 
    amount: -42.80, 
    date: "2025-09-13",
    description: "Déjeuner d'affaires"
  },
  { 
    id: 6, 
    title: "Boulangerie Paul", 
    category: "Alimentation", 
    type: "expense", 
    amount: -12.30, 
    date: "2025-09-12",
    description: "Petit déjeuner"
  },
  { 
    id: 7, 
    title: "McDonald's", 
    category: "Alimentation", 
    type: "expense", 
    amount: -8.90, 
    date: "2025-09-11",
    description: "Repas rapide"
  },

  // Transport
  { 
    id: 8, 
    title: "Station Total", 
    category: "Transport", 
    type: "expense", 
    amount: -55.20, 
    date: "2025-09-10",
    description: "Plein d'essence"
  },
  { 
    id: 9, 
    title: "Péage autoroute", 
    category: "Transport", 
    type: "expense", 
    amount: -18.40, 
    date: "2025-09-09",
    description: "Trajet Paris-Lyon"
  },
  { 
    id: 10, 
    title: "Uber", 
    category: "Transport", 
    type: "expense", 
    amount: -15.80, 
    date: "2025-09-06",
    description: "Course vers aéroport"
  },

  // Logement
  { 
    id: 11, 
    title: "Loyer appartement", 
    category: "Logement", 
    type: "expense", 
    amount: -850, 
    date: "2025-09-01",
    description: "Loyer mensuel"
  },
  { 
    id: 12, 
    title: "EDF", 
    category: "Logement", 
    type: "expense", 
    amount: -78.50, 
    date: "2025-09-03",
    description: "Facture électricité"
  },

  // Loisirs
  { 
    id: 13, 
    title: "Cinéma UGC", 
    category: "Loisirs", 
    type: "expense", 
    amount: -24.50, 
    date: "2025-09-14",
    description: "2 places de cinéma"
  },
  { 
    id: 14, 
    title: "Netflix", 
    category: "Loisirs", 
    type: "expense", 
    amount: -13.49, 
    date: "2025-09-05",
    description: "Abonnement mensuel"
  },

  // Santé
  { 
    id: 15, 
    title: "Pharmacie Monge", 
    category: "Santé", 
    type: "expense", 
    amount: -15.60, 
    date: "2025-09-11",
    description: "Médicaments"
  },
  { 
    id: 16, 
    title: "Dr. Martin (généraliste)", 
    category: "Santé", 
    type: "expense", 
    amount: -25, 
    date: "2025-09-08",
    description: "Consultation médicale"
  },

  // Shopping
  { 
    id: 17, 
    title: "Zara", 
    category: "Shopping", 
    type: "expense", 
    amount: -95.80, 
    date: "2025-09-12",
    description: "Vêtements automne"
  },
  { 
    id: 18, 
    title: "Amazon", 
    category: "Shopping", 
    type: "expense", 
    amount: -34.99, 
    date: "2025-09-09",
    description: "Livre et accessoires"
  }
]

const testCategories = [
  "Alimentation", "Transport", "Logement", "Loisirs", "Santé", "Shopping", "Revenus", "Autres"
]

interface TransactionsProps {
  user: any
}

const categoryColors: Record<string, string> = {
  Alimentation: "bg-orange-100 text-orange-800",
  Transport: "bg-blue-100 text-blue-800",
  Loisirs: "bg-purple-100 text-purple-800",
  Revenus: "bg-green-100 text-green-800",
  Santé: "bg-red-100 text-red-800",
  Shopping: "bg-pink-100 text-pink-800",
  Logement: "bg-yellow-100 text-yellow-800",
  Autres: "bg-gray-100 text-gray-800",
}

export function Transactions({ user }: TransactionsProps) {
  // Utilisation directe des données de test
  const [transactions, setTransactions] = useState<any[]>(testTransactions)
  const [loading, setLoading] = useState(true) // Simule le chargement initial
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [categories] = useState<string[]>(testCategories)
  // const isOnline = useOnline() // Commenté car pas utilisé avec les données statiques

  // Simule un chargement initial
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 800) // Simule 800ms de chargement
    return () => clearTimeout(timer)
  }, [])

  // Commenté : Load transactions from offline database
  // useEffect(() => {
  //   loadTransactions()
  //   loadCategories()
  // }, [user?.id])

  // Commenté : fonction de chargement depuis la base
  // const loadTransactions = async () => {
  //   if (!user?.id) return
  //   try {
  //     setLoading(true)
  //     setError(null)
  //     const userTransactions = await offlineDataService.getTransactions(user.id, 200, 0)
  //     setTransactions(userTransactions)
  //     console.log(`✅ Loaded ${userTransactions.length} transactions from database`)
  //   } catch (err) {
  //     console.error('❌ Error loading transactions:', err)
  //     setError('Erreur lors du chargement des transactions')
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  // Commenté : fonction de chargement des catégories
  // const loadCategories = async () => {
  //   try {
  //     const allCategories = await offlineDataService.getCategories()
  //     const categoryNames = Array.from(new Set([
  //       ...allCategories.map(cat => cat.nom),
  //       ...transactions.map(t => t.category)
  //     ]))
  //     setCategories(categoryNames)
  //   } catch (err) {
  //     console.error('❌ Error loading categories:', err)
  //   }
  // }

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || transaction.category === selectedCategory
    const matchesType = selectedType === "all" || transaction.type === selectedType

    let matchesDateRange = true
    if (startDate && endDate) {
      const transactionDate = new Date(transaction.date)
      const start = new Date(startDate)
      const end = new Date(endDate)
      matchesDateRange = transactionDate >= start && transactionDate <= end
    } else if (startDate) {
      const transactionDate = new Date(transaction.date)
      const start = new Date(startDate)
      matchesDateRange = transactionDate >= start
    } else if (endDate) {
      const transactionDate = new Date(transaction.date)
      const end = new Date(endDate)
      matchesDateRange = transactionDate <= end
    }

    return matchesSearch && matchesCategory && matchesType && matchesDateRange
  })

  // Simulation du refresh pour tester l'UI
  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simule un délai de refresh
    setTimeout(() => {
      setIsRefreshing(false)
      console.log('✅ Transactions refreshed (simulation)')
    }, 1000)
  }

  // Simulation de suppression avec les données statiques
  const deleteTransaction = async (id: number, type: 'income' | 'expense') => {
    try {
      // Supprime directement de l'état local
      setTransactions(prev => prev.filter(t => t.id !== id))
      console.log(`✅ Transaction ${id} deleted (simulation)`)
    } catch (error) {
      console.error('❌ Error deleting transaction:', error)
      setError('Erreur lors de la suppression')
    }
  }

  // Commenté : versions originales avec base de données
  // const handleRefresh = async () => {
  //   if (!user?.id) return
  //   setIsRefreshing(true)
  //   try {
  //     await loadTransactions()
  //     await loadCategories()
  //     console.log('✅ Transactions refreshed')
  //   } catch (error) {
  //     console.error('❌ Error refreshing transactions:', error)
  //     setError('Erreur lors de l\'actualisation')
  //   } finally {
  //     setIsRefreshing(false)
  //   }
  // }

  // const deleteTransaction = async (id: number, type: 'income' | 'expense') => {
  //   if (!user?.id) return
  //   try {
  //     await offlineDataService.deleteTransaction(user.id, id, type)
  //     setTransactions(prev => prev.filter(t => t.id !== id))
  //     console.log(`✅ Transaction ${id} deleted`)
  //   } catch (error) {
  //     console.error('❌ Error deleting transaction:', error)
  //     setError('Erreur lors de la suppression')
  //     await loadTransactions()
  //   }
  // }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("all")
    setSelectedType("all")
    setStartDate("")
    setEndDate("")
  }

  // Export avec données statiques (simulation)
  const exportToCSV = () => {
    try {
      const csvContent =
        "Date,Titre,Catégorie,Montant,Type\n" +
        filteredTransactions.map((t) => 
          `${t.date},"${t.title}","${t.category}",${t.amount},${t.type}`
        ).join("\n")

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement("a")
      const url = URL.createObjectURL(blob)
      
      link.setAttribute("href", url)
      link.setAttribute("download", `transactions-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      console.log('✅ Transactions exported to CSV (simulation)')
    } catch (error) {
      console.error('❌ Error exporting transactions:', error)
      setError('Erreur lors de l\'export')
    }
  }

  // Export des données utilisateur (simulation)
  const exportUserData = async () => {
    try {
      // Utilise les données de test pour l'export
      const userData = {
        user: user,
        transactions: transactions,
        categories: categories,
        exportDate: new Date().toISOString()
      }
      
      const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' })
      const link = document.createElement("a")
      const url = URL.createObjectURL(blob)
      
      link.setAttribute("href", url)
      link.setAttribute("download", `mesfactures-backup-${new Date().toISOString().split('T')[0]}.json`)
      link.style.visibility = 'hidden'
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      console.log('✅ User data exported (simulation)')
    } catch (error) {
      console.error('❌ Error exporting user data:', error)
      setError('Erreur lors de l\'export complet')
    }
  }

  const getSuggestedCategory = (title: string): string => {
    const suggestions: Record<string, string> = {
      supermarché: "Alimentation",
      restaurant: "Alimentation",
      mcdo: "Alimentation",
      carrefour: "Alimentation",
      essence: "Transport",
      uber: "Transport",
      bus: "Transport",
      métro: "Transport",
      cinéma: "Loisirs",
      netflix: "Loisirs",
      spotify: "Loisirs",
      pharmacie: "Santé",
      médecin: "Santé",
      dentiste: "Santé",
      amazon: "Shopping",
      zara: "Shopping",
      fnac: "Shopping",
      loyer: "Logement",
      électricité: "Logement",
      internet: "Logement",
    }

    const titleLower = title.toLowerCase()
    for (const [keyword, category] of Object.entries(suggestions)) {
      if (titleLower.includes(keyword)) {
        return category
      }
    }
    return "Autres"
  }

  if (loading) {
    return (
      <div className="p-4 space-y-6">
        <div className="pt-4">
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-primary" />
            Transactions
          </h1>
        </div>
        <Card className="shadow-md">
          <CardContent className="p-8 text-center">
            <RefreshCw className="w-8 h-8 text-muted-foreground mx-auto mb-4 animate-spin" />
            <p className="text-muted-foreground">Chargement des transactions...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-primary" />
              Transactions
              {/* Commenté : indicateur hors ligne */}
              {/* {!isOnline && <WifiOff className="w-5 h-5 text-red-500 ml-2" />} */}
            </h1>
            <p className="text-muted-foreground">
              Historique de vos opérations (données de test)
              {/* Commenté : indicateur mode hors ligne */}
              {/* {!isOnline && <span className="text-red-600 ml-2">(Mode hors ligne)</span>} */}
            </p>
          </div>
          {/* Refresh Button */}
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setError(null)}
                className="ml-auto text-red-700 hover:text-red-900"
              >
                ✕
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-md">
        <CardContent className="p-4 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Rechercher une transaction..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Date Range Filters */}
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="date"
                placeholder="Date de début"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="date"
                placeholder="Date de fin"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes catégories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous types</SelectItem>
                <SelectItem value="income">Revenus</SelectItem>
                <SelectItem value="expense">Dépenses</SelectItem>
              </SelectContent>
            </Select>

            {/* Clear Filters Button */}
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Effacer filtres
            </Button>

            {/* Export Buttons */}
            <div className="flex gap-2 ml-auto">
              <Button variant="outline" size="sm" onClick={exportToCSV}>
                <FileText className="w-4 h-4 mr-2" />
                CSV
              </Button>
              <Button variant="outline" size="sm" onClick={exportUserData}>
                <Download className="w-4 h-4 mr-2" />
                Export complet
              </Button>
            </div>
          </div>

          {/* Results count */}
          <p className="text-sm text-muted-foreground">
            {filteredTransactions.length} transaction(s) trouvée(s) sur {transactions.length} au total
            {(startDate || endDate) && (
              <span className="ml-2 text-primary">
                {startDate && endDate
                  ? `du ${startDate} au ${endDate}`
                  : startDate
                    ? `depuis le ${startDate}`
                    : `jusqu'au ${endDate}`}
              </span>
            )}
          </p>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <div className="space-y-3">
        {filteredTransactions.map((transaction) => {
          const suggestedCategory = getSuggestedCategory(transaction.title)
          const showSuggestion = suggestedCategory !== "Autres" && suggestedCategory !== transaction.category

          return (
            <Card key={transaction.id} className="shadow-md hover:shadow-lg transition-all duration-200 group">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.amount > 0 ? "bg-green-100" : "bg-red-100"
                      }`}
                    >
                      {transaction.amount > 0 ? (
                        <TrendingUp className="w-5 h-5 text-green-600" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{transaction.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant="secondary"
                          className={categoryColors[transaction.category] || categoryColors.Autres}
                        >
                          {transaction.category}
                        </Badge>
                        {showSuggestion && (
                          <Badge variant="outline" className="text-xs border-dashed">
                            Suggéré: {suggestedCategory}
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {new Date(transaction.date).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className={`text-lg font-bold ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                        {transaction.amount > 0 ? "+" : ""}
                        {transaction.amount.toFixed(2)} Ar
                      </p>
                    </div>
                    {/* Delete Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => deleteTransaction(transaction.id, transaction.type)}
                      title="Supprimer la transaction"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Empty States */}
      {filteredTransactions.length === 0 && transactions.length > 0 && (
        <Card className="shadow-md">
          <CardContent className="p-8 text-center">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Aucune transaction trouvée avec les filtres appliqués</p>
            <Button variant="outline" onClick={clearFilters} className="mt-4">
              Effacer les filtres
            </Button>
          </CardContent>
        </Card>
      )}

      {transactions.length === 0 && !loading && (
        <Card className="shadow-md">
          <CardContent className="p-8 text-center">
            <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Aucune transaction pour le moment</p>
            <p className="text-sm text-muted-foreground mt-2">
              Utilisez le bouton "+" pour ajouter votre première transaction
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}