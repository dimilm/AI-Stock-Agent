import React, { useState, useCallback, useRef, useEffect } from 'react';
import { TournamentResult } from '../types';
import { getTournamentResult, getTickerForCompany } from '../services/geminiService';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { TournamentResultDisplay } from './TournamentResultDisplay';
import { TrophyIcon } from './icons/TrophyIcon';

interface TournamentAnalysisProps {
  onStartFisherAnalysis: (ticker: string, companyName: string, country: string) => void;
  initialInfo?: { ticker: string; companyName: string; country: string } | null;
}

export const TournamentAnalysis: React.FC<TournamentAnalysisProps> = ({ onStartFisherAnalysis, initialInfo }) => {
  const [tickerInput, setTickerInput] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<TournamentResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isResolvingTicker, setIsResolvingTicker] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const analysisInProgress = useRef(false);

  const handleAnalyze = useCallback(async (input: string, context?: { companyName: string; country: string }, skipLookup = false) => {
    if (!input.trim() || analysisInProgress.current) return;

    analysisInProgress.current = true;
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    let finalTicker = input;

    try {
      if (!skipLookup) {
        setIsResolvingTicker(true);
        const resolvedTicker = await getTickerForCompany(input);
        setIsResolvingTicker(false);

        if (!resolvedTicker) {
          throw new Error(`Konnte kein Tickersymbol für "${input}" finden. Bitte das offizielle Kürzel versuchen (z.B. AAPL).`);
        }
        finalTicker = resolvedTicker;
        setTickerInput(finalTicker);
      }
      
      const result = await getTournamentResult(finalTicker, context);
       if (result.companyExists === false) {
        setError(`Kein reales Unternehmen für den Ticker "${finalTicker}" gefunden. Turnier konnte nicht gestartet werden.`);
        setAnalysisResult(null);
      } else {
        setAnalysisResult(result);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ein unbekannter Fehler ist aufgetreten.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      setIsResolvingTicker(false);
      analysisInProgress.current = false;
    }
  }, []);

  useEffect(() => {
    if (initialInfo) {
      setTickerInput(initialInfo.ticker);
      handleAnalyze(initialInfo.ticker, { companyName: initialInfo.companyName, country: initialInfo.country }, true);
    }
  }, [initialInfo, handleAnalyze]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAnalyze(tickerInput, undefined, false);
    }
  };

  const buttonText = isLoading
    ? (isResolvingTicker ? 'Ticker wird gesucht...' : 'Turnier läuft...')
    : 'Turnier starten';

  return (
    <section className="max-w-4xl mx-auto">
      <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
        <h2 className="text-xl font-bold text-center mb-1 text-gray-200">Aktien-Turnier nach Schweizer Methode</h2>
        <p className="text-sm text-gray-400 text-center mb-6">Geben Sie eine Aktie (z.B. Apple, Daimler) an. Die KI findet 5 Konkurrenten aus 5 Ländern und ermittelt den Sieger.</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={tickerInput}
            onChange={(e) => setTickerInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Firmenname oder Ticker..."
            className="flex-grow p-3 bg-gray-700 border-2 border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-gray-200 placeholder-gray-500"
            disabled={isLoading}
          />
          <button
            onClick={() => handleAnalyze(tickerInput, undefined, false)}
            disabled={isLoading || !tickerInput.trim()}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 transition-all duration-200"
          >
            <TrophyIcon className="w-5 h-5" />
            <span>{buttonText}</span>
          </button>
        </div>
      </div>

      <div className="mt-8">
        {isLoading && <LoadingSpinner />}
        {error && <ErrorMessage message={error} />}
        {analysisResult && analysisResult.companyExists && <TournamentResultDisplay result={analysisResult} onStartFisherAnalysis={onStartFisherAnalysis} />}
        {!isLoading && !error && !analysisResult && (
          <div className="text-center py-16 px-6 bg-gray-800/50 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-300">Bereit für das Aktien-Turnier</h3>
            <p className="text-gray-400 mt-2">Das Ergebnis des Turniers wird hier angezeigt.</p>
          </div>
        )}
      </div>
    </section>
  );
};