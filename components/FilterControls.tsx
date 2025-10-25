import React from 'react';
import { AutocompleteSelect } from './AutocompleteSelect';

interface FilterControlsProps {
  country: string;
  setCountry: (value: string) => void;
  industry: string;
  setIndustry: (value: string) => void;
  isLoading: boolean;
}

const countries = [
  'Weltweit',
  'Australien',
  'Belgien',
  'Brasilien',
  'China',
  'Dänemark',
  'Deutschland',
  'Finnland',
  'Frankreich',
  'Großbritannien',
  'Hongkong',
  'Indien',
  'Indonesien',
  'Irland',
  'Israel',
  'Italien',
  'Japan',
  'Kanada',
  'Mexiko',
  'Niederlande',
  'Norwegen',
  'Österreich',
  'Polen',
  'Portugal',
  'Russland',
  'Saudi-Arabien',
  'Schweden',
  'Schweiz',
  'Singapur',
  'Spanien',
  'Südafrika',
  'Südkorea',
  'Taiwan',
  'Türkei',
  'USA',
];
const industries = ['Alle Branchen', 'Technologie', 'Security', 'Gesundheitswesen', 'Finanzen', 'Industrie', 'Konsumgüter (zyklisch)', 'Konsumgüter (nicht-zyklisch)', 'Energie', 'Rohstoffe', 'Immobilien'];

export const FilterControls: React.FC<FilterControlsProps> = ({ country, setCountry, industry, setIndustry, isLoading }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-4">
      <AutocompleteSelect 
        label="Land"
        value={country}
        onChange={setCountry}
        options={countries}
        disabled={isLoading}
        placeholder="Land suchen..."
      />
       <AutocompleteSelect 
        label="Branche"
        value={industry}
        onChange={setIndustry}
        options={industries}
        disabled={isLoading}
        placeholder="Branche suchen..."
      />
    </div>
  );
};