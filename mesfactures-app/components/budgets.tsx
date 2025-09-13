"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { PieChart, AlertTriangle, CheckCircle, AlertCircle, BarChart3, TrendingUp } from "lucide-react"
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"

interface BudgetsProps {
  transactions: any[]
}

export function Budgets({ transactions }: BudgetsProps) {
  const budgets = [
    { category: "Alimentation", limit: 400, spent: 0, color: "#f97316" },
    { category: "Transport", limit: 200, spent: 0, color: "#3b82f6" },
    { category: "Loisirs", limit: 150, spent: 0, color: "#8b5cf6" },
    { category: "Shopping", limit: 100, spent: 0, color: "#ec4899" },
  ]

  // Calculate spent amounts
  budgets.forEach((budget) => {
    budget.spent = transactions
      .filter((t) => t.category === budget.category && t.type === "expense")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)
  })

  const pieData = budgets.map((budget) => ({
    name: budget.category,
    value: budget.spent,
    color: budget.color,
    percentage: (budget.spent / budget.limit) * 100,
  }))

  const barData = budgets.map((budget) => ({
    category: budget.category,
    budget: budget.limit,
    spent: budget.spent,
    remaining: Math.max(0, budget.limit - budget.spent),
  }))

  // Mock trend data for budget evolution
  const trendData = [
    { month: "Jan", alimentation: 350, transport: 180, loisirs: 120, shopping: 80 },
    { month: "Fév", alimentation: 380, transport: 190, loisirs: 140, shopping: 90 },
    { month: "Mar", alimentation: 320, transport: 170, loisirs: 110, shopping: 70 },
    { month: "Avr", alimentation: 400, transport: 200, loisirs: 150, shopping: 100 },
  ]

  const getBudgetStatus = (spent: number, limit: number) => {
    const percentage = (spent / limit) * 100
    if (percentage >= 100) return { status: "over", color: "text-red-600", icon: AlertTriangle }
    if (percentage >= 80) return { status: "warning", color: "text-yellow-600", icon: AlertCircle }
    return { status: "good", color: "text-green-600", icon: CheckCircle }
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="pt-4">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <PieChart className="w-6 h-6 text-primary" />
          Budgets
        </h1>
        <p className="text-muted-foreground">Suivez vos dépenses par catégorie</p>
      </div>

      {/* Budget Overview */}
      <Card className="gradient-card border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">Budget total utilisé</p>
            <p className="text-2xl font-bold text-foreground">
              {budgets.reduce((sum, b) => sum + b.spent, 0).toFixed(2)} € /{" "}
              {budgets.reduce((sum, b) => sum + b.limit, 0)} €
            </p>
            <div className="mt-3">
              <Progress
                value={
                  (budgets.reduce((sum, b) => sum + b.spent, 0) / budgets.reduce((sum, b) => sum + b.limit, 0)) * 100
                }
                className="h-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Enhanced Pie Chart */}
        <Card className="shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <PieChart className="w-5 h-5 text-primary" />
              Répartition des dépenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <RechartsPieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${Number(value).toFixed(2)} €`, name]} />
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="mt-2 space-y-1">
              {pieData.map((entry, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span>{entry.name}</span>
                  </div>
                  <span className="font-medium">{entry.percentage.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Bar Chart */}
        <Card className="shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Budget vs Dépenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip formatter={(value) => [`${Number(value).toFixed(2)} €`, "Montant"]} />
                <Bar dataKey="budget" fill="#e5e7eb" name="Budget" />
                <Bar dataKey="spent" fill="#9bc53d" name="Dépensé" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Évolution des budgets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`${Number(value).toFixed(2)} €`, "Dépenses"]} />
              <Line type="monotone" dataKey="alimentation" stroke="#f97316" strokeWidth={2} name="Alimentation" />
              <Line type="monotone" dataKey="transport" stroke="#3b82f6" strokeWidth={2} name="Transport" />
              <Line type="monotone" dataKey="loisirs" stroke="#8b5cf6" strokeWidth={2} name="Loisirs" />
              <Line type="monotone" dataKey="shopping" stroke="#ec4899" strokeWidth={2} name="Shopping" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Enhanced Budget Categories with Progress Bars */}
      <div className="space-y-4">
        {budgets.map((budget) => {
          const percentage = (budget.spent / budget.limit) * 100
          const status = getBudgetStatus(budget.spent, budget.limit)
          const StatusIcon = status.icon

          return (
            <Card key={budget.category} className="shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: budget.color }} />
                    <h3 className="font-medium text-foreground">{budget.category}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusIcon className={`w-4 h-4 ${status.color}`} />
                    <span className="text-sm font-medium text-foreground">
                      {budget.spent.toFixed(2)} € / {budget.limit} €
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                    <div
                      className="h-3 rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${Math.min(percentage, 100)}%`,
                        background:
                          percentage >= 100
                            ? "#ef4444"
                            : percentage >= 80
                              ? "#f59e0b"
                              : `linear-gradient(90deg, ${budget.color}, ${budget.color}dd)`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{percentage.toFixed(1)}% utilisé</span>
                    <span>
                      {budget.spent < budget.limit
                        ? `${(budget.limit - budget.spent).toFixed(2)} € restant`
                        : `${(budget.spent - budget.limit).toFixed(2)} € dépassé`}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
