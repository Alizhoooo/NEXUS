import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { apiClient, authToken } from '../services/apiClient';
import { AuthUser, Role } from '../types';

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  canAccess: (roles: Role[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isInitializing, setIsInitializing] = useState(() => Boolean(authToken.get()));

  useEffect(() => {
    if (!authToken.get()) return;

    apiClient.me()
      .then(({ user: currentUser }) => setUser(currentUser))
      .catch(() => authToken.clear())
      .finally(() => setIsInitializing(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await apiClient.login(email, password);
    authToken.set(response.token);
    setUser(response.user);
  }, []);

  const logout = useCallback(() => {
    authToken.clear();
    setUser(null);
  }, []);

  const canAccess = useCallback((roles: Role[]) => {
    if (!user) return false;
    return roles.includes(user.accessRole);
  }, [user]);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    isAuthenticated: Boolean(user),
    isInitializing,
    login,
    logout,
    canAccess
  }), [canAccess, isInitializing, login, logout, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
