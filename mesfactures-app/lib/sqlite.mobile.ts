import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';

const sqlite = new SQLiteConnection(CapacitorSQLite);

export async function initDatabase(): Promise<SQLiteDBConnection> {
  // Ouvre ou crée la base
  const db = await sqlite.createConnection(
    'mesfactures',
    false,
    'no-encryption',
    1,
    false
  );

  // Ouvre la connexion
  await db.open();

  // Active les foreign keys (important pour les relations)
  await db.execute('PRAGMA foreign_keys = ON;');

  // Création des tables
  await db.execute(`
    CREATE TABLE IF NOT EXISTS utilisateurs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nom TEXT,
        prenoms TEXT,
        email TEXT UNIQUE NOT NULL,
        mot_de_passe TEXT NOT NULL,
        telephone TEXT,
        langue TEXT,
        date_creation TEXT DEFAULT CURRENT_TIMESTAMP,
        statut TEXT
    );
    CREATE TABLE IF NOT EXISTS roles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        libelle TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS permissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        libelle TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS user_roles (
        id_user INTEGER,
        id_role INTEGER,
        PRIMARY KEY (id_user, id_role),
        FOREIGN KEY (id_user) REFERENCES utilisateurs(id) ON DELETE CASCADE,
        FOREIGN KEY (id_role) REFERENCES roles(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS role_permissions (
        id_role INTEGER,
        id_perm INTEGER,
        PRIMARY KEY (id_role, id_perm),
        FOREIGN KEY (id_role) REFERENCES roles(id) ON DELETE CASCADE,
        FOREIGN KEY (id_perm) REFERENCES permissions(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS historique_actions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_user INTEGER,
        type_action TEXT,
        date_action TEXT DEFAULT CURRENT_TIMESTAMP,
        details TEXT,
        FOREIGN KEY (id_user) REFERENCES utilisateurs(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        libelle TEXT NOT NULL,
        type TEXT CHECK (type IN ('revenu','depense'))
    );
    CREATE TABLE IF NOT EXISTS factures (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_user INTEGER,
        fournisseur TEXT,
        type_facture TEXT,
        montant REAL,
        date_emission TEXT,
        date_echeance TEXT,
        statut TEXT,
        moyen_paiement TEXT,
        FOREIGN KEY (id_user) REFERENCES utilisateurs(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS depenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_user INTEGER,
        id_cat INTEGER,
        description TEXT,
        montant REAL,
        date_depense TEXT,
        type_depense TEXT,
        statut TEXT,
        FOREIGN KEY (id_user) REFERENCES utilisateurs(id) ON DELETE CASCADE,
        FOREIGN KEY (id_cat) REFERENCES categories(id)
    );
    CREATE TABLE IF NOT EXISTS revenus (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_user INTEGER,
        source TEXT,
        montant REAL,
        date_revenu TEXT,
        mode TEXT,
        FOREIGN KEY (id_user) REFERENCES utilisateurs(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS prets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_user INTEGER,
        crediteur TEXT,
        montant REAL,
        taux_interet REAL,
        date_pret TEXT,
        echeance TEXT,
        statut TEXT,
        FOREIGN KEY (id_user) REFERENCES utilisateurs(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS remboursements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_pret INTEGER,
        montant REAL,
        date_remb TEXT,
        statut TEXT,
        FOREIGN KEY (id_pret) REFERENCES prets(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS objectifs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_user INTEGER,
        libelle TEXT,
        montant_total REAL,
        montant_actuel REAL DEFAULT 0,
        date_debut TEXT,
        date_fin TEXT,
        statut TEXT,
        FOREIGN KEY (id_user) REFERENCES utilisateurs(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS recommandations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_user INTEGER,
        description TEXT,
        type TEXT,
        date_creation TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_user) REFERENCES utilisateurs(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_user INTEGER,
        type TEXT,
        message TEXT,
        date_notif TEXT DEFAULT CURRENT_TIMESTAMP,
        statut TEXT,
        FOREIGN KEY (id_user) REFERENCES utilisateurs(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS parametres_notif (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_user INTEGER,
        canal TEXT,
        frequence TEXT,
        FOREIGN KEY (id_user) REFERENCES utilisateurs(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS devices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_user INTEGER,
        type TEXT,
        statut TEXT,
        last_sync TEXT,
        FOREIGN KEY (id_user) REFERENCES utilisateurs(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS sauvegardes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_user INTEGER,
        date_save TEXT DEFAULT CURRENT_TIMESTAMP,
        type TEXT,
        FOREIGN KEY (id_user) REFERENCES utilisateurs(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS badges (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        libelle TEXT,
        description TEXT
    );
    CREATE TABLE IF NOT EXISTS user_badges (
        id_user INTEGER,
        id_badge INTEGER,
        date_obtention TEXT,
        PRIMARY KEY (id_user, id_badge),
        FOREIGN KEY (id_user) REFERENCES utilisateurs(id) ON DELETE CASCADE,
        FOREIGN KEY (id_badge) REFERENCES badges(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS budgets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_user INTEGER,
        id_cat INTEGER,
        montant_limite REAL,
        periode TEXT,
        FOREIGN KEY (id_user) REFERENCES utilisateurs(id),
        FOREIGN KEY (id_cat) REFERENCES categories(id)
    );
    CREATE TABLE IF NOT EXISTS fichiers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_facture INTEGER,
        chemin_fichier TEXT,
        type_mime TEXT,
        FOREIGN KEY (id_facture) REFERENCES factures(id)
    );
`);

  return db;
}

export async function saveLocalUser(email: string, password: string) {
    const db = await initDatabase();
    const bcrypt = await import('bcryptjs');
    const hash = await bcrypt.hash(password, 10);
    
    // Vérifie si l'utilisateur existe déjà 
    const res = await db.query('SELECT id FROM utilisateurs WHERE email = ?', [email]);
    if (res.values && res.values.length > 0) {
        // Mise à jour du mot de passe uniquement
        await db.run('UPDATE utilisateurs SET mot_de_passe = ? WHERE email = ?', [hash, email]);
    } else {
        // Insertion avec date_creation
        const now = new Date().toISOString();
        await db.run(
            'INSERT INTO utilisateurs (email, mot_de_passe, date_creation) VALUES (?, ?, ?)',
            [email, hash, now]
        );
    }
}

export async function checkLocalUser(email: string, password: string) {
    const db = await initDatabase();
    const res = await db.query('SELECT mot_de_passe, date_creation FROM utilisateurs WHERE email = ?', [email]);
    if (!res.values || res.values.length === 0) return false;
    
    const bcrypt = await import('bcryptjs');
    const storedHash = res.values[0].mot_de_passe;
    return await bcrypt.compare(password, storedHash);
}