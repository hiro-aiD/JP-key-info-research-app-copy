
import React from 'react';
import { Icon } from './Icon';

interface SearchHistoryProps {
  history: string[];
  onHistoryClick: (query: string) => void;
}

export const SearchHistory: React.FC<SearchHistoryProps> = ({ history, onHistoryClick }) => {
  if (history.length === 0) {
    return null;
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
      <h3 className="text-md font-semibold mb-3 flex items-center gap-2">
        <Icon name="history" className="w-5 h-5"/>
        検索履歴
      </h3>
      <ul className="space-y-2">
        {history.map((item, index) => (
          <li key={index}>
            <button
              onClick={() => onHistoryClick(item)}
              className="w-full text-left p-2 rounded-md text-sm text-gray-600 dark:text-gray-300 hover:bg-primary-light dark:hover:bg-primary-dark dark:hover:text-white transition-colors"
            >
              {item}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
