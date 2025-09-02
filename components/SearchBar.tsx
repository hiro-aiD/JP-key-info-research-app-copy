
import React, { useState } from 'react';
import { Icon } from './Icon';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length > 0 && query.trim().length <= 200) {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <label htmlFor="search-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        調査キーワード
      </label>
      <div className="relative">
        <textarea
          id="search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="例: 人工知能の最新動向, 東京オリンピック"
          className="w-full p-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent resize-none transition-shadow"
          rows={3}
          maxLength={200}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="absolute top-3 right-3 p-2 rounded-full bg-primary text-white hover:bg-primary-dark disabled:bg-gray-400 dark:disabled:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-dark-background"
          aria-label="Search"
        >
          {isLoading ? <Icon name="loader" className="w-5 h-5 animate-spin" /> : <Icon name="search" className="w-5 h-5" />}
        </button>
      </div>
      <p className="text-xs text-right text-gray-500 dark:text-gray-400 mt-1">
        {query.length}/200
      </p>
    </form>
  );
};
