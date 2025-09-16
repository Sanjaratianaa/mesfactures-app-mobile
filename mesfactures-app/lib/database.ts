// lib/database.ts - Enhanced IndexedDB solution
import * as bcrypt from 'bcryptjs';

let db: IDBDatabase | null = null;
let isInitialized = false;

const DB_NAME = 'MesFacturesDB';
const DB_VERSION = 1;

// Database schema
const TABLES = {
  utilisateurs: 'utilisateurs',
  roles: 'roles',
  permissions: 'permissions',
  user_roles: 'user_roles',
  role_permissions: 'role_permissions',
  historique_actions: 'historique_actions',
  categories: 'categories',
  factures: 'factures',
  depenses: 'depenses',
  revenus: 'revenus',
  prets: 'prets',
  remboursements: 'remboursements',
  objectifs: 'objectifs',
  recommandations: 'recommandations',
  notifications: 'notifications'
} as const;

// Type definitions
interface User {
  id?: number;
  nom?: string;
  prenoms?: string;
  email: string;
  mot_de_passe: string;
  telephone?: string;
  langue?: string;
  date_creation: string;
  statut: string;
}

interface Transaction {
  id?: number;
  id_user: number;
  title: string;
  amount: number;
  category: string;
  date: string;
  type: 'income' | 'expense';
}

interface Expense {
  id?: number;
  id_user: number;
  id_cat: number;
  montant: number;
  description: string;
  date_depense: string;
  statut: string;
}

interface Revenue {
  id?: number;
  id_user: number;
  source: string;
  montant: number;
  date_revenu: string;
  description?: string;
}

interface Goal {
  id?: number;
  id_user: number;
  nom: string;
  montant_cible: number;
  montant_actuel: number;
  date_limite: string;
  description?: string;
  statut: string;
}

interface Loan {
  id?: number;
  id_user: number;
  montant: number;
  taux: number;
  duree: number;
  date_debut: string;
  mensualite: number;
  statut: string;
  description?: string;
}

/**
 * Initialize IndexedDB database
 */
