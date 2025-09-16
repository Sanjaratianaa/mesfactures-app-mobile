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