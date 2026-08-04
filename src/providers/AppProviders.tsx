import React from 'react';
import { ThemeProvider } from '../context/ThemeContext';
import { PlayerProvider } from '../context/PlayerContext';
import { ToastProvider } from '../context/ToastContext';
import { PlayerProgressProvider } from '../context/PlayerProgressContext';
import { AuthProvider } from '../context/AuthContext';

export interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PlayerProvider>
          <PlayerProgressProvider>
            <ToastProvider>{children}</ToastProvider>
          </PlayerProgressProvider>
        </PlayerProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

