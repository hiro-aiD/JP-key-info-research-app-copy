
import React from 'react';
import { Icon } from './Icon';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, toggleTheme }) => {
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-dark-background"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Icon name="moon" className="w-6 h-6" />
      ) : (
        <Icon name="sun" className="w-6 h-6" />
      )}
    </button>
  );
};
