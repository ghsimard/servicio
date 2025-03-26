import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import i18next from 'i18next';

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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post('http://localhost:3003/auth/login', {
        email,
        password
      });
      const { access_token, user } = response.data;
      localStorage.setItem('token', access_token);
      setUser(user);
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
      if (token) {
        await axios.post('http://localhost:3003/auth/logout', {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('token');
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 