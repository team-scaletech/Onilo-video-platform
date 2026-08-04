import React, { createContext, useContext, useState } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
}

export const DEMO_USER: User = {
  id: 'usr-001',
  name: 'Vivek Gondaliya',
  email: 'vivek.gondaliya@scaletech.xyz',
  role: 'Lead Enterprise Video Architect',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
};

export const DEMO_CREDENTIALS = {
  email: 'vivek.gondaliya@scaletech.xyz',
  password: 'Scaletech@123',
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedToken = localStorage.getItem('onilo_auth_token');
    const savedUser = localStorage.getItem('onilo_user');
    if (savedToken && savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const savedToken = localStorage.getItem('onilo_auth_token');
    return Boolean(savedToken);
  });

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate realistic network delay
    await new Promise((resolve) => setTimeout(resolve, 900));

    const cleanEmail = email.trim().toLowerCase();

    if (cleanEmail === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
      localStorage.setItem('onilo_auth_token', 'demo-jwt-token-onilo-89374');
      localStorage.setItem('onilo_user', JSON.stringify(DEMO_USER));
      setUser(DEMO_USER);
      setIsAuthenticated(true);
      return { success: true };
    } else {
      return {
        success: false,
        error: 'Invalid credentials. Use demo: vivek.gondaliya@scaletech.xyz / Scaletech@123',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('onilo_auth_token');
    localStorage.removeItem('onilo_user');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
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
