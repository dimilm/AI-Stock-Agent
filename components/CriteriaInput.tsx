
import React from 'react';
import { SearchIcon } from './icons/SearchIcon';

interface CriteriaInputProps {
  criteria: string;
  setCriteria: (value: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

export const CriteriaInput: React.FC<CriteriaInputProps> = ({ criteria, setCriteria, onAnalyze, isLoading }) => {
  
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      onAnalyze();
    }
  };

  return (
    <div className="relative">
      <textarea
        value={criteria}
        onChange={(e) => setCriteria(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="z.B. unterbewertete Technologieaktien mit starkem Wachstumspotenzial und einer Dividendenrendite von über 2 %..."
        className="w-full h-32 p-4 pr-32 bg-gray-800 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none transition-all duration-200 text-gray-200 placeholder-gray-500"
        disabled={isLoading}
      />
      <button
        onClick={onAnalyze}
        disabled={isLoading || !criteria.trim()}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 transition-all duration-200"
      >
        <SearchIcon className="w-5 h-5" />
        {isLoading ? 'Analysiere...' : 'Analysieren'}
      </button>
    </div>
  );
};
