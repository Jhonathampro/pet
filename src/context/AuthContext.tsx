import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, UserRole } from '../types';
import { INITIAL_USER, INITIAL_ONG_USER, DataStore } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isLoggedIn: boolean;
  isONG: boolean;
  isUser: boolean;
  isGuest: boolean;
  login: (email: string, pass: string) => { success: boolean; message?: string };
  loginAsGuest: () => void;
  switchDemoRole: (targetRole: 'user' | 'ong' | 'guest') => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    return DataStore.getCurrentUser();
  });

  useEffect(() => {
    DataStore.setCurrentUser(user);
  }, [user]);

  const role: UserRole = user ? user.role : 'guest';

  const login = (email: string, pass: string): { success: boolean; message?: string } => {
    const cleanEmail = email.trim();

    // Regra explícita de validação com IF para o MVP:
    // Usuário comum: lucas@gmail.com / chave123 -> tipo: usuario, nome: Lucas
    if (cleanEmail.toLowerCase() === 'lucas@gmail.com' && pass === 'chave123') {
      setUser(INITIAL_USER);
      return { success: true };
    }

    // ONG: SalvaPet@gmail.com / chave123 -> tipo: ong, nome: SalvaPet
    if (cleanEmail.toLowerCase() === 'salvapet@gmail.com' && pass === 'chave123') {
      setUser(INITIAL_ONG_USER);
      return { success: true };
    }

    return {
      success: false,
      message: 'E-mail ou senha incorretos. Utilize as credenciais mockadas: lucas@gmail.com ou SalvaPet@gmail.com com a senha chave123.'
    };
  };

  const loginAsGuest = () => {
    setUser(null);
  };

  const switchDemoRole = (targetRole: 'user' | 'ong' | 'guest') => {
    if (targetRole === 'user') {
      setUser(INITIAL_USER);
    } else if (targetRole === 'ong') {
      setUser(INITIAL_ONG_USER);
    } else {
      setUser(null);
    }
  };

  const logout = () => {
    setUser(null);
  };

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
        switchDemoRole,
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
