import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

interface AutocompleteSelectProps {
  label: string;
  value: string;
  onChange: (newValue: string) => void;
  options: string[];
  disabled: boolean;
  placeholder?: string;
}

export const AutocompleteSelect: React.FC<AutocompleteSelectProps> = ({
  label,
  value,
  onChange,
  options,
  disabled,
  placeholder = 'Option auswählen...'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = `listbox-${label.replace(/\s+/g, '-').toLowerCase()}`;

  useEffect(() => {
    // Synchronisiert die interne Abfrage mit dem externen Wert, wenn das Eingabefeld nicht fokussiert ist
    if (document.activeElement !== inputRef.current) {
      setQuery(value);
    }
  }, [value]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        // Setzt die Abfrage auf den tatsächlichen Wert zurück, wenn der Benutzer wegklickt, ohne auszuwählen
        setQuery(value);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [value]);

  const filteredOptions = useMemo(() => {
    if (!query || query === value) {
        return options;
    }
    const lowerCaseQuery = query.toLowerCase();
    return options.filter(option => option.toLowerCase().includes(lowerCaseQuery));
  }, [query, options, value]);
  

  const handleSelect = (option: string) => {
    onChange(option);
    setQuery(option);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (!isOpen) {
      setIsOpen(true);
    }
  }

  return (
    <div className="flex-1" ref={containerRef}>
      <label htmlFor={label} className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
      <div 
        className="relative"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <input
          ref={inputRef}
          id={label}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          disabled={disabled}
          placeholder={placeholder}
          className="w-full p-2 pr-10 bg-gray-800 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-gray-200 disabled:opacity-50"
          aria-autocomplete="list"
          aria-controls={listboxId}
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled}
          className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-400 hover:text-gray-200"
          aria-label="Toggle options"
        >
          <ChevronDownIcon className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isOpen && (
          <ul
            id={listboxId}
            role="listbox"
            className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto"
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <li
                  key={option + index}
                  onClick={() => handleSelect(option)}
                  onMouseDown={(e) => e.preventDefault()} // Verhindert das Verlassen des Fokus beim Klicken
                  className="px-4 py-2 text-gray-200 cursor-pointer hover:bg-blue-600/50"
                  role="option"
                  aria-selected={option === value}
                >
                  {option}
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-gray-500">Keine Ergebnisse</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};
