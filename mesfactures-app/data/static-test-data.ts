// static-test-data.ts
// Données statiques pour tester l'affichage de l'application MesFactures

export const testUser = {
  id: 1,
  username: "Marie Dubois",
  name: "Marie Dubois",
  email: "marie.dubois@email.fr",
  avatar: "/avatars/marie.jpg",
  phone: "+33 6 12 34 56 78",
  address: "15 Rue de la Paix, 75001 Paris",
  dateOfBirth: "1985-03-15",
  memberSince: "2023-01-15"
}

export const testTransactions = [
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
  { 
    id: 8, 
    title: "Marché bio", 
    category: "Alimentation", 
    type: "expense", 
    amount: -23.70, 
    date: "2025-09-08",
    description: "Légumes et fruits bio"
  },

  // Transport
  { 
    id: 9, 
    title: "Station Total", 
    category: "Transport", 
    type: "expense", 
    amount: -55.20, 
    date: "2025-09-10",
    description: "Plein d'essence"
  },
  { 
    id: 10, 
    title: "Péage autoroute", 
    category: "Transport", 
    type: "expense", 
    amount: -18.40, 
    date: "2025-09-09",
    description: "Trajet Paris-Lyon"
  },
  { 
    id: 11, 
    title: "Parking Châtelet", 
    category: "Transport", 
    type: "expense", 
    amount: -4.50, 
    date: "2025-09-07",
    description: "2h de stationnement"
  },
  { 
    id: 12, 
    title: "Uber", 
    category: "Transport", 
    type: "expense", 
    amount: -15.80, 
    date: "2025-09-06",
    description: "Course vers aéroport"
  },

  // Logement
  { 
    id: 13, 
    title: "Loyer appartement", 
    category: "Logement", 
    type: "expense", 
    amount: -850, 
    date: "2025-09-01",
    description: "Loyer mensuel"
  },
  { 
    id: 14, 
    title: "EDF", 
    category: "Logement", 
    type: "expense", 
    amount: -78.50, 
    date: "2025-09-03",
    description: "Facture électricité"
  },
  { 
    id: 15, 
    title: "Orange Internet", 
    category: "Logement", 
    type: "expense", 
    amount: -29.99, 
    date: "2025-09-02",
    description: "Abonnement Livebox"
  },

  // Loisirs
  { 
    id: 16, 
    title: "Cinéma UGC", 
    category: "Loisirs", 
    type: "expense", 
    amount: -24.50, 
    date: "2025-09-14",
    description: "2 places de cinéma"
  },
  { 
    id: 17, 
    title: "Netflix", 
    category: "Loisirs", 
    type: "expense", 
    amount: -13.49, 
    date: "2025-09-05",
    description: "Abonnement mensuel"
  },
  { 
    id: 18, 
    title: "Spotify Premium", 
    category: "Loisirs", 
    type: "expense", 
    amount: -9.99, 
    date: "2025-09-04",
    description: "Abonnement musique"
  },
  { 
    id: 19, 
    title: "Salle de sport", 
    category: "Loisirs", 
    type: "expense", 
    amount: -39.90, 
    date: "2025-09-01",
    description: "Abonnement mensuel Basic Fit"
  },

  // Santé
  { 
    id: 20, 
    title: "Pharmacie Monge", 
    category: "Santé", 
    type: "expense", 
    amount: -15.60, 
    date: "2025-09-11",
    description: "Médicaments"
  },
  { 
    id: 21, 
    title: "Dr. Martin (généraliste)", 
    category: "Santé", 
    type: "expense", 
    amount: -25, 
    date: "2025-09-08",
    description: "Consultation médicale"
  },
  { 
    id: 22, 
    title: "Dentiste Dr. Lefèvre", 
    category: "Santé", 
    type: "expense", 
    amount: -80, 
    date: "2025-09-05",
    description: "Détartrage"
  },

  // Shopping
  { 
    id: 23, 
    title: "Zara", 
    category: "Shopping", 
    type: "expense", 
    amount: -95.80, 
    date: "2025-09-12",
    description: "Vêtements automne"
  },
  { 
    id: 24, 
    title: "Amazon", 
    category: "Shopping", 
    type: "expense", 
    amount: -34.99, 
    date: "2025-09-09",
    description: "Livre et accessoires"
  },
  { 
    id: 25, 
    title: "FNAC", 
    category: "Shopping", 
    type: "expense", 
    amount: -67.50, 
    date: "2025-09-06",
    description: "Casque Bluetooth"
  }
]

