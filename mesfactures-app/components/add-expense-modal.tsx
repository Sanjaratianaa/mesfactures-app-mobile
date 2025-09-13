"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Minus, Plus } from "lucide-react"

interface AddExpenseModalProps {
  open: boolean
  onClose: () => void
  onAdd: (transaction: any) => void
}

export function AddExpenseModal({ open, onClose, onAdd }: AddExpenseModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    type: "expense",
  })

  const categories = ["Alimentation", "Transport", "Loisirs", "Shopping", "Santé", "Revenus"]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.amount || !formData.category) {
      return
    }

    const amount =
      formData.type === "expense"
        ? -Math.abs(Number.parseFloat(formData.amount))
        : Math.abs(Number.parseFloat(formData.amount))

    onAdd({
      title: formData.title,
      amount,
      category: formData.category,
      type: formData.type,
    })

    // Reset form
    setFormData({
      title: "",
      amount: "",
      category: "",
      type: "expense",
    })

    onClose()
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter une transaction</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Transaction Type */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant={formData.type === "expense" ? "default" : "outline"}
              className={`flex-1 ${formData.type === "expense" ? "bg-blue-500 hover:bg-blue-600 text-white" : "border-blue-500 text-blue-500 hover:bg-blue-50"}`}
              onClick={() => handleInputChange("type", "expense")}
            >
              <Minus className="w-4 h-4 mr-2" />
              Dépense
            </Button>
            <Button
              type="button"
              variant={formData.type === "income" ? "default" : "outline"}
              className={`flex-1 ${formData.type === "income" ? "bg-yellow-500 hover:bg-yellow-600 text-white" : "border-yellow-500 text-yellow-500 hover:bg-yellow-50"}`}
              onClick={() => handleInputChange("type", "income")}
            >
              <Plus className="w-4 h-4 mr-2" />
              Revenu
            </Button>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              placeholder="Ex: Courses, Salaire..."
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              required
            />
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Montant (€)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => handleInputChange("amount", e.target.value)}
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Catégorie</Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 bg-transparent border-red-500 text-red-500 hover:bg-red-50"
              onClick={onClose}
            >
              Annuler
            </Button>
            <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
              Ajouter
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
