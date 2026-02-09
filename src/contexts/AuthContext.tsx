import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthState, User } from '../types';
import bcrypt from 'bcryptjs';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Default admin user (in production, this would be in a database)
const defaultAdmin: User = {
  id: '1',
  email: 'admin@novaecopackaging.com',
  password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: "password"
  role: 'admin'
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isAdmin: false
  });

  useEffect(() => {
    const savedAuth = localStorage.getItem('auth');
    if (savedAuth) {
      const parsed = JSON.parse(savedAuth);
      setAuthState(parsed);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // In production, this would be an API call
      if (email === defaultAdmin.email && await bcrypt.compare(password, defaultAdmin.password)) {
        const newAuthState = {
          isAuthenticated: true,
          user: defaultAdmin,
          isAdmin: true
        };
        setAuthState(newAuthState);
        localStorage.setItem('auth', JSON.stringify(newAuthState));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setAuthState({
      isAuthenticated: false,
      user: null,
      isAdmin: false
    });
    localStorage.removeItem('auth');
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};