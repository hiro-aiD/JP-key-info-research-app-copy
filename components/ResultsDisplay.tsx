
import React, { useState, useEffect } from 'react';
import type { SearchResult } from '../types';
import { Icon } from './Icon';

interface ResultsDisplayProps {
  isLoading: boolean;
  error: string | null;
  result: SearchResult | null;
  query: string;
}

const ResultCard: React.FC<{ title: string; icon: string; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6 animate-fadeIn">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-3 text-primary dark:text-secondary">
            <Icon name={icon} className="w-6 h-6" />
            {title}
        </h2>
        {children}
    </div>
);


export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ isLoading, error, result, query }) => {
    const [isCopied, setIsCopied] = useState(false);
    
    useEffect(() => {
        if (isCopied) {
            const timer = setTimeout(() => setIsCopied(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [isCopied]);

    const copyToMarkdown = () => {
        if (!result) return;
        const markdown = `
# 「${query}」に関する調査結果

**調査日時:** ${result.timestamp}

## サマリー
${result.summary}

## 要点
${result.keyPoints.map(p => `- ${p}`).join('\n')}

## 詳細
${result.details}

## 出典
${result.sources.map(s => `- [${s.title}](${s.uri})`).join('\n')}
        `;
        navigator.clipboard.writeText(markdown.trim());
        setIsCopied(true);
    };


  if (isLoading) {
    return (
        <div className="flex flex-col items-center justify-center h-96 p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <Icon name="loader" className="w-12 h-12 text-primary dark:text-secondary animate-spin"/>
            <p className="mt-4 text-lg font-semibold">調査中...</p>
            <p className="text-gray-500 dark:text-gray-400">最新の情報を収集中です。しばらくお待ちください。</p>
        </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 p-6 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg border border-red-200 dark:border-red-800 shadow-sm">
          <Icon name="error" className="w-12 h-12"/>
          <p className="mt-4 text-lg font-semibold">エラーが発生しました</p>
          <p className="text-center">{error}</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center h-96 p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm text-center">
          <Icon name="bulb" className="w-12 h-12 text-primary dark:text-secondary"/>
          <h2 className="mt-4 text-xl font-semibold">調査を開始</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">左側のパネルでキーワードを入力して、最新情報の調査を始めましょう。検索履歴も利用できます。</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center animate-fadeIn">
        <div>
            <h1 className="text-2xl lg:text-3xl font-bold">調査結果: <span className="text-primary dark:text-secondary">{query}</span></h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">調査日時: {result.timestamp}</p>
        </div>
        <button
            onClick={copyToMarkdown}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary-light dark:bg-secondary-dark text-secondary dark:text-white hover:opacity-90 transition-opacity disabled:opacity-50"
        >
            <Icon name={isCopied ? "check" : "copy"} className="w-5 h-5"/>
            {isCopied ? "コピー完了" : "Markdownコピー"}
        </button>
      </div>

      <ResultCard title="サマリー" icon="summary">
        <p className="text-base leading-relaxed">{result.summary}</p>
      </ResultCard>

      <ResultCard title="要点" icon="list">
        <ul className="space-y-3 list-disc list-inside">
            {result.keyPoints.map((point, index) => (
                <li key={index} className="text-base leading-relaxed">{point}</li>
            ))}
        </ul>
      </ResultCard>

      <ResultCard title="詳細情報" icon="details">
        <p className="text-base leading-relaxed whitespace-pre-wrap">{result.details}</p>
      </ResultCard>

      <ResultCard title="出典" icon="link">
        <ul className="space-y-3">
            {result.sources.map((source, index) => (
                <li key={index}>
                    <a href={source.uri} target="_blank" rel="noopener noreferrer" className="inline-block text-blue-600 dark:text-blue-400 hover:underline">
                        <p className="font-medium">{source.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 break-all">{source.uri}</p>
                    </a>
                </li>
            ))}
        </ul>
      </ResultCard>

    </div>
  );
};
