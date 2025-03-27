import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import i18next from 'i18next';
import { useNavigate } from 'react-router-dom';
import { trackUserAction, ACTION_TYPES } from '../utils/analytics';

interface User {
  user_id: string;
  email: string;
  firstname: string;
  lastname: string;
  username: string;
  preferred_language: string;
  profile_photo_url?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const updateLanguage = (preferredLanguage: string) => {
    // Map database language codes to i18n language codes
    const languageMap: { [key: string]: string } = {
      'en': 'en',
      'fr': 'fr',
      'es': 'es'
    };
    
    const i18nLanguage = languageMap[preferredLanguage] || 'en';
    if (i18nLanguage !== i18next.language) {
      i18next.changeLanguage(i18nLanguage);
    }
  };

  // Create axios interceptor to add session ID to all requests
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const sessionId = localStorage.getItem('sessionId');
        if (sessionId) {
          config.headers['x-session-id'] = sessionId;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
    };
  }, []);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user?.preferred_language) {
      updateLanguage(user.preferred_language);
    }
  }, [user]);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await axios.get('http://localhost:3003/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
      }
    } catch (err) {
      console.error('Auth check error:', err);
      // If the error is due to token expiration or invalid token
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('sessionId');
        localStorage.removeItem('userId');
        setUser(null);
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  // Add axios interceptor to handle 401 responses
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('sessionId');
          localStorage.removeItem('userId');
          setUser(null);
          navigate('/login');
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [navigate]);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post('http://localhost:3003/auth/login', {
        emailOrUsername: email,
        password
      });
      const { access_token, session_id, user } = response.data;
      localStorage.setItem('token', access_token);
      localStorage.setItem('sessionId', session_id);
      localStorage.setItem('userId', user.id);
      
      // Update the user state
      setUser(user);
      
      // Update language based on user preference
      if (user.preferred_language) {
        updateLanguage(user.preferred_language);
      }

      // Track user action
      trackUserAction({
        actionType: ACTION_TYPES.LOGIN,
        pageVisited: '/login',
        actionData: { 
          email: user.email,
          username: user.username
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const sessionId = localStorage.getItem('sessionId');
      
      if (token && sessionId) {
        await axios.post('http://localhost:3003/auth/logout', {}, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'x-session-id': sessionId
          }
        });
      }

      // Track user action
      trackUserAction({
        actionType: ACTION_TYPES.LOGOUT,
        pageVisited: window.location.pathname,
        actionData: { timestamp: new Date().toISOString() }
      });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('sessionId');
      localStorage.removeItem('userId');
      setUser(null);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 