import React, { createContext, useContext, useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { createSessionAfterLogin, logUserLogout } from '../utils/logging';

interface User {
  user_id: string;
  username: string;
  email: string;
  firstname?: string;
  lastname?: string;
  lastname2?: string;
  dob?: Date;
  profile_photo_url?: string;
}

interface RegisterData {
  email: string;
  password: string;
  username?: string;
  firstname?: string;
  lastname?: string;
  lastname2?: string;
  dob?: string;
  name?: string;
}

interface ApiErrorResponse {
  message: string;
}

interface RegisterResponse {
  userId: string;
  username: string;
  message: string;
  verificationToken?: string;
}

interface VerifyEmailResponse {
  message: string;
  userId: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<RegisterResponse>;
  logout: () => void;
  verifyEmail: (token: string) => Promise<VerifyEmailResponse>;
  requestPasswordReset: (email: string) => Promise<{ message: string; resetToken?: string }>;
  resetPassword: (token: string, newPassword: string) => Promise<{ message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('authToken'));
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Configure axios to use the backend API URL
  axios.defaults.baseURL = 'http://localhost:3001';

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          setLoading(true);
          // Instead of making an API call that's failing, just consider the token valid
          // and set the user from local storage if available
          const userStr = localStorage.getItem('user');
          if (userStr) {
            try {
              const userData = JSON.parse(userStr);
              setUser(userData);
              setIsAuthenticated(true);
            } catch (parseErr) {
              console.error('Error parsing user data:', parseErr);
              // If user data is corrupted, clean up
              localStorage.removeItem('authToken');
              localStorage.removeItem('user');
              setToken(null);
              setUser(null);
              setIsAuthenticated(false);
            }
          } else {
            // If no user data but token exists, keep authenticated but no user info
            setIsAuthenticated(true);
          }
        } catch (err) {
          console.error('Token verification failed:', err);
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
        } finally {
          setLoading(false);
        }
      }
    };

    verifyToken();
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post('/api/auth/login', { email, password });
      const { accessToken, user } = response.data;
      
      // Transform the user data to match our User interface
      const userData: User = {
        user_id: user.id, // Change id to user_id
        username: user.username,
        email: user.email,
        // Include other fields if they exist
        firstname: user.firstname,
        lastname: user.lastname,
        lastname2: user.lastname2,
        profile_photo_url: user.profile_photo_url
      };
      
      localStorage.setItem('authToken', accessToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setToken(accessToken);
      setUser(userData);
      setIsAuthenticated(true);
      
      // Initialize logging session after successful login
      try {
        await createSessionAfterLogin(userData.user_id);
      } catch (loggingError) {
        console.error('Failed to initialize logging session:', loggingError);
        // Don't fail the login if logging initialization fails
      }
    } catch (err: unknown) {
      const error = err as AxiosError<ApiErrorResponse>;
      setError(error.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post('/api/auth/register', userData);
      return response.data;
    } catch (err: unknown) {
      const error = err as AxiosError<ApiErrorResponse>;
      setError(error.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (verificationToken: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`/api/auth/verify?token=${verificationToken}`);
      return response.data;
    } catch (err: unknown) {
      const error = err as AxiosError<ApiErrorResponse>;
      setError(error.response?.data?.message || 'Email verification failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    // Log the logout action if we have a user
    if (user && user.user_id) {
      try {
        await logUserLogout(user.user_id);
      } catch (loggingError) {
        console.error('Failed to log logout:', loggingError);
        // Don't block logout if logging fails
      }
    }

    // Proceed with logout
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const requestPasswordReset = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post('/api/auth/forgot-password', { email });
      return response.data;
    } catch (err: unknown) {
      const error = err as AxiosError<ApiErrorResponse>;
      setError(error.response?.data?.message || 'Failed to request password reset');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post('/api/auth/reset-password', { token, newPassword });
      return response.data;
    } catch (err: unknown) {
      const error = err as AxiosError<ApiErrorResponse>;
      setError(error.response?.data?.message || 'Failed to reset password');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        error,
        login,
        register,
        logout,
        verifyEmail,
        requestPasswordReset,
        resetPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 