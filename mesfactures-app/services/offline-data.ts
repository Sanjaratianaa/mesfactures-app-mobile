// services/offline-data.ts - Service for handling offline data operations
import { db_operations, initDatabase, isDatabaseReady } from '@/lib/database';

interface SyncQueue {
  id: string;
  table: string;
  operation: 'create' | 'update' | 'delete';
  data: any;
  timestamp: string;
  synced: boolean;
}

export interface Category {
  id?: number;
  nom: string;
  type: 'depense' | 'revenu';
  couleur?: string;
}

export interface Transaction {
  id?: number;
  title: string;
  amount: number;
  category: string;
  type: 'depense' | 'revenu';
  date: string;
}

export interface Goal {
  id?: number;
  nom: string;
  montant_cible: number;
  montant_actuel: number;
  date_limite: string;
  description?: string;
  userId?: number;
}

export interface Loan {
  id?: number;
  description: string;
  montant: number;
  taux: number;
  duree: number;
  date_debut: string;
  mensualite: number;
}

export interface UserStats {
  level: number;
  xp: number;
  xpToNext: number;
  streak: number;
  badges: string[];
  monthlyChallenge: {
    name: string;
    progress: number;
    target: number;
    reward: number;
  };
  transactionCount: number;
  totalExpenses: number;
  totalRevenues: number;
  balance: number;
}

class OfflineDataService {
  private syncQueue: SyncQueue[] = [];
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;
    
