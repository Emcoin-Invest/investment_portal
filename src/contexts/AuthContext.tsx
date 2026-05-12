'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';

import { User } from '@/types';
import { authService } from '@/api/services';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    name: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

const TOKEN_REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes
const TOKEN_WARNING_TIME = 1 * 60 * 1000; // 1 minute before expiry

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTimer, setRefreshTimer] =
    useState<NodeJS.Timeout | null>(null);

  const clearInvalidSession = useCallback(() => {
    setUser(null);
    setToken(null);

    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  // Validate token on mount
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

        if (!storedToken || !storedUser) {
          setLoading(false);
          return;
        }

        // Try to validate the stored session by fetching current user
        try {
          const currentUser = await authService.getCurrentUser();
          setToken(storedToken);
          setUser(currentUser);
        } catch {
          // Token is invalid, clear session
          clearInvalidSession();
        }
      } catch (err) {
        console.error('Session validation failed:', err);
        clearInvalidSession();
      } finally {
        setLoading(false);
      }
    };

    validateSession();
  }, [clearInvalidSession]);

  // Auto-refresh token periodically
  useEffect(() => {
    if (!token || token === 'demo-token') return;

    const setupRefreshTimer = () => {
      const timer = setInterval(async () => {
        try {
          const response = await authService.refresh();
          setToken(response.token);
          localStorage.setItem('token', response.token);
        } catch (err) {
          console.error('Token refresh failed:', err);
          clearInvalidSession();
        }
      }, TOKEN_REFRESH_INTERVAL);

      setRefreshTimer(timer);
      return timer;
    };

    const timer = setupRefreshTimer();

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [token, user, clearInvalidSession]);

  const refreshToken = useCallback(async () => {
    try {
      setError(null);

      // Skip refresh for demo mode
      if (token === 'demo-token') return;

      const response = await authService.refresh();
      setToken(response.token);
      setUser(response.user);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    } catch (err) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : 'Token refresh failed';

      setError(errorMsg);

      clearInvalidSession();

      throw err;
    }
  }, [token, clearInvalidSession]);

  const login = async (email: string, password: string) => {
  try {
    setError(null);

    // Demo admin account
    if (
      email === 'admin@investment.com' &&
      password === 'admin123'
    ) {
      const demoUser = {
        id: '1',
        name: 'Admin User',
        email: 'admin@investment.com',
        role: 'admin',
        status: 'active',
      };

        const fakeToken = 'demo-token';

      setUser(demoUser);
      setToken(fakeToken);

      localStorage.setItem('token', fakeToken);
      localStorage.setItem('user', JSON.stringify(demoUser));

      return;
    }

    throw new Error('Invalid credentials');
  } catch (err) {
    const errorMsg =
      err instanceof Error ? err.message : 'Login failed';

    setError(errorMsg);
    throw err;
  }
};

  const register = async (
    email: string,
    password: string,
    name: string
  ) => {
    try {
      setError(null);
      const data = await authService.register({ email, password, name });

      setUser(data.user);
      setToken(data.token);

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    } catch (err) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : 'Registration failed';

      setError(errorMsg);

      throw err;
    }
  };

  const logout = async () => {
    try {
      // Clear timer before logout
      if (refreshTimer) {
        clearInterval(refreshTimer);
        setRefreshTimer(null);
      }

      await authService.logout();
      clearInvalidSession();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Logout failed';
      setError(errorMsg);
      // Still clear local session on error
      clearInvalidSession();
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!user && !!token,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error(
      'useAuth must be used within an AuthProvider'
    );
  }

  return context;
}