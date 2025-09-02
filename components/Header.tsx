
import React from 'react';
import { ThemeToggle } from './ThemeToggle';
import { Icon } from './Icon';

interface HeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
  return (
    <header className="sticky top-0 z-10 w-full bg-background/80 dark:bg-dark-background/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-primary-light dark:bg-primary-dark text-primary dark:text-white">
                <Icon name="search" className="w-6 h-6"/>
            </div>
            <h1 className="text-xl lg:text-2xl font-bold text-foreground dark:text-dark-foreground tracking-tight">
              日本語情報調査
            </h1>
          </div>
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>
      </div>
    </header>
  );
};