export async function initDatabase(): Promise<IDBDatabase> {
  if (db && isInitialized) return db;

  return new Promise((resolve, reject) => {
    console.log('📦 Initializing IndexedDB database...');
    
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => {
      console.error('❌ Failed to open IndexedDB:', request.error);
      reject(request.error);
    };
    
    request.onsuccess = () => {
      db = request.result;
      isInitialized = true;
      console.log('✅ IndexedDB database initialized successfully');
      
      // Add error handler for the database connection
      db.onerror = (event) => {
        console.error('❌ Database error:', event);
      };
      
      resolve(db);
    };
    
    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;
      console.log('🔧 Creating database schema...');
      
      // Create utilisateurs table
      if (!database.objectStoreNames.contains(TABLES.utilisateurs)) {
        const userStore = database.createObjectStore(TABLES.utilisateurs, { 
          keyPath: 'id', 
          autoIncrement: true 
        });
        userStore.createIndex('email', 'email', { unique: true });
        userStore.createIndex('statut', 'statut');
      }
      
      // Create roles table
      if (!database.objectStoreNames.contains(TABLES.roles)) {
        const roleStore = database.createObjectStore(TABLES.roles, { 
          keyPath: 'id', 
          autoIncrement: true 
        });
        roleStore.createIndex('nom', 'nom', { unique: true });
      }
      
      // Create permissions table
      if (!database.objectStoreNames.contains(TABLES.permissions)) {
        const permStore = database.createObjectStore(TABLES.permissions, { 
          keyPath: 'id', 
          autoIncrement: true 
        });
        permStore.createIndex('nom', 'nom', { unique: true });
      }
      
      // Create user_roles table
      if (!database.objectStoreNames.contains(TABLES.user_roles)) {
        const userRoleStore = database.createObjectStore(TABLES.user_roles, { 
          keyPath: ['id_user', 'id_role'] 
        });
        userRoleStore.createIndex('id_user', 'id_user');
        userRoleStore.createIndex('id_role', 'id_role');
      }
      
      // Create role_permissions table
      if (!database.objectStoreNames.contains(TABLES.role_permissions)) {
        const rolePermStore = database.createObjectStore(TABLES.role_permissions, { 
          keyPath: ['id_role', 'id_perm'] 
        });
        rolePermStore.createIndex('id_role', 'id_role');
        rolePermStore.createIndex('id_perm', 'id_perm');
      }
      
      // Create historique_actions table
      if (!database.objectStoreNames.contains(TABLES.historique_actions)) {
        const historyStore = database.createObjectStore(TABLES.historique_actions, { 
          keyPath: 'id', 
          autoIncrement: true 
        });
        historyStore.createIndex('id_user', 'id_user');
        historyStore.createIndex('date_action', 'date_action');
        historyStore.createIndex('type_action', 'type_action');
      }
      
      // Create categories table
      if (!database.objectStoreNames.contains(TABLES.categories)) {
        const categoriesStore = database.createObjectStore(TABLES.categories, { 
          keyPath: 'id', 
          autoIncrement: true 
        });
        categoriesStore.createIndex('type', 'type');
        categoriesStore.createIndex('nom', 'nom');
      }
      
      // Create factures table
      if (!database.objectStoreNames.contains(TABLES.factures)) {
        const facturesStore = database.createObjectStore(TABLES.factures, { 
          keyPath: 'id', 
          autoIncrement: true 
        });
        facturesStore.createIndex('id_user', 'id_user');
        facturesStore.createIndex('statut', 'statut');
        facturesStore.createIndex('date_emission', 'date_emission');
        facturesStore.createIndex('montant', 'montant');
      }
      
      // Create depenses table
      if (!database.objectStoreNames.contains(TABLES.depenses)) {
        const depensesStore = database.createObjectStore(TABLES.depenses, { 
          keyPath: 'id', 
          autoIncrement: true 
        });
        depensesStore.createIndex('id_user', 'id_user');
        depensesStore.createIndex('id_cat', 'id_cat');
        depensesStore.createIndex('date_depense', 'date_depense');
        depensesStore.createIndex('montant', 'montant');
      }
      
      // Create revenus table
      if (!database.objectStoreNames.contains(TABLES.revenus)) {
        const revenusStore = database.createObjectStore(TABLES.revenus, { 
          keyPath: 'id', 
          autoIncrement: true 
        });
        revenusStore.createIndex('id_user', 'id_user');
        revenusStore.createIndex('date_revenu', 'date_revenu');
        revenusStore.createIndex('montant', 'montant');
        revenusStore.createIndex('source', 'source');
      }
      
      // Create prets table
      if (!database.objectStoreNames.contains(TABLES.prets)) {
        const pretsStore = database.createObjectStore(TABLES.prets, { 
          keyPath: 'id', 
          autoIncrement: true 
        });
        pretsStore.createIndex('id_user', 'id_user');
        pretsStore.createIndex('statut', 'statut');
        pretsStore.createIndex('date_debut', 'date_debut');
        pretsStore.createIndex('montant', 'montant');
      }
      
      // Create remboursements table
      if (!database.objectStoreNames.contains(TABLES.remboursements)) {
        const rembStore = database.createObjectStore(TABLES.remboursements, { 
          keyPath: 'id', 
          autoIncrement: true 
        });
        rembStore.createIndex('id_pret', 'id_pret');
        rembStore.createIndex('date_remb', 'date_remb');
        rembStore.createIndex('montant', 'montant');
      }
      
      // Create objectifs table
      if (!database.objectStoreNames.contains(TABLES.objectifs)) {
        const objectifsStore = database.createObjectStore(TABLES.objectifs, { 
          keyPath: 'id', 
          autoIncrement: true 
        });
        objectifsStore.createIndex('id_user', 'id_user');
        objectifsStore.createIndex('statut', 'statut');
        objectifsStore.createIndex('date_limite', 'date_limite');
        objectifsStore.createIndex('montant_cible', 'montant_cible');
      }
      
      // Create recommandations table
      if (!database.objectStoreNames.contains(TABLES.recommandations)) {
        const recoStore = database.createObjectStore(TABLES.recommandations, { 
          keyPath: 'id', 
          autoIncrement: true 
        });
        recoStore.createIndex('id_user', 'id_user');
        recoStore.createIndex('type', 'type');
        recoStore.createIndex('date_creation', 'date_creation');
      }
      
      // Create notifications table
      if (!database.objectStoreNames.contains(TABLES.notifications)) {
        const notifStore = database.createObjectStore(TABLES.notifications, { 
          keyPath: 'id', 
          autoIncrement: true 
        });
        notifStore.createIndex('id_user', 'id_user');
        notifStore.createIndex('statut', 'statut');
        notifStore.createIndex('date_creation', 'date_creation');
        notifStore.createIndex('type', 'type');
      }
      
      console.log('✅ Database schema created successfully');
    };
  });
}