export const testGoals = [
  {
    id: 1,
    libelle: "Voyage en Italie",
    nom: "Voyage en Italie",
    montantTotal: 2500,
    montant_cible: 2500,
    montantActuel: 1200,
    dateDebut: "2025-01-01",
    dateFin: "2025-12-31",
    date_limite: "2025-12-31",
    statut: "En cours",
    description: "Vacances d'été en famille",
    color: "#3b82f6"
  },
  {
    id: 2,
    libelle: "Nouveau MacBook",
    nom: "Nouveau MacBook",
    montantTotal: 1800,
    montant_cible: 1800,
    montantActuel: 650,
    dateDebut: "2025-02-01",
    dateFin: "2025-11-30",
    date_limite: "2025-11-30",
    statut: "En cours",
    description: "Ordinateur portable pour le travail",
    color: "#10b981"
  },
  {
    id: 3,
    libelle: "Fonds d'urgence",
    nom: "Fonds d'urgence",
    montantTotal: 5000,
    montant_cible: 5000,
    montantActuel: 2800,
    dateDebut: "2025-01-01",
    dateFin: "2026-01-01",
    date_limite: "2026-01-01",
    statut: "En cours",
    description: "Épargne de précaution",
    color: "#f59e0b"
  },
  {
    id: 4,
    libelle: "Rénovation cuisine",
    nom: "Rénovation cuisine",
    montantTotal: 8000,
    montant_cible: 8000,
    montantActuel: 8000,
    dateDebut: "2024-06-01",
    dateFin: "2025-03-01",
    date_limite: "2025-03-01",
    statut: "Terminé",
    description: "Rénovation complète de la cuisine",
    color: "#ef4444"
  }
]

export const testLoans = [
  {
    id: 1,
    name: "Prêt immobilier",
    description: "Prêt immobilier",
    montant: 180000,
    amount: 180000,
    taux: 1.8,
    rate: 1.8,
    duree: 240,
    duration: 240,
    date_debut: "2022-01-15",
    startDate: "2022-01-15",
    mensualite: 850.50,
    monthlyPayment: 850.50,
    remainingAmount: 165000,
    nextPaymentDate: "2025-10-01"
  },
  {
    id: 2,
    name: "Prêt automobile",
    description: "Prêt automobile",
    montant: 25000,
    amount: 25000,
    taux: 3.2,
    rate: 3.2,
    duree: 60,
    duration: 60,
    date_debut: "2024-03-01",
    startDate: "2024-03-01",
    mensualite: 450.75,
    monthlyPayment: 450.75,
    remainingAmount: 18500,
    nextPaymentDate: "2025-10-01"
  },
  {
    id: 3,
    name: "Prêt travaux",
    description: "Prêt travaux",
    montant: 15000,
    amount: 15000,
    taux: 2.5,
    rate: 2.5,
    duree: 84,
    duration: 84,
    date_debut: "2023-06-01",
    startDate: "2023-06-01",
    mensualite: 215.30,
    monthlyPayment: 215.30,
    remainingAmount: 8200,
    nextPaymentDate: "2025-10-01"
  }
]

export const testUserStats = {
  level: 4,
  xp: 1250,
  xpToNext: 1500,
  streak: 18,
  badges: ["first_budget", "savings_master", "consistent_tracker", "goal_achiever", "expense_analyzer"],
  monthlyChallenge: {
    name: "Économiser 300Ar ce mois",
    progress: 180,
    target: 300,
    reward: 150,
  },
  transactionCount: 156,
  totalExpenses: 2845.50,
  totalRevenues: 3825.00,
  balance: 979.50,
}

export const testBudgets = [
  {
    id: 1,
    category: "Alimentation",
    budget: 400,
    spent: 176.20,
    color: "#f97316"
  },
  {
    id: 2,
    category: "Transport",
    budget: 200,
    spent: 93.90,
    color: "#3b82f6"
  },
  {
    id: 3,
    category: "Loisirs",
    budget: 150,
    spent: 87.88,
    color: "#8b5cf6"
  },
  {
    id: 4,
    category: "Shopping",
    budget: 200,
    spent: 198.29,
    color: "#ec4899"
  },
  {
    id: 5,
    category: "Santé",
    budget: 100,
    spent: 120.60,
    color: "#ef4444"
  },
  {
    id: 6,
    category: "Logement",
    budget: 1000,
    spent: 958.49,
    color: "#84cc16"
  }
]

