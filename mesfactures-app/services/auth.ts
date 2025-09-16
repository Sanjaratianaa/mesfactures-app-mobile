// Authentication service
import { apiClient, type ApiResponse, type ApiError } from './api'

// Types for authentication requests and responses
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: {
    id: number
    username: string
    email: string
    roles: string[]
  }
}

export interface RegisterRequest {
  nom: string
  prenoms: string
  email: string
  motDePasse: string
  statut: string
  roleLibelle: string
}

export interface RegisterResponse {
  message: string
  data: any
}

export interface VerifyTokenRequest {
  token: string
}

export interface VerifyTokenResponse {
  success: boolean
  user?: any
  message?: string
}

export interface ChangePasswordRequest {
  email: string
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

export interface ChangePasswordResponse {
  message: string
}

export class AuthService {

  private static demoUser = {
    id: 1,
    username: "RAKOTO Marie",
    email: "marie@gmail.com",
    roles: ["user"],
    password: "123456", // mot de passe en clair juste pour tester
  }
  /**
   * Login user with email and password
   */
  // static async login(credentials: LoginRequest): Promise<LoginResponse> {
  //   try {
  //     const response = await apiClient.post<LoginResponse>('/auth/login', credentials)
  //     if (response.token && response.user) {
  //       // Store token and user data
  //       apiClient.setStoredToken(response.token)
  //       apiClient.setStoredUser(response.user)
        
  //       return {
  //         token: response.token,
  //         user: response.user
  //       }
  //     }
      
  //     throw new Error(response.message || 'Erreur lors de la connexion')
  //   } catch (error) {
  //     const apiError = error as ApiError
  //     throw new Error(apiError.message || 'Erreur lors de la connexion')
  //   }
  // }

  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    // Vérification simple côté client
    if (
      credentials.email === this.demoUser.email &&
      credentials.password === this.demoUser.password
    ) {
      // Générer un faux token
      const fakeToken = "fake-jwt-token"
      localStorage.setItem("auth_token", fakeToken)
      localStorage.setItem("user_data", JSON.stringify(this.demoUser))

      return {
        token: fakeToken,
        user: this.demoUser,
      }
    }

    throw new Error("Email ou mot de passe incorrect")
  }

  /**
   * Register new user
   */
  static async register(userData: RegisterRequest): Promise<RegisterResponse> {
    try {
      console.log('📤 Sending register request:', userData)
      console.log('📍 API URL: http://localhost:5000/auth/register')
      
      const response = await apiClient.post<RegisterResponse>('/auth/register', userData)
      
      console.log('📥 Register response:', response)
      
      if (response.message) {
        return {
          message: response.message,
          data: response.data
        }
      }
      
      throw new Error('Erreur lors de l\'inscription')
    } catch (error) {
      console.error('❌ Register error:', error)
      const apiError = error as ApiError
      throw new Error(apiError.message || 'Erreur lors de l\'inscription')
    }
  }

  /**
   * Verify JWT token validity
   */
  static async verifyToken(token?: string): Promise<VerifyTokenResponse> {
    try {
      const tokenToVerify = token || apiClient.getStoredToken()
      
      if (!tokenToVerify) {
        return {
          success: false,
          message: 'Aucun token disponible'
        }
      }

      const response = await apiClient.post<VerifyTokenResponse>('/auth/verify-token', {
        token: tokenToVerify
      })
      
      return {
        success: response.success || false,
        user: response.user,
        message: response.message
      }
    } catch (error) {
      const apiError = error as ApiError
      return {
        success: false,
        message: apiError.message || 'Token invalide'
      }
    }
  }

  /**
   * Change user password
   */
  static async changePassword(passwordData: ChangePasswordRequest): Promise<ChangePasswordResponse> {
    try {
      const response = await apiClient.post<ChangePasswordResponse>('/auth/change-password', passwordData)
      
      if (response.message) {
        return {
          message: response.message
        }
      }
      
      throw new Error('Erreur lors du changement de mot de passe')
    } catch (error) {
      const apiError = error as ApiError
      throw new Error(apiError.message || 'Erreur lors du changement de mot de passe')
    }
  }

  /**
   * Logout user (clear local storage)
   */
  static logout(): void {
    apiClient.removeStoredToken()
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    return !!apiClient.getStoredToken()
  }

  /**
   * Get current user data from storage
   */
  static getCurrentUser(): any | null {
    return apiClient.getStoredUser()
  }

  /**
   * Get current token from storage
   */
  static getCurrentToken(): string | null {
    return apiClient.getStoredToken()
  }

  /**
   * Auto-login check on app start
   */
  static async checkAuthStatus(): Promise<{ isAuthenticated: boolean; user?: any }> {
    const token = apiClient.getStoredToken()
    
    if (!token) {
      return { isAuthenticated: false }
    }

    try {
      const verifyResult = await this.verifyToken(token)
      
      if (verifyResult.success && verifyResult.user) {
        // Update stored user data with fresh info
        apiClient.setStoredUser(verifyResult.user)
        return {
          isAuthenticated: true,
          user: verifyResult.user
        }
      } else {
        // Token is invalid, clear storage
        this.logout()
        return { isAuthenticated: false }
      }
    } catch (error) {
      // If verification fails, clear storage
      this.logout()
      return { isAuthenticated: false }
    }
  }
}

export default AuthService