/**
 * Generic function to add data to a table
 */
async function addData(tableName: string, data: any): Promise<any> {
  const database = await initDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([tableName], 'readwrite');
    const store = transaction.objectStore(tableName);
    
    // Add timestamp for audit trail
    const dataWithTimestamp = {
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const request = store.add(dataWithTimestamp);
    
    request.onsuccess = () => {
      const result = { ...dataWithTimestamp, id: request.result };
      console.log(`✅ Added data to ${tableName}:`, result.id);
      resolve(result);
    };
    
    request.onerror = () => {
      console.error(`❌ Error adding data to ${tableName}:`, request.error);
      reject(request.error);
    };
    
    transaction.onerror = () => {
      console.error(`❌ Transaction error for ${tableName}:`, transaction.error);
      reject(transaction.error);
    };
  });
}

/**
 * Generic function to update data in a table
 */
async function updateData(tableName: string, data: any): Promise<any> {
  const database = await initDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([tableName], 'readwrite');
    const store = transaction.objectStore(tableName);
    
    // Add update timestamp
    const dataWithTimestamp = {
      ...data,
      updated_at: new Date().toISOString()
    };
    
    const request = store.put(dataWithTimestamp);
    
    request.onsuccess = () => {
      console.log(`✅ Updated data in ${tableName}:`, data.id);
      resolve(dataWithTimestamp);
    };
    
    request.onerror = () => {
      console.error(`❌ Error updating data in ${tableName}:`, request.error);
      reject(request.error);
    };
    
    transaction.onerror = () => {
      console.error(`❌ Transaction error for ${tableName}:`, transaction.error);
      reject(transaction.error);
    };
  });
}

/**
 * Generic function to get data from a table
 */
async function getData(tableName: string, key?: any): Promise<any> {
  const database = await initDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([tableName], 'readonly');
    const store = transaction.objectStore(tableName);
    const request = key ? store.get(key) : store.getAll();
    
    request.onsuccess = () => {
      resolve(request.result);
    };
    
    request.onerror = () => {
      console.error(`❌ Error getting data from ${tableName}:`, request.error);
      reject(request.error);
    };
  });
}

/**
 * Generic function to query data by index
 */
async function getDataByIndex(tableName: string, indexName: string, value: any): Promise<any[]> {
  const database = await initDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([tableName], 'readonly');
    const store = transaction.objectStore(tableName);
    const index = store.index(indexName);
    const request = index.getAll(value);
    
    request.onsuccess = () => {
      resolve(request.result);
    };
    
    request.onerror = () => {
      console.error(`❌ Error querying ${tableName} by ${indexName}:`, request.error);
      reject(request.error);
    };
  });
}

/**
 * Generic function to delete data from a table
 */
async function deleteData(tableName: string, key: any): Promise<void> {
  const database = await initDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([tableName], 'readwrite');
    const store = transaction.objectStore(tableName);
    const request = store.delete(key);
    
    request.onsuccess = () => {
      console.log(`✅ Deleted data from ${tableName}:`, key);
      resolve();
    };
    
    request.onerror = () => {
      console.error(`❌ Error deleting data from ${tableName}:`, request.error);
      reject(request.error);
    };
  });
}

/**
 * Get data with pagination
 */
async function getDataPaginated(
  tableName: string, 
  indexName?: string, 
  value?: any, 
  limit: number = 50, 
  offset: number = 0
): Promise<any[]> {
  const database = await initDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([tableName], 'readonly');
    const store = transaction.objectStore(tableName);
    const source = indexName ? store.index(indexName) : store;
    
    const results: any[] = [];
    let count = 0;
    let skipped = 0;
    
    const range = value ? IDBKeyRange.only(value) : undefined;
    const request = source.openCursor(range);
    
    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest).result;
      
      if (cursor) {
        if (skipped < offset) {
          skipped++;
          cursor.continue();
          return;
        }
        
        if (count < limit) {
          results.push(cursor.value);
          count++;
          cursor.continue();
        } else {
          resolve(results);
        }
      } else {
        resolve(results);
      }
    };
    
    request.onerror = () => {
      console.error(`❌ Error paginating ${tableName}:`, request.error);
      reject(request.error);
    };
  });
}

