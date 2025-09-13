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
} from "lucide-react"
import { useState } from "react"

interface TransactionsProps {
  transactions: any[]
  setTransactions: (transactions: any[]) => void
}

const categoryColors: Record<string, string> = {
  Alimentation: "bg-orange-100 text-orange-800",
  Transport: "bg-blue-100 text-blue-800",
  Loisirs: "bg-purple-100 text-purple-800",
  Revenus: "bg-green-100 text-green-800",
  Santé: "bg-red-100 text-red-800",
  Shopping: "bg-pink-100 text-pink-800",
}

export function Transactions({ transactions, setTransactions }: TransactionsProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

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

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsRefreshing(false)
  }

  const deleteTransaction = (id: number) => {
    setTransactions(transactions.filter((t) => t.id !== id))
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("all")
    setSelectedType("all")
    setStartDate("")
    setEndDate("")
  }

  const exportToPDF = () => {
    console.log("Exporting to PDF...")
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Date,Titre,Catégorie,Montant,Type\n" +
      filteredTransactions.map((t) => `${t.date},${t.title},${t.category},${t.amount},${t.type}`).join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "transactions.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportToExcel = () => {
    exportToPDF() // For demo, same as PDF
  }

  const getSuggestedCategory = (title: string): string => {
    const suggestions: Record<string, string> = {
      supermarché: "Alimentation",
      restaurant: "Alimentation",
      essence: "Transport",
      uber: "Transport",
      cinéma: "Loisirs",
      netflix: "Loisirs",
      pharmacie: "Santé",
      médecin: "Santé",
      amazon: "Shopping",
      zara: "Shopping",
    }

    const titleLower = title.toLowerCase()
    for (const [keyword, category] of Object.entries(suggestions)) {
      if (titleLower.includes(keyword)) {
        return category
      }
    }
    return "Autre"
  }

  const categories = Array.from(new Set(transactions.map((t) => t.category)))

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-primary" />
              Transactions
            </h1>
            <p className="text-muted-foreground">Historique de vos opérations</p>
          </div>
          {/* Refresh Button */}
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

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
              <Button variant="outline" size="sm" onClick={exportToPDF}>
                <FileText className="w-4 h-4 mr-2" />
                CSV
              </Button>
              <Button variant="outline" size="sm" onClick={exportToExcel}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Results count */}
          <p className="text-sm text-muted-foreground">
            {filteredTransactions.length} transaction(s) trouvée(s)
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
          const showSuggestion = suggestedCategory !== "Autre" && suggestedCategory !== transaction.category

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
                          className={categoryColors[transaction.category] || "bg-gray-100 text-gray-800"}
                        >
                          {transaction.category}
                        </Badge>
                        {showSuggestion && (
                          <Badge variant="outline" className="text-xs border-dashed">
                            Suggéré: {suggestedCategory}
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">{transaction.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className={`text-lg font-bold ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                        {transaction.amount > 0 ? "+" : ""}
                        {transaction.amount.toFixed(2)} €
                      </p>
                    </div>
                    {/* Delete Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => deleteTransaction(transaction.id)}
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

      {filteredTransactions.length === 0 && (searchTerm || startDate || endDate) && (
        <Card className="shadow-md">
          <CardContent className="p-8 text-center">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Aucune transaction trouvée avec les filtres appliqués</p>
          </CardContent>
        </Card>
      )}

      {transactions.length === 0 && (
        <Card className="shadow-md">
          <CardContent className="p-8 text-center">
            <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Aucune transaction pour le moment</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
