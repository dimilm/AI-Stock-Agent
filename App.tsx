import React, { useState, useCallback, useEffect } from 'react';
import { Stock } from './types';
import { getTopStocks } from './services/geminiService';
import { CriteriaInput } from './components/CriteriaInput';
import { StockCard } from './components/StockCard';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { CriteriaSuggestions } from './components/CriteriaSuggestions';
import { FilterControls } from './components/FilterControls';
import { FisherAnalysis } from './components/FisherAnalysis';
import { TournamentAnalysis } from './components/TournamentAnalysis';

type Tab = 'criteria' | 'fisher' | 'tournament';
interface CompanyInfo {
  ticker: string;
  companyName: string;
  country: string;
}

const App: React.FC = () => {
  const [criteria, setCriteria] = useState<string>('');
  const [country, setCountry] = useState<string>('Weltweit');
  const [industry, setIndustry] = useState<string>('Alle Branchen');
  const [topStocks, setTopStocks] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('criteria');
  const [initialFisherInfo, setInitialFisherInfo] = useState<CompanyInfo | null>(null);
  const [initialTournamentInfo, setInitialTournamentInfo] = useState<CompanyInfo | null>(null);


  const handleAnalysis = useCallback(async () => {
    if (!criteria.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setTopStocks([]);

    try {
      const results = await getTopStocks(criteria, country, industry);
      setTopStocks(results);
    } catch (err) {
      console.error(err);
      setError('Fehler bei der Analyse. Bitte versuchen Sie es später erneut.');
    } finally {
      setIsLoading(false);
    }
  }, [criteria, country, industry, isLoading]);
  
  const handleSelectCriterion = (criterion: string) => {
    setCriteria(prev => prev ? `${prev}, ${criterion}` : criterion);
  };

  const handleStartFisherAnalysis = (ticker: string, companyName: string, country: string) => {
    setInitialFisherInfo({ ticker, companyName, country });
    setActiveTab('fisher');
  };

  const handleStartTournamentAnalysis = (ticker: string, companyName: string, country: string) => {
    setInitialTournamentInfo({ ticker, companyName, country });
    setActiveTab('tournament');
  };

  // Reset the initial infos when navigating away
  useEffect(() => {
    if (activeTab !== 'fisher') {
      setInitialFisherInfo(null);
    }
    if (activeTab !== 'tournament') {
      setInitialTournamentInfo(null);
    }
  }, [activeTab]);

  const TabButton: React.FC<{tabName: Tab; label: string}> = ({ tabName, label }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
        activeTab === tabName
          ? 'bg-blue-600 text-white'
          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-10">
          <div className="flex items-center justify-center gap-3">
            <SparklesIcon className="w-10 h-10 text-blue-400" />
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300">
              KI Aktien-Analyse-Agent
            </h1>
          </div>
          <p className="mt-4 text-lg text-gray-400 max-w-3xl mx-auto">
            Nutzen Sie KI für eine kriterienbasierte Suche, eine Tiefenanalyse nach P. A. Fisher oder ein kompetitives Aktien-Turnier.
          </p>
        </header>

        <div className="max-w-4xl mx-auto mb-8 flex justify-center gap-2 md:gap-4 flex-wrap">
          <TabButton tabName="criteria" label="Kriterien-Analyse" />
          <TabButton tabName="fisher" label="15-Punkte-Analyse (Fisher)" />
          <TabButton tabName="tournament" label="Turnier-Analyse" />
        </div>

        {activeTab === 'criteria' && (
          <>
            <section className="max-w-3xl mx-auto mb-12">
              <FilterControls 
                country={country}
                setCountry={setCountry}
                industry={industry}
                setIndustry={setIndustry}
                isLoading={isLoading}
              />
              <CriteriaSuggestions onSelect={handleSelectCriterion} />
              <CriteriaInput
                criteria={criteria}
                setCriteria={setCriteria}
                onAnalyze={handleAnalysis}
                isLoading={isLoading}
              />
            </section>

            <section>
              {isLoading && <LoadingSpinner />}
              {error && <ErrorMessage message={error} />}
              {!isLoading && !error && topStocks.length > 0 && (
                <>
                  <h2 className="text-2xl font-bold text-center mb-8 text-gray-200">Top 5 Ergebnisse</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {topStocks.map((stock, index) => (
                      <StockCard 
                        key={`${stock.ticker}-${index}`} 
                        stock={stock} 
                        onStartFisherAnalysis={handleStartFisherAnalysis}
                      />
                    ))}
                  </div>
                </>
              )}
              {!isLoading && !error && topStocks.length === 0 && (
                <div className="text-center py-16 px-6 bg-gray-800/50 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-300">Bereit für die Kriterien-Analyse</h3>
                    <p className="text-gray-400 mt-2">Ihre Ergebnisse werden hier angezeigt.</p>
                </div>
              )}
            </section>
          </>
        )}
        
        {activeTab === 'fisher' && (
          <FisherAnalysis 
            initialInfo={initialFisherInfo} 
            onStartTournamentAnalysis={handleStartTournamentAnalysis}
          />
        )}

        {activeTab === 'tournament' && (
          <TournamentAnalysis 
            initialInfo={initialTournamentInfo}
            onStartFisherAnalysis={handleStartFisherAnalysis}
          />
        )}
        
        <footer className="text-center mt-16 text-xs text-gray-500">
          <p>
            Haftungsausschluss: Die von dieser KI generierten Informationen dienen nur zu Informationszwecken und stellen keine Finanzberatung dar. Führen Sie immer Ihre eigene Recherche durch.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default App;