/**
 * Count records in a table
 */
async function countData(tableName: string, indexName?: string, value?: any): Promise<number> {
  const database = await initDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([tableName], 'readonly');
    const store = transaction.objectStore(tableName);
    const source = indexName ? store.index(indexName) : store;
    
    const range = value ? IDBKeyRange.only(value) : undefined;
    const request = source.count(range);
    
    request.onsuccess = () => {
      resolve(request.result);
    };
    
    request.onerror = () => {
      console.error(`❌ Error counting ${tableName}:`, request.error);
      reject(request.error);
    };
  });
}

/**
 * Save user locally with enhanced error handling
 */
export async function saveLocalUser(email: string, password: string): Promise<void> {
  try {
    const hash = await bcrypt.hash(password, 10);
    const now = new Date().toISOString();
    
    // Check if user already exists
    const existingUsers = await getDataByIndex(TABLES.utilisateurs, 'email', email);
    
    if (existingUsers.length > 0) {
      // Update existing user
      const user = existingUsers[0];
      user.mot_de_passe = hash;
      user.updated_at = now;
      await updateData(TABLES.utilisateurs, user);
      console.log('✅ User password updated locally');
    } else {
      // Create new user
      const userData: User = {
        email,
        mot_de_passe: hash,
        date_creation: now,
        statut: 'actif',
        langue: 'fr'
      };
      
      await addData(TABLES.utilisateurs, userData);
      console.log('✅ New user saved locally');
    }
  } catch (error) {
    console.error('❌ Error saving local user:', error);
    throw new Error(`Failed to save user locally: ${error}`);
  }
}

/**
 * Check local user credentials with enhanced validation
 */
export async function checkLocalUser(email: string, password: string): Promise<false | { dateCreation: string; id: number; user: User }> {
  try {
    const users = await getDataByIndex(TABLES.utilisateurs, 'email', email);
    
    if (users.length === 0) {
      console.log('❌ User not found locally');
      return false;
    }
    
    const user = users[0];
    
    if (user.statut !== 'actif') {
      console.log('❌ User account is not active');
      return false;
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.mot_de_passe);
    
    if (!isPasswordValid) {
      console.log('❌ Invalid password');
      return false;
    }
    
    console.log('✅ User authenticated locally');
    return {
      dateCreation: user.date_creation,
      id: user.id,
      user: user
    };
  } catch (error) {
    console.error('❌ Error checking local user:', error);
    return false;
  }
}

/**
 * Get transactions for a user with filtering
 */
export async function getUserTransactions(
  userId: number, 
  type?: 'income' | 'expense',
  limit: number = 50,
  offset: number = 0
): Promise<Transaction[]> {
  try {
    const expenses = await getDataPaginated(TABLES.depenses, 'id_user', userId, limit, offset);
    const revenues = await getDataPaginated(TABLES.revenus, 'id_user', userId, limit, offset);
    
    const transactions: Transaction[] = [];
    
    // Convert expenses to transactions
    if (!type || type === 'expense') {
      expenses.forEach(expense => {
        transactions.push({
          id: expense.id,
          id_user: expense.id_user,
          title: expense.description,
          amount: -expense.montant,
          category: 'Dépense',
          date: expense.date_depense,
          type: 'expense'
        });
      });
    }
    
    // Convert revenues to transactions
    if (!type || type === 'income') {
      revenues.forEach(revenue => {
        transactions.push({
          id: revenue.id,
          id_user: revenue.id_user,
          title: revenue.source,
          amount: revenue.montant,
          category: 'Revenu',
          date: revenue.date_revenu,
          type: 'income'
        });
      });
    }
    
    // Sort by date (most recent first)
    return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('❌ Error getting user transactions:', error);
    throw error;
  }
}

/**
 * Get user statistics
 */
