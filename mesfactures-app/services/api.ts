// API configuration and common utilities
const API_BASE_URL = 'http://localhost:5000/api'
// const API_BASE_URL = 'https://projet-transversal-api.onrender.com/api'

export interface ApiResponse<T> {
  data?: T
  message?: string
  success?: boolean
  token?: string
  user?: any
}

export interface ApiError {
  message: string
  status?: number
}

class ApiClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    
    // Vérifier la connexion réseau
    if (!navigator.onLine) {
      throw new Error('Pas de connexion Internet. L\'action sera synchronisée lors de la reconnexion.')
    }
    
    // Get token from localStorage if available
    const token = this.getStoredToken()
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    }

    console.log('🚀 Making API request:', { url, method: config.method || 'GET', body: options.body })

    try {
      const response = await fetch(url, config)
      
  // console.log('📡 API response status:', response.status)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
  // console.log('❌ API error response:', errorData)
        throw {
          message: errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          status: response.status,
        } as ApiError
      }

      const data = await response.json()
      return data
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw {
          message: 'Erreur de connexion. Vérifiez votre connexion Internet.',
          status: 0,
        } as ApiError
      }
      throw error
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }

  // Token management utilities
  getStoredToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('auth_token')
  }

  setStoredToken(token: string): void {
    if (typeof window === 'undefined') return
    localStorage.setItem('auth_token', token)
  }

  removeStoredToken(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
  }

  getStoredUser(): any | null {
    if (typeof window === 'undefined') return null
    const userData = localStorage.getItem('user_data')
    return userData ? JSON.parse(userData) : null
  }

  setStoredUser(user: any): void {
    if (typeof window === 'undefined') return
    localStorage.setItem('user_data', JSON.stringify(user))
  }
}

// Create and export the API client instance
export const apiClient = new ApiClient(API_BASE_URL)

// Fonctions utilitaires pour les catégories
export async function fetchCategories(type?: 'depense' | 'revenu'): Promise<string[]> {
  let endpoint = '/categorie/categories';
  if (type === 'depense') endpoint = '/categorie/categories/depense';
  if (type === 'revenu') endpoint = '/categorie/categories/revenu';
  const res = await apiClient.get<string[]>(endpoint);
  // console.log('Fetched categories:', res.data);
  if (!res.data) throw new Error(res.message || 'Erreur lors de la récupération des catégories');
  return res.data;
}

// Export base URL for other configurations
export { API_BASE_URL }
