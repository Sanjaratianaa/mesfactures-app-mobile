/**
 * Utilitaires de détection de plateforme
 */

export const isMobile = () => {
  return typeof window !== 'undefined' && (window as any).Capacitor;
};

export const isWeb = () => {
  return !isMobile();
};

/**
 * Import conditionnel des modules SQLite selon la plateforme
 */
export const getSQLiteModule = async () => {
  if (isMobile()) {
    return await import('./sqlite.mobile');
  } else {
    throw new Error('SQLite n\'est disponible que sur mobile');
  }
};

/**
 * Exécute une fonction seulement sur mobile
 */
export const onMobile = async <T>(fn: () => Promise<T>): Promise<T | null> => {
  if (isMobile()) {
    return await fn();
  }
  return null;
};

/**
 * Exécute une fonction seulement sur web
 */
export const onWeb = async <T>(fn: () => Promise<T>): Promise<T | null> => {
  if (isWeb()) {
    return await fn();
  }
  return null;
};