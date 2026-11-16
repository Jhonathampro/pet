import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, UserRole } from '../types';
import { api, setToken, getToken, SESSION_EXPIRED_EVENT } from '../data/api';

interface LoginResult {
  success: boolean;
  message?: string;
  user?: User;
}

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isLoggedIn: boolean;
  isONG: boolean;
  isUser: boolean;
  isGuest: boolean;
  login: (email: string, pass: string) => Promise<LoginResult>;
  loginAsGuest: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_KEY = 'pethub_user';

function readStoredUser(): User | null {
  if (!getToken()) return null;
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) ?? 'null');
  } catch {
    return null;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(readStoredUser);

  useEffect(() => {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  }, [user]);

  // a API recusou o token (expirou) -> volta a ser visitante
  useEffect(() => {
    const onExpired = () => setUser(null);
    window.addEventListener(SESSION_EXPIRED_EVENT, onExpired);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, onExpired);
  }, []);

  const role: UserRole = user ? user.role : 'guest';

  const login = async (email: string, pass: string): Promise<LoginResult> => {
    try {
      const session = await api<{ token: string; user: User }>('POST', '/auth/login', {
        email: email.trim(),
        password: pass,
      });
      setToken(session.token); // antes do setUser: o App recarrega os dados ao mudar o usuário
      setUser(session.user);
      return { success: true, user: session.user };
    } catch (err) {
      return { success: false, message: err instanceof Error ? err.message : 'Falha no login.' };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const loginAsGuest = logout;

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isLoggedIn: !!user,
        isONG: role === 'ong',
        isUser: role === 'user',
        isGuest: role === 'guest',
        login,
        loginAsGuest,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