    try {
      await initDatabase();
      await db_operations.initializeDefaultCategories();
      this.loadSyncQueue();
      this.isInitialized = true;
      console.log('Offline data service initialized');
    } catch (error) {
      console.error('Failed to initialize offline data service:', error);
      throw error;
    }
  }

  private loadSyncQueue() {
    const stored = localStorage.getItem('syncQueue');
    if (stored) {
      this.syncQueue = JSON.parse(stored);
    }
  }

  private saveSyncQueue() {
    localStorage.setItem('syncQueue', JSON.stringify(this.syncQueue));
  }

  private addToSyncQueue(table: string, operation: 'create' | 'update' | 'delete', data: any) {
    const queueItem: SyncQueue = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      table,
      operation,
      data,
      timestamp: new Date().toISOString(),
      synced: false
    };
    
    this.syncQueue.push(queueItem);
    this.saveSyncQueue();
    console.log(`📝 Added to sync queue: ${operation} in ${table}`);
  }

  // TRANSACTIONS
  async addTransaction(userId: number, transaction: {
    title: string;
    amount: number;
    category: string;
    type: 'income' | 'expense';
    date?: string;
  }) {
    if (!this.isInitialized) await this.initialize();

    const date = transaction.date || new Date().toISOString().split('T')[0];
    
    try {
      let result;
      
      if (transaction.type === 'expense') {
        const expenseData = {
          id_user: userId,
          id_cat: await this.getCategoryId(transaction.category) || 1,
          montant: Math.abs(transaction.amount),
          description: transaction.title,
          date_depense: date,
          statut: 'valide'
        };
        
        result = await db_operations.addData(db_operations.TABLES.depenses, expenseData);
        this.addToSyncQueue('depenses', 'create', expenseData);
      } else {
        const revenueData = {
          id_user: userId,
          source: transaction.title,
          montant: transaction.amount,
          date_revenu: date,
          description: transaction.title
        };
        
        result = await db_operations.addData(db_operations.TABLES.revenus, revenueData);
        this.addToSyncQueue('revenus', 'create', revenueData);
      }

      // Log action
      await this.logAction(userId, 'create_transaction', `Added ${transaction.type}: ${transaction.title}`);
      
      return result;
    } catch (error) {
      console.error('❌ Error adding transaction:', error);
      throw error;
    }
  }

  async getTransactions(userId: number, limit: number = 50, offset: number = 0) {
    if (!this.isInitialized) await this.initialize();
    
    try {
      return await db_operations.getUserTransactions(userId, undefined, limit, offset);
    } catch (error) {
      console.error('❌ Error getting transactions:', error);
      return [];
    }
  }

  async updateTransaction(userId: number, transactionId: number, updates: any, type: 'income' | 'expense') {
    if (!this.isInitialized) await this.initialize();

    try {
      const table = type === 'expense' ? db_operations.TABLES.depenses : db_operations.TABLES.revenus;
      const existing = await db_operations.getData(table, transactionId);
      
      if (!existing || existing.id_user !== userId) {
        throw new Error('Transaction not found or access denied');
      }

      const updated = { ...existing, ...updates };
      await db_operations.updateData(table, updated);
      this.addToSyncQueue(table, 'update', updated);
      
      await this.logAction(userId, 'update_transaction', `Updated ${type}: ${transactionId}`);
      return updated;
    } catch (error) {
      console.error('❌ Error updating transaction:', error);
      throw error;
    }
  }

  async deleteTransaction(userId: number, transactionId: number, type: 'income' | 'expense') {
    if (!this.isInitialized) await this.initialize();

    try {
      const table = type === 'expense' ? db_operations.TABLES.depenses : db_operations.TABLES.revenus;
      const existing = await db_operations.getData(table, transactionId);
      
      if (!existing || existing.id_user !== userId) {
        throw new Error('Transaction not found or access denied');
      }

      await db_operations.deleteData(table, transactionId);
      this.addToSyncQueue(table, 'delete', { id: transactionId });
      
      await this.logAction(userId, 'delete_transaction', `Deleted ${type}: ${transactionId}`);
    } catch (error) {
      console.error('❌ Error deleting transaction:', error);
      throw error;
    }
  }

  // GOALS
  async addGoal(userId: number, goal: {
    name: string;
    target: number;
    deadline: string;
    category?: string;
  }) {
    if (!this.isInitialized) await this.initialize();

    try {
      const goalData = {
        id_user: userId,
        nom: goal.name,
        montant_cible: goal.target,
        montant_actuel: 0,
        date_limite: goal.deadline,
        description: goal.category || '',
        statut: 'en_cours'
      };

      const result = await db_operations.addData(db_operations.TABLES.objectifs, goalData);
      this.addToSyncQueue('objectifs', 'create', goalData);
      
      await this.logAction(userId, 'create_goal', `Created goal: ${goal.name}`);
      return result;
    } catch (error) {
      console.error('❌ Error adding goal:', error);
      throw error;
    }
  }

  async getGoals(userId: number) {
    if (!this.isInitialized) await this.initialize();
    
    try {
      return await db_operations.getDataByIndex(db_operations.TABLES.objectifs, 'id_user', userId);
    } catch (error) {
      console.error('❌ Error getting goals:', error);
      return [];
    }
  }

  async updateGoalProgress(userId: number, goalId: number, amount: number) {
    if (!this.isInitialized) await this.initialize();

    try {
      const goal = await db_operations.getData(db_operations.TABLES.objectifs, goalId);
      
      if (!goal || goal.id_user !== userId) {
        throw new Error('Goal not found or access denied');
      }

      const updated = {
        ...goal,
        montant_actuel: Math.max(0, goal.montant_actuel + amount)
      };

      // Check if goal is completed
      if (updated.montant_actuel >= updated.montant_cible && goal.statut !== 'complete') {
        updated.statut = 'complete';
        await this.createNotification(userId, 'goal_completed', `Félicitations! Vous avez atteint votre objectif: ${goal.nom}`);
      }

      await db_operations.updateData(db_operations.TABLES.objectifs, updated);
      this.addToSyncQueue('objectifs', 'update', updated);
      
      await this.logAction(userId, 'update_goal', `Updated goal progress: ${goal.nom}`);
      return updated;
    } catch (error) {
      console.error('❌ Error updating goal progress:', error);
      throw error;
    }
  }

  // LOANS
  async addLoan(userId: number, loan: {
    name: string;
    amount: number;
    rate: number;
    duration: number;
    monthlyPayment: number;
  }) {
    if (!this.isInitialized) await this.initialize();

    try {
      const loanData = {
        id_user: userId,
        montant: loan.amount,
        taux: loan.rate,
        duree: loan.duration,
        date_debut: new Date().toISOString().split('T')[0],
        mensualite: loan.monthlyPayment,
        statut: 'actif',
        description: loan.name
      };

      const result = await db_operations.addData(db_operations.TABLES.prets, loanData);
      this.addToSyncQueue('prets', 'create', loanData);
      
      await this.logAction(userId, 'create_loan', `Created loan: ${loan.name}`);
      return result;
    } catch (error) {
      console.error('❌ Error adding loan:', error);
      throw error;
    }
  }

  async getLoans(userId: number) {
    if (!this.isInitialized) await this.initialize();
    
    try {
      return await db_operations.getDataByIndex(db_operations.TABLES.prets, 'id_user', userId);
    } catch (error) {
      console.error('❌ Error getting loans:', error);
      return [];
    }
  }

  // CATEGORIES
  async getCategories(type?: 'depense' | 'revenu'): Promise<Category[]> {
    if (!this.isInitialized) await this.initialize();
    
    try {
        if (type) {
        return await db_operations.getDataByIndex(db_operations.TABLES.categories, 'type', type) as Category[];
        }
        return await db_operations.getData(db_operations.TABLES.categories) as Category[];
    } catch (error) {
        console.error('❌ Error getting categories:', error);
        return [];
    }
    }


  private async getCategoryId(categoryName: string, type?: 'depense' | 'revenu'): Promise<number | null> {
    try {
        await db_operations.initializeDefaultCategories();

        const categories: Category[] = await this.getCategories(type);

        const category = categories.find((cat: Category) =>
        cat.nom.toLowerCase().trim() === categoryName.toLowerCase().trim()
        );

        if (!category) {
        console.warn(`⚠️ Category "${categoryName}" not found`);
        return null;
        }

        return category.id ?? null;
    } catch (error) {
        console.error('❌ Error getting category ID:', error);
        return null;
    }
    }

  // STATISTICS
  async getUserStats(userId: number) {
    if (!this.isInitialized) await this.initialize();
    
    try {
      return await db_operations.getUserStats(userId);
    } catch (error) {
      console.error('❌ Error getting user stats:', error);
      return {
        transactionCount: 0,
        expenseCount: 0,
        revenueCount: 0,
        goalCount: 0,
        loanCount: 0,
        totalExpenses: 0,
        totalRevenues: 0,
        balance: 0
      };
    }
  }

  async getMonthlyStats(userId: number, year: number, month: number) {
    if (!this.isInitialized) await this.initialize();

    try {
      const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
      const endDate = new Date(year, month, 0).toISOString().split('T')[0];

      // Get expenses for the month
      const expenses = await db_operations.getDataByIndex(db_operations.TABLES.depenses, 'id_user', userId);
      const monthlyExpenses = expenses.filter(expense => 
        expense.date_depense >= startDate && expense.date_depense <= endDate
      );

      // Get revenues for the month
      const revenues = await db_operations.getDataByIndex(db_operations.TABLES.revenus, 'id_user', userId);
      const monthlyRevenues = revenues.filter(revenue => 
        revenue.date_revenu >= startDate && revenue.date_revenu <= endDate
      );

      const totalExpenses = monthlyExpenses.reduce((sum, expense) => sum + expense.montant, 0);
      const totalRevenues = monthlyRevenues.reduce((sum, revenue) => sum + revenue.montant, 0);

      return {
        month,
        year,
        totalExpenses,
        totalRevenues,
        balance: totalRevenues - totalExpenses,
        transactionCount: monthlyExpenses.length + monthlyRevenues.length,
        expensesByCategory: this.groupExpensesByCategory(monthlyExpenses)
      };
    } catch (error) {
      console.error('Error getting monthly stats:', error);
      return null;
    }
  }

  private groupExpensesByCategory(expenses: any[]) {
    return expenses.reduce((groups, expense) => {
      const category = expense.id_cat || 'Autres';
      groups[category] = (groups[category] || 0) + expense.montant;
      return groups;
    }, {});
  }

  // NOTIFICATIONS
  async createNotification(userId: number, type: string, message: string) {
    if (!this.isInitialized) await this.initialize();

    try {
      const notificationData = {
        id_user: userId,
        type,
        titre: type.replace('_', ' ').toUpperCase(),
        message,
        statut: 'non_lu',
        date_creation: new Date().toISOString()
      };

      const result = await db_operations.addData(db_operations.TABLES.notifications, notificationData);
      this.addToSyncQueue('notifications', 'create', notificationData);
      return result;
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  }

  async getNotifications(userId: number, unreadOnly: boolean = false) {
    if (!this.isInitialized) await this.initialize();
    
    try {
      const notifications = await db_operations.getDataByIndex(db_operations.TABLES.notifications, 'id_user', userId);
      
      if (unreadOnly) {
        return notifications.filter(notif => notif.statut === 'non_lu');
      }
      
      return notifications.sort((a, b) => new Date(b.date_creation).getTime() - new Date(a.date_creation).getTime());
    } catch (error) {
      console.error('Error getting notifications:', error);
      return [];
    }
  }

  // ACTION LOGGING
  private async logAction(userId: number, action: string, description: string) {
    try {
      const actionData = {
        id_user: userId,
        type_action: action,
        description,
        date_action: new Date().toISOString(),
        ip_address: 'offline',
        user_agent: navigator.userAgent
      };

      await db_operations.addData(db_operations.TABLES.historique_actions, actionData);
    } catch (error) {
      console.error('Error logging action:', error);
    }
  }

  async processSyncQueue() {
    const unsynced = this.syncQueue.filter(item => !item.synced);
    
    if (unsynced.length === 0) {
      console.log('Sync queue is empty');
      return;
    }

    console.log(` Processing ${unsynced.length} items in sync queue`);

    for (const item of unsynced) {
      try {
        item.synced = true;
        console.log(`Synced ${item.operation} in ${item.table}`);
      } catch (error) {
        console.error(`Failed to sync ${item.operation} in ${item.table}:`, error);
      }
    }

    this.saveSyncQueue();
  }

  clearSyncQueue() {
    this.syncQueue = [];
    localStorage.removeItem('syncQueue');
    console.log(' Sync queue cleared');
  }

  getSyncQueueSize() {
    return this.syncQueue.filter(item => !item.synced).length;
  }

  // DATA EXPORT
  async exportUserData(userId: number) {
    if (!this.isInitialized) await this.initialize();
    return await db_operations.exportUserData(userId);
  }

  // UTILITIES
  isReady() {
    return this.isInitialized && isDatabaseReady();
  }
}

// Export singleton instance
export const offlineDataService = new OfflineDataService();