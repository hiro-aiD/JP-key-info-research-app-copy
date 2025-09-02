
import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { SearchHistory } from './components/SearchHistory';
import { ResultsDisplay } from './components/ResultsDisplay';
import { fetchInformation } from './services/geminiService';
import type { SearchResult } from './types';

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedTheme = window.localStorage.getItem('theme');
      if (storedTheme === 'dark' || storedTheme === 'light') {
        return storedTheme;
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [currentQuery, setCurrentQuery] = useState('');

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('searchHistory');
      if (storedHistory) {
        setSearchHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error('Failed to parse search history from localStorage', e);
      setSearchHistory([]);
    }
  }, []);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const updateSearchHistory = useCallback((newQuery: string) => {
    setSearchHistory(prevHistory => {
      const updatedHistory = [newQuery, ...prevHistory.filter(item => item !== newQuery)].slice(0, 10);
      localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
      return updatedHistory;
    });
  }, []);

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) return;
    setIsLoading(true);
    setError(null);
    setSearchResult(null);
    setCurrentQuery(query);
    try {
      const result = await fetchInformation(query);
      setSearchResult(result);
      updateSearchHistory(query);
    } catch (err) {
      if (err instanceof Error) {
        setError(`調査中にエラーが発生しました: ${err.message}`);
      } else {
        setError('調査中に不明なエラーが発生しました。');
      }
    } finally {
      setIsLoading(false);
    }
  }, [updateSearchHistory]);

  return (
    <div className="min-h-screen font-sans transition-colors duration-300 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Header theme={theme} toggleTheme={toggleTheme} />
      <main className="container mx-auto p-4 lg:p-6">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <aside className="lg:col-span-3 mb-6 lg:mb-0">
            <div className="sticky top-24">
              <SearchBar onSearch={handleSearch} isLoading={isLoading} />
              <SearchHistory history={searchHistory} onHistoryClick={handleSearch} />
            </div>
          </aside>
          <div className="lg:col-span-9">
            <ResultsDisplay 
              isLoading={isLoading} 
              error={error} 
              result={searchResult}
              query={currentQuery}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
