
import React, { useState } from 'react';
import type { SearchParams } from '../types';
import { SearchIcon, UsersIcon } from './Icons';

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
  isLoading: boolean;
}

export const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading }) => {
  const [location, setLocation] = useState<string>('Paris, France');
  const [radius, setRadius] = useState<number>(5);
  const [unit, setUnit] = useState<'km' | 'miles'>('km');
  const [desiredFeatures, setDesiredFeatures] = useState<string>('historic architecture with cobblestone streets');
  const [crewSize, setCrewSize] = useState<number>(50);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location.trim() && radius > 0 && crewSize > 0) {
      onSearch({ location, radius, unit, desiredFeatures, crewSize });
    }
  };

  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Base Location
          </label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., San Francisco, CA"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            required
          />
        </div>

        <div>
            <label htmlFor="desiredFeatures" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Desired Scene Features
            </label>
            <textarea
                id="desiredFeatures"
                value={desiredFeatures}
                onChange={(e) => setDesiredFeatures(e.target.value)}
                placeholder="e.g., quiet parks, historical architecture..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            />
        </div>
        
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <label htmlFor="radius" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Search Radius
            </label>
            <input
              type="number"
              id="radius"
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              required
            />
          </div>
          <div className="flex-1">
            <select
              id="unit"
              value={unit}
              onChange={(e) => setUnit(e.target.value as 'km' | 'miles')}
              className="w-full px-3 py-2 mt-6 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="km">Kilometers</option>
              <option value="miles">Miles</option>
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="crewSize" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <UsersIcon className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500" />
            Number of Crew Members
          </label>
          <input
            type="number"
            id="crewSize"
            value={crewSize}
            onChange={(e) => setCrewSize(Number(e.target.value))}
            min="1"
            placeholder="e.g., 50"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            required
          />
        </div>
        <div className="pt-2 space-y-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </>
            ) : (
             <>
                <SearchIcon className="h-5 w-5 mr-2" />
                Analyze Locations
             </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
