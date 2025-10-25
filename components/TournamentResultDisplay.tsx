import React from 'react';
import { TournamentResult } from '../types';
import { TrophyIcon } from './icons/TrophyIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface TournamentResultDisplayProps {
  result: TournamentResult & { companyExists: true };
  onStartFisherAnalysis: (ticker: string, companyName: string, country: string) => void;
}

export const TournamentResultDisplay: React.FC<TournamentResultDisplayProps> = ({ result, onStartFisherAnalysis }) => {
  const { winner, participants } = result;

  return (
    <div className="space-y-8">
      <header className="text-center p-6 bg-yellow-900/20 rounded-lg border-2 border-yellow-500/80 shadow-lg shadow-yellow-500/10">
        <div className="flex items-center justify-center gap-3 mb-4">
          <TrophyIcon className="w-10 h-10 text-yellow-400" />
          <h2 className="text-3xl font-bold text-white">Turnier-Gewinner</h2>
        </div>
        <h3 className="text-2xl font-bold text-yellow-300">{winner.companyName} ({winner.ticker})</h3>
        <p className="text-md text-gray-400">{winner.country}</p>
        <div className="mt-4 flex justify-center gap-8">
            <div>
                <p className="text-sm text-yellow-200/80">Aktueller Kurs</p>
                <p className="text-lg font-bold text-white">{winner.currentPrice}</p>
            </div>
            <div>
                <p className="text-sm text-yellow-200/80">KGV</p>
                <p className="text-lg font-bold text-white">{winner.peRatio.toFixed(2)}</p>
            </div>
        </div>
        <p className="mt-4 text-gray-300 leading-relaxed max-w-3xl mx-auto border-l-2 border-yellow-500 pl-4 text-left">
          <strong>Begründung:</strong> {winner.justification}
        </p>
        <div className="mt-6 flex justify-center">
            <button
                onClick={() => onStartFisherAnalysis(winner.ticker, winner.companyName, winner.country)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-blue-600/20 text-blue-300 font-semibold rounded-lg hover:bg-blue-600/40 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-all duration-200"
            >
                <SparklesIcon className="w-5 h-5" />
                Fisher-Analyse starten
            </button>
        </div>
      </header>

      <div>
        <h3 className="text-2xl font-bold text-center mb-6 text-gray-200">Alle Teilnehmer</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {participants.map((participant) => (
            <div
              key={participant.ticker}
              className={`p-4 rounded-lg border transition-all duration-300 flex flex-col ${
                participant.ticker === winner.ticker
                  ? 'bg-gray-700/50 border-yellow-500 scale-105'
                  : 'bg-gray-800/60 border-gray-700'
              }`}
            >
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-lg text-white">{participant.companyName}</p>
                      <p className="text-sm text-gray-400">{participant.country}</p>
                    </div>
                    <p className="px-2 py-0.5 bg-gray-700 text-blue-300 text-xs font-mono rounded-full flex-shrink-0">{participant.ticker}</p>
                </div>
                 {participant.ticker === winner.ticker && (
                    <div className="mt-2 text-xs font-bold text-yellow-400 flex items-center gap-1">
                        <TrophyIcon className="w-4 h-4"/>
                        <span>Gewinner</span>
                    </div>
                 )}
                <div className="mt-3 pt-3 border-t border-gray-700/50 flex justify-around text-center">
                    <div>
                        <p className="text-xs text-gray-400">Kurs</p>
                        <p className="font-semibold text-gray-200">{participant.currentPrice}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400">KGV</p>
                        <p className="font-semibold text-gray-200">{participant.peRatio.toFixed(2)}</p>
                    </div>
                </div>
              </div>

              <div className="mt-4">
                  <button
                    onClick={() => onStartFisherAnalysis(participant.ticker, participant.companyName, participant.country)}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm bg-blue-600/20 text-blue-300 font-semibold rounded-lg hover:bg-blue-600/40 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 transition-all duration-200"
                  >
                    <SparklesIcon className="w-4 h-4" />
                    Fisher-Analyse
                  </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};