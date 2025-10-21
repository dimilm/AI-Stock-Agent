import React from 'react';

interface CriteriaSuggestionsProps {
  onSelect: (criterion: string) => void;
}

const suggestions = [
  { label: 'Niedriges KGV', value: 'Aktien mit niedrigem KGV (<15)' },
  { label: 'Hohe ROE', value: 'Unternehmen mit hoher Eigenkapitalrendite (>20%)' },
  { label: 'Starkes Wachstum', value: 'Firmen mit starkem Umsatzwachstum (>15% p.a.)' },
  { label: 'Dividenden-Aktien', value: 'stabile Dividendenzahler mit Rendite >3%' },
  { label: 'Unterbewertet', value: 'unterbewertete Aktien (Value Investing)' },
  { label: 'Starker Burggraben', value: 'Unternehmen mit starkem Wettbewerbsvorteil (Burggraben)' },
  { label: 'Fähiges Management', value: 'Unternehmen mit fähigem und ehrlichem Management' },
  { label: 'Sicherheitsmarge', value: 'Aktien mit deutlicher Sicherheitsmarge zum inneren Wert' },
];

export const CriteriaSuggestions: React.FC<CriteriaSuggestionsProps> = ({ onSelect }) => {
  return (
    <div className="mb-4">
      <p className="text-sm text-gray-400 mb-2 text-center">Inspirations-Kriterien hinzufügen:</p>
      <div className="flex flex-wrap gap-2 justify-center">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion.label}
            onClick={() => onSelect(suggestion.value)}
            className="px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded-full hover:bg-gray-600 hover:text-white transition-colors duration-200 border border-gray-600"
          >
            {suggestion.label}
          </button>
        ))}
      </div>
    </div>
  );
};
