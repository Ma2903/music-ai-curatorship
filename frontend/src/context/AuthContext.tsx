// frontend/src/context/AuthContext.tsx
'use client';

// <<< 1. CORREÇÃO: Adicionar 'ReactNode' à importação >>>
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
// import { User } from '@prisma/client'; // <<< 2. REMOVER esta linha >>>

// Interface local para o usuário no frontend
interface FrontendUser {
  id: number;
  email: string;
  name: string | null;
}

interface AuthContextType {
  user: FrontendUser | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: FrontendUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook para usar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Provedor do Contexto
export const AuthProvider = ({ children }: { children: ReactNode }) => { // ReactNode agora é reconhecido
  const [user, setUser] = useState<FrontendUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Efeito para carregar o token do localStorage ao iniciar
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('authUser');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Falha ao carregar dados de autenticação:", error);
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (newToken: string, newUser: FrontendUser) => {
    try {
      localStorage.setItem('authToken', newToken);
      localStorage.setItem('authUser', JSON.stringify(newUser));
      setToken(newToken);
      setUser(newUser);
    } catch (error) {
      console.error("Falha ao salvar dados de autenticação:", error);
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      setToken(null);
      setUser(null);
      window.location.href = '/login';
    } catch (error) {
      console.error("Falha ao limpar dados de autenticação:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};