"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Target, Plus, Calendar, Lightbulb, CheckCircle } from "lucide-react"

interface GoalsProps {
  goals: any[]
  onAddGoal: (goal: any) => void
  transactions: any[]
}

export function Goals({ goals, onAddGoal, transactions }: GoalsProps) {
  const [showAddGoal, setShowAddGoal] = useState(false)
  const [newGoal, setNewGoal] = useState({
    name: "",
    target: "",
    deadline: "",
    category: "",
  })

  const handleAddGoal = () => {
    if (newGoal.name && newGoal.target && newGoal.deadline && newGoal.category) {
      onAddGoal({
        ...newGoal,
        target: Number.parseFloat(newGoal.target),
      })
      setNewGoal({ name: "", target: "", deadline: "", category: "" })
      setShowAddGoal(false)
    }
  }

  const getPersonalizedTips = (goal: any) => {
    const monthsLeft = Math.ceil(
      (new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30),
    )
    const remaining = goal.target - goal.current
    const monthlyNeeded = remaining / monthsLeft

    const tips = [
      `Économisez ${monthlyNeeded.toFixed(0)}€ par mois pour atteindre votre objectif`,
      `Réduisez vos dépenses en ${goal.category} de 20% ce mois`,
      `Automatisez un virement de ${(monthlyNeeded / 4).toFixed(0)}€ par semaine`,
    ]

    return tips
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Target className="w-6 h-6 text-primary" />
              Objectifs financiers
            </h1>
            <p className="text-muted-foreground">Définissez et suivez vos objectifs d'épargne</p>
          </div>
          <Dialog open={showAddGoal} onOpenChange={setShowAddGoal}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600">
                <Plus className="w-4 h-4 mr-2" />
                Nouvel objectif
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Créer un nouvel objectif</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="goalName">Nom de l'objectif</Label>
                  <Input
                    id="goalName"
                    placeholder="Ex: Vacances d'été"
                    value={newGoal.name}
                    onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="goalTarget">Montant cible (€)</Label>
                  <Input
                    id="goalTarget"
                    type="number"
                    placeholder="2000"
                    value={newGoal.target}
                    onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="goalDeadline">Date limite</Label>
                  <Input
                    id="goalDeadline"
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="goalCategory">Catégorie</Label>
                  <Select
                    value={newGoal.category}
                    onValueChange={(value) => setNewGoal({ ...newGoal, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Épargne">Épargne</SelectItem>
                      <SelectItem value="Loisirs">Loisirs</SelectItem>
                      <SelectItem value="Transport">Transport</SelectItem>
                      <SelectItem value="Immobilier">Immobilier</SelectItem>
                      <SelectItem value="Éducation">Éducation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddGoal} className="w-full">
                  Créer l'objectif
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        {goals.map((goal) => {
          const progress = (goal.current / goal.target) * 100
          const isCompleted = progress >= 100
          const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

          return (
            <Card key={goal.id} className={`shadow-md ${isCompleted ? "border-green-500 bg-green-50" : ""}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {isCompleted && <CheckCircle className="w-5 h-5 text-green-600" />}
                    {goal.name}
                  </CardTitle>
                  <Badge variant={isCompleted ? "default" : "secondary"} className={isCompleted ? "bg-green-600" : ""}>
                    {goal.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Progression</span>
                    <span className="font-medium">
                      {goal.current.toFixed(0)}€ / {goal.target.toFixed(0)}€
                    </span>
                  </div>
                  <Progress value={Math.min(progress, 100)} className="h-3" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{progress.toFixed(1)}% atteint</span>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{daysLeft > 0 ? `${daysLeft} jours restants` : "Échéance dépassée"}</span>
                    </div>
                  </div>
                </div>

                {!isCompleted && (
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-3">
                      <div className="flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-blue-800 mb-1">Conseils personnalisés</p>
                          <ul className="text-xs text-blue-700 space-y-1">
                            {getPersonalizedTips(goal).map((tip, index) => (
                              <li key={index}>• {tip}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {isCompleted && (
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-3 text-center">
                      <div className="flex items-center justify-center gap-2 text-green-700">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">Objectif atteint ! Félicitations ! 🎉</span>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {goals.length === 0 && (
        <Card className="shadow-md">
          <CardContent className="p-8 text-center">
            <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">Aucun objectif défini pour le moment</p>
            <Button onClick={() => setShowAddGoal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Créer votre premier objectif
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
