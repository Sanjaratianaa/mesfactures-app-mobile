// Ce module est réservé à l'environnement web/Next.js et ne doit pas être utilisé pour l'authentification locale mobile.
// Pour l'authentification locale mobile (avec bcryptjs), utiliser lib/sqlite.mobile.ts
// Toute tentative d'utiliser ces fonctions côté web lèvera une erreur.

export function initDatabase() {
    throw new Error('initDatabase n\'est disponible que sur mobile (voir lib/sqlite.mobile.ts)');
}

export function saveLocalUser() {
    throw new Error('saveLocalUser n\'est disponible que sur mobile (voir lib/sqlite.mobile.ts)');
}

export function checkLocalUser() {
    throw new Error('checkLocalUser n\'est disponible que sur mobile (voir lib/sqlite.mobile.ts)');
}