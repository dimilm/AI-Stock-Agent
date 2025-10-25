import React from 'react';
import { Stock } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';

interface StockCardProps {
  stock: Stock;
  onStartFisherAnalysis: (ticker: string, companyName: string, country: string) => void;
}

const Metric: React.FC<{ label: string; value: string | number; unit?: string }> = ({ label, value, unit }) => (
  <div>
    <p className="text-sm text-gray-400">{label}</p>
    <p className="text-lg font-bold text-teal-300">
      {value}
      {unit && <span className="text-sm font-normal text-gray-400 ml-1">{unit}</span>}
    </p>
  </div>
);

export const StockCard: React.FC<StockCardProps> = ({ stock, onStartFisherAnalysis }) => {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 flex flex-col gap-4 transform hover:scale-105 hover:border-blue-500 transition-all duration-300 shadow-lg hover:shadow-blue-500/20">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-white">{stock.companyName}</h3>
          <p className="text-sm text-gray-400">{stock.country}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="px-3 py-1 bg-gray-700 text-blue-300 text-sm font-mono rounded-full">{stock.ticker}</p>
          {stock.wkn && <p className="mt-1 text-xs text-gray-400 font-mono">WKN: {stock.wkn}</p>}
        </div>
      </div>
      
      <p className="text-gray-300 text-base leading-relaxed border-l-2 border-blue-500 pl-4">
        {stock.reasoning}
      </p>

      <div className="mt-2 pt-4 border-t border-gray-700 grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
        <Metric label="Marktkap." value={stock.marketCap} />
        <Metric label="KGV" value={stock.peRatio.toFixed(2)} />
        <Metric label="Dividende" value={stock.dividendYield.toFixed(2)} unit="%" />
        <Metric label="ROE" value={stock.roe.toFixed(2)} unit="%" />
        <Metric label="Umsatzwach." value={stock.revenueGrowth} />
      </div>

      <div className="mt-auto pt-4 border-t border-gray-700/50">
        <button
          onClick={() => onStartFisherAnalysis(stock.ticker, stock.companyName, stock.country)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600/20 text-blue-300 font-semibold rounded-lg hover:bg-blue-600/40 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 transition-all duration-200"
        >
          <SparklesIcon className="w-5 h-5" />
          Fisher-Analyse starten
        </button>
      </div>
    </div>
  );
};