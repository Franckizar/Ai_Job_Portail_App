'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeContext';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-bg-secondary hover:bg-bg-tertiary transition-colors duration-200 border border-border-light"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-icon" />
      ) : (
        <Sun className="w-5 h-5 text-icon" />
      )}
    </button>
  );
};