export async function getUserStats(userId: number): Promise<any> {
  try {
    const expensesCount = await countData(TABLES.depenses, 'id_user', userId);
    const revenuesCount = await countData(TABLES.revenus, 'id_user', userId);
    const goalsCount = await countData(TABLES.objectifs, 'id_user', userId);
    const loansCount = await countData(TABLES.prets, 'id_user', userId);
    
    // Get recent expenses for total calculation
    const recentExpenses = await getDataByIndex(TABLES.depenses, 'id_user', userId);
    const recentRevenues = await getDataByIndex(TABLES.revenus, 'id_user', userId);
    
    const totalExpenses = recentExpenses.reduce((sum, expense) => sum + expense.montant, 0);
    const totalRevenues = recentRevenues.reduce((sum, revenue) => sum + revenue.montant, 0);
    
    return {
      transactionCount: expensesCount + revenuesCount,
      expenseCount: expensesCount,
      revenueCount: revenuesCount,
      goalCount: goalsCount,
      loanCount: loansCount,
      totalExpenses,
      totalRevenues,
      balance: totalRevenues - totalExpenses
    };
  } catch (error) {
    console.error('❌ Error getting user stats:', error);
    throw error;
  }
}

/**
 * Export data for backup
 */
export async function exportUserData(userId: number): Promise<any> {
  try {
    const userData = await getData(TABLES.utilisateurs, userId);
    const expenses = await getDataByIndex(TABLES.depenses, 'id_user', userId);
    const revenues = await getDataByIndex(TABLES.revenus, 'id_user', userId);
    const goals = await getDataByIndex(TABLES.objectifs, 'id_user', userId);
    const loans = await getDataByIndex(TABLES.prets, 'id_user', userId);
    
    return {
      user: userData,
      expenses,
      revenues,
      goals,
      loans,
      exportDate: new Date().toISOString()
    };
  } catch (error) {
    console.error('❌ Error exporting user data:', error);
    throw error;
  }
}

/**
 * Get active database connection
 */
export async function getDatabase(): Promise<IDBDatabase> {
  return await initDatabase();
}

/**
 * Close database connection
 */
export async function closeDatabase(): Promise<void> {
  if (db) {
    db.close();
    db = null;
    isInitialized = false;
    console.log('🔒 Database connection closed');
  }
}

/**
 * Reset database (for development/testing)
 */
export async function resetDatabase(): Promise<void> {
  try {
    await closeDatabase();
    
    return new Promise((resolve, reject) => {
      const deleteRequest = indexedDB.deleteDatabase(DB_NAME);
      
      deleteRequest.onsuccess = () => {
        console.log('✅ Database reset completed');
        resolve();
      };
      
      deleteRequest.onerror = () => {
        console.error('❌ Error resetting database:', deleteRequest.error);
        reject(deleteRequest.error);
      };
      
      deleteRequest.onblocked = () => {
        console.warn('⚠️ Database deletion blocked - close all tabs and try again');
        reject(new Error('Database deletion blocked'));
      };
    });
  } catch (error) {
    console.error('❌ Error resetting database:', error);
    throw error;
  }
}

/**
 * Check if database is ready
 */
export function isDatabaseReady(): boolean {
  return isInitialized && db !== null;
}

/**
 * Initialize default categories
 */
export async function initializeDefaultCategories(): Promise<void> {
  try {
    const existingCategories = await getData(TABLES.categories);
    
    if (existingCategories.length === 0) {
      const defaultCategories = [
        { nom: 'Alimentation', type: 'depense', couleur: '#ef4444' },
        { nom: 'Transport', type: 'depense', couleur: '#3b82f6' },
        { nom: 'Loisirs', type: 'depense', couleur: '#10b981' },
        { nom: 'Logement', type: 'depense', couleur: '#f59e0b' },
        { nom: 'Santé', type: 'depense', couleur: '#8b5cf6' },
        { nom: 'Salaire', type: 'revenu', couleur: '#22c55e' },
        { nom: 'Freelance', type: 'revenu', couleur: '#06b6d4' },
        { nom: 'Autres revenus', type: 'revenu', couleur: '#84cc16' }
      ];
      
      for (const category of defaultCategories) {
        await addData(TABLES.categories, category);
      }
      
      console.log('✅ Default categories initialized');
    }
  } catch (error) {
    console.error('❌ Error initializing default categories:', error);
  }
}

// Export enhanced table management functions
export const db_operations = {
  addData,
  updateData,
  getData,
  getDataByIndex,
  deleteData,
  getDataPaginated,
  countData,
  getUserTransactions,
  getUserStats,
  exportUserData,
  initializeDefaultCategories,
  TABLES
};