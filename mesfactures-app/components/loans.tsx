"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  Calendar,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  Clock,
  Calculator,
  Bell,
  Settings,
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface Loan {
  id: number
  name: string
  amount: number
  rate: number
  duration: number
  startDate: string
  monthlyPayment: number
  remainingAmount: number
  nextPaymentDate: string
}

interface LoansProps {
  loans: Loan[]
  onAddLoan: (loan: any) => void
}

export function Loans({ loans, onAddLoan }: LoansProps) {
  const [showAddLoan, setShowAddLoan] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [newLoan, setNewLoan] = useState({
    name: "",
    amount: "",
    rate: "",
    duration: "",
  })

  loans = [
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
  ]


  // Calculate monthly payment using loan formula
  const calculateMonthlyPayment = (amount: number, rate: number, duration: number) => {
    const monthlyRate = rate / 100 / 12
    const payment =
      (amount * monthlyRate * Math.pow(1 + monthlyRate, duration)) / (Math.pow(1 + monthlyRate, duration) - 1)
    return payment
  }

  const handleAddLoan = () => {
    if (newLoan.name && newLoan.amount && newLoan.rate && newLoan.duration) {
      const amount = Number.parseFloat(newLoan.amount)
      const rate = Number.parseFloat(newLoan.rate)
      const duration = Number.parseInt(newLoan.duration)
      const monthlyPayment = calculateMonthlyPayment(amount, rate, duration)

      onAddLoan({
        ...newLoan,
        amount,
        rate,
        duration,
        monthlyPayment,
      })

      setNewLoan({ name: "", amount: "", rate: "", duration: "" })
      setShowAddLoan(false)
    }
  }

  // Generate payment schedule for a loan
  const generatePaymentSchedule = (loan: Loan) => {
    const schedule = []
    let remainingBalance = loan.amount
    const monthlyRate = loan.rate / 100 / 12

    for (let i = 1; i <= Math.min(loan.duration, 12); i++) {
      const interestPayment = remainingBalance * monthlyRate
      const principalPayment = loan.monthlyPayment - interestPayment
      remainingBalance -= principalPayment

      const paymentDate = new Date()
      paymentDate.setMonth(paymentDate.getMonth() + i)

      schedule.push({
        month: i,
        date: paymentDate.toLocaleDateString("fr-FR"),
        payment: loan.monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(remainingBalance, 0),
      })
    }

    return schedule
  }

  // Mock notifications
  const notifications = [
    {
      id: 1,
      type: "reminder",
      title: "Échéance prêt immobilier",
      message: "Paiement de 717,42 Ar dû le 1er février",
      date: "2024-01-30",
      urgent: true,
    },
    {
      id: 2,
      type: "info",
      title: "Prêt auto",
      message: "Prochain paiement dans 15 jours",
      date: "2024-01-31",
      urgent: false,
    },
  ]

  const totalMonthlyPayments = loans.reduce((sum, loan) => sum + loan.monthlyPayment, 0)
  const totalRemainingDebt = loans.reduce((sum, loan) => sum + loan.remainingAmount, 0)

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="pt-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mes Prêts</h1>
          <p className="text-muted-foreground">Gérez vos emprunts et remboursements</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowNotifications(true)} className="relative">
            <Bell className="w-4 h-4" />
            <Badge className="absolute -top-2 -right-2 w-5 h-5 p-0 text-xs bg-red-500">
              {notifications.filter((n) => n.urgent).length}
            </Badge>
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowCalendar(true)}>
            <Calendar className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Dette totale</p>
                <p className="text-2xl font-bold">{totalRemainingDebt.toLocaleString()} Ar</p>
              </div>
              <TrendingDown className="w-8 h-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Mensualités</p>
                <p className="text-2xl font-bold">{totalMonthlyPayments.toFixed(0)} Ar</p>
              </div>
              <Calculator className="w-8 h-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Loans List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Prêts en cours</CardTitle>
          <Dialog open={showAddLoan} onOpenChange={setShowAddLoan}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-gradient-to-r from-green-500 to-emerald-500">
                <Plus className="w-4 h-4 mr-2" />
                Nouveau prêt
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un nouveau prêt</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nom du prêt</Label>
                  <Input
                    id="name"
                    value={newLoan.name}
                    onChange={(e) => setNewLoan({ ...newLoan, name: e.target.value })}
                    placeholder="Ex: Prêt immobilier"
                  />
                </div>
                <div>
                  <Label htmlFor="amount">Montant (Ar)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={newLoan.amount}
                    onChange={(e) => setNewLoan({ ...newLoan, amount: e.target.value })}
                    placeholder="150000"
                  />
                </div>
                <div>
                  <Label htmlFor="rate">Taux d'intérêt (%)</Label>
                  <Input
                    id="rate"
                    type="number"
                    step="0.1"
                    value={newLoan.rate}
                    onChange={(e) => setNewLoan({ ...newLoan, rate: e.target.value })}
                    placeholder="1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Durée (mois)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={newLoan.duration}
                    onChange={(e) => setNewLoan({ ...newLoan, duration: e.target.value })}
                    placeholder="240"
                  />
                </div>
                {newLoan.amount && newLoan.rate && newLoan.duration && (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Mensualité calculée:</p>
                    <p className="text-lg font-bold text-primary">
                      {calculateMonthlyPayment(
                        Number.parseFloat(newLoan.amount),
                        Number.parseFloat(newLoan.rate),
                        Number.parseInt(newLoan.duration),
                      ).toFixed(2)}{" "}
                      Ar
                    </p>
                  </div>
                )}
                <Button onClick={handleAddLoan} className="w-full">
                  Ajouter le prêt
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="space-y-4">
          {loans.map((loan) => (
            <Card key={loan.id} className="border-l-4 border-l-primary">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-foreground">{loan.name}</h3>
                  <Badge variant="secondary">{loan.rate}% APR</Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Montant initial</p>
                    <p className="font-medium">{loan.amount.toLocaleString()} Ar</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Restant dû</p>
                    <p className="font-medium text-red-600">{loan.remainingAmount.toLocaleString()} Ar</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Mensualité</p>
                    <p className="font-medium">{loan.monthlyPayment.toFixed(2)} Ar</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Prochaine échéance</p>
                    <p className="font-medium">{new Date(loan.nextPaymentDate).toLocaleDateString("fr-FR")}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Progression</span>
                    <span>{(((loan.amount - loan.remainingAmount) / loan.amount) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((loan.amount - loan.remainingAmount) / loan.amount) * 100}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Calendar Modal */}
      <Dialog open={showCalendar} onOpenChange={setShowCalendar}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Calendrier de remboursement</DialogTitle>
            <DialogDescription id="dialog-description"></DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="schedule" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="schedule">Échéancier</TabsTrigger>
              <TabsTrigger value="chart">Graphique</TabsTrigger>
            </TabsList>
            <TabsContent value="schedule" className="space-y-4">
              {loans.map((loan) => (
                <Card key={loan.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{loan.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {generatePaymentSchedule(loan).map((payment, index) => (
                        <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium">{payment.month}</span>
                            </div>
                            <div>
                              <p className="font-medium">{payment.date}</p>
                              <p className="text-xs text-muted-foreground">
                                Capital: {payment.principal.toFixed(2)} Ar | Intérêts: {payment.interest.toFixed(2)} Ar
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{payment.payment.toFixed(2)} Ar</p>
                            <p className="text-xs text-muted-foreground">Solde: {payment.balance.toFixed(2)} Ar</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            <TabsContent value="chart">
              <Card>
                <CardHeader>
                  <CardTitle>Évolution du capital restant dû</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={generatePaymentSchedule(loans[0] || {})}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${Number(value).toFixed(2)} Ar`, "Montant"]} />
                      <Line type="monotone" dataKey="balance" stroke="#8b5cf6" strokeWidth={3} name="Capital restant" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Notifications Modal */}
      <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Centre de notifications
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {notifications.map((notification) => (
              <Card key={notification.id} className={notification.urgent ? "border-red-200 bg-red-50" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {notification.urgent ? (
                      <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                    ) : (
                      <Clock className="w-5 h-5 text-blue-500 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium">{notification.title}</h4>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{notification.date}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Paramètres
            </Button>
            <Button size="sm">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Tout marquer comme lu
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}