export const testCategories = [
  { id: 1, nom: "Alimentation", type: "expense" },
  { id: 2, nom: "Transport", type: "expense" },
  { id: 3, nom: "Logement", type: "expense" },
  { id: 4, nom: "Loisirs", type: "expense" },
  { id: 5, nom: "Santé", type: "expense" },
  { id: 6, nom: "Shopping", type: "expense" },
  { id: 7, nom: "Éducation", type: "expense" },
  { id: 8, nom: "Autres", type: "expense" },
  { id: 9, nom: "Revenus", type: "income" },
]

// Données mensuelles pour les graphiques
export const testMonthlyData = [
  { month: "Jan", revenus: 3200, depenses: 2100, balance: 1100 },
  { month: "Fév", revenus: 3200, depenses: 2300, balance: 900 },
  { month: "Mar", revenus: 3700, depenses: 2450, balance: 1250 },
  { month: "Avr", revenus: 3200, depenses: 2200, balance: 1000 },
  { month: "Mai", revenus: 3200, depenses: 2350, balance: 850 },
  { month: "Juin", revenus: 3500, depenses: 2800, balance: 700 },
  { month: "Juil", revenus: 3200, depenses: 3100, balance: 100 },
  { month: "Août", revenus: 3200, depenses: 2900, balance: 300 },
  { month: "Sep", revenus: 3825, depenses: 2845, balance: 980 }
]

// Données pour les graphiques en secteurs
export const testExpensesByCategory = [
  { name: "Logement", value: 958.49, color: "#84cc16" },
  { name: "Shopping", value: 198.29, color: "#ec4899" },
  { name: "Alimentation", value: 176.20, color: "#f97316" },
  { name: "Santé", value: 120.60, color: "#ef4444" },
  { name: "Transport", value: 93.90, color: "#3b82f6" },
  { name: "Loisirs", value: 87.88, color: "#8b5cf6" }
]

// Notifications de test
export const testNotifications = [
  {
    id: 1,
    type: "reminder",
    title: "Échéance prêt immobilier",
    message: "Paiement de 850,50 Ar dû le 1er octobre",
    date: "2025-09-28",
    urgent: true,
    read: false
  },
  {
    id: 2,
    type: "budget",
    title: "Budget Shopping dépassé",
    message: "Vous avez dépensé 198Ar sur 200Ar budgétés",
    date: "2025-09-15",
    urgent: false,
    read: false
  },
  {
    id: 3,
    type: "achievement",
    title: "Objectif atteint!",
    message: "Félicitations! Vous avez terminé la rénovation cuisine",
    date: "2025-09-10",
    urgent: false,
    read: true
  },
  {
    id: 4,
    type: "info",
    title: "Nouveau niveau atteint",
    message: "Vous êtes maintenant niveau 4!",
    date: "2025-09-08",
    urgent: false,
    read: true
  }
]

// Configuration par défaut pour les tests
export const testConfig = {
  currency: "Ar",
  dateFormat: "DD/MM/YYYY",
  defaultBudgetPeriod: "monthly",
  notifications: {
    budgetAlerts: true,
    goalReminders: true,
    loanPayments: true
  }
}

// Fonction utilitaire pour obtenir toutes les données de test
export function getAllTestData() {
  return {
    user: testUser,
    transactions: testTransactions,
    goals: testGoals,
    loans: testLoans,
    userStats: testUserStats,
    budgets: testBudgets,
    categories: testCategories,
    monthlyData: testMonthlyData,
    expensesByCategory: testExpensesByCategory,
    notifications: testNotifications,
    config: testConfig
  }
}

// Fonctions utilitaires pour filtrer les données
export function getTransactionsByType(type: 'income' | 'expense') {
  return testTransactions.filter(t => t.type === type)
}

export function getTransactionsByCategory(category: string) {
  return testTransactions.filter(t => t.category === category)
}

export function getTransactionsByDateRange(startDate: string, endDate: string) {
  return testTransactions.filter(t => t.date >= startDate && t.date <= endDate)
}

export function getCurrentMonthTransactions() {
  const currentMonth = new Date().getMonth() + 1
  const currentYear = new Date().getFullYear()
  return testTransactions.filter(t => {
    const transactionDate = new Date(t.date)
    return transactionDate.getMonth() + 1 === currentMonth && 
           transactionDate.getFullYear() === currentYear
  })
}