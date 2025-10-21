import React from 'react';

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

const SelectInput: React.FC<{
  label: string, 
  value: string, 
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void,
  options: string[],
  disabled: boolean
}> = ({ label, value, onChange, options, disabled }) => (
  <div className="flex-1">
    <label htmlFor={label} className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
    <select
      id={label}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-full p-2 bg-gray-800 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-gray-200 disabled:opacity-50"
    >
      {options.map(option => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
  </div>
);


export const FilterControls: React.FC<FilterControlsProps> = ({ country, setCountry, industry, setIndustry, isLoading }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-4">
      <SelectInput 
        label="Land"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        options={countries}
        disabled={isLoading}
      />
       <SelectInput 
        label="Branche"
        value={industry}
        onChange={(e) => setIndustry(e.target.value)}
        options={industries}
        disabled={isLoading}
      />
    </div>
  );
};