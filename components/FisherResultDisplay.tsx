import React from 'react';
import { FisherAnalysisResult, FisherScore } from '../types';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { CrossCircleIcon } from './icons/CrossCircleIcon';
import { MinusCircleIcon } from './icons/MinusCircleIcon';
import { TrophyIcon } from './icons/TrophyIcon';

interface FisherResultDisplayProps {
  result: FisherAnalysisResult & { companyExists: true };
  onStartTournamentAnalysis: (ticker: string, companyName: string, country: string) => void;
}

const ScoreIndicator: React.FC<{ score: FisherScore }> = ({ score }) => {
    switch (score) {
        case 'Ja':
            return <div className="flex items-center gap-2 text-green-400"><CheckCircleIcon className="w-5 h-5" /> Ja</div>;
        case 'Nein':
            return <div className="flex items-center gap-2 text-red-400"><CrossCircleIcon className="w-5 h-5" /> Nein</div>;
        case 'Teilweise':
            return <div className="flex items-center gap-2 text-yellow-400"><MinusCircleIcon className="w-5 h-5" /> Teilweise</div>;
        default:
            return null;
    }
}

export const FisherResultDisplay: React.FC<FisherResultDisplayProps> = ({ result, onStartTournamentAnalysis }) => {
  return (
    <div className="space-y-8">
      <header className="text-center p-6 bg-gray-800 rounded-lg border border-gray-700">
        <h2 className="text-3xl font-bold text-white">{result.companyName} ({result.ticker})</h2>
        <p className="mt-4 text-gray-300 leading-relaxed max-w-3xl mx-auto border-l-2 border-blue-500 pl-4 text-left">
            <strong>Gesamteinschätzung:</strong> {result.overallAssessment}
        </p>
        <div className="mt-6 flex justify-center">
            <button
                onClick={() => onStartTournamentAnalysis(result.ticker, result.companyName, result.country)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-blue-600/20 text-blue-300 font-semibold rounded-lg hover:bg-blue-600/40 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 transition-all duration-200"
            >
                <TrophyIcon className="w-5 h-5" />
                Turnier-Analyse starten
            </button>
        </div>
      </header>
      
      <div className="space-y-4">
        {result.points.sort((a, b) => a.point - b.point).map(point => (
          <div key={point.point} className="bg-gray-800/50 border border-gray-700 rounded-lg p-5">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-3">
               <h4 className="text-md font-semibold text-gray-200">
                <span className="text-blue-400 mr-2">{point.point}.</span>
                {point.question}
                </h4>
              <div className="font-bold text-sm flex-shrink-0">
                <ScoreIndicator score={point.score} />
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-normal">{point.analysis}</p>
          </div>
        ))}
      </div>
    </div>
  );
};