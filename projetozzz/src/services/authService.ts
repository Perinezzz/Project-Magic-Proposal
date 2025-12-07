// ========================================
// Auth Service - Gerencia autenticação
// ========================================

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  role: 'admin' | 'consultant' | 'viewer';
  agency_id: string;
  is_active: boolean;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
  message?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// ========================================
// Login
// ========================================
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (data.success) {
      // Armazenar token
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      return data;
    }

    return {
      success: false,
      error: data.error || 'Falha ao fazer login',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro de conexão',
    };
  }
}

// ========================================
// Logout
// ========================================
export function logout(): void {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
}

// ========================================
// Get Current User
// ========================================
export function getCurrentUser(): User | null {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

// ========================================
// Get Auth Token
// ========================================
export function getAuthToken(): string | null {
  return localStorage.getItem('auth_token');
}

// ========================================
// Is Authenticated
// ========================================
export function isAuthenticated(): boolean {
  return !!getAuthToken() && !!getCurrentUser();
}

// ========================================
// Validate Token (Check if still valid)
// ========================================
export async function validateToken(): Promise<boolean> {
  try {
    const token = getAuthToken();
    if (!token) return false;

    const response = await fetch(`${API_URL}/api/auth/validate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 401) {
      logout();
      return false;
    }

    return response.ok;
  } catch {
    return false;
  }
}

// ========================================
// Register (Future use)
// ========================================
export async function register(data: {
  email: string;
  password: string;
  name: string;
  agency_name?: string;
}): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.success) {
      localStorage.setItem('auth_token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
    }

    return result;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro no registro',
    };
  }
}

// ========================================
// Update User Profile
// ========================================
export async function updateProfile(data: Partial<User>): Promise<AuthResponse> {
  try {
    const token = getAuthToken();
    if (!token) {
      return {
        success: false,
        error: 'Não autenticado',
      };
    }

    const response = await fetch(`${API_URL}/api/auth/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.success) {
      localStorage.setItem('user', JSON.stringify(result.user));
    }

    return result;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao atualizar perfil',
    };
  }
}

// ========================================
// Demo Login (for development)
// ========================================
export async function demoLogin(): Promise<AuthResponse> {
  return login({
    email: 'perine@demo.com',
    password: 'admin',
  });
}
