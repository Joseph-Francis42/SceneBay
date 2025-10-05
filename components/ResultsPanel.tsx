import React from 'react';
import type { Area } from '../types';
import { CheckIcon, XMarkIcon } from './Icons';

interface ResultsPanelProps {
  areas: Area[];
  isLoading: boolean;
  error: string | null;
  selectedArea: Area | null;
  onAreaSelect: (area: Area) => void;
}

const FeatureAnalysisList: React.FC<{ analysis: Area['featureAnalysis'] }> = ({ analysis }) => {
  if (!analysis || analysis.length === 0) {
    return (
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
        No specific features requested. Click to see details.
      </p>
    );
  }

  return (
    <div className="mt-3">
      <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Feature Analysis</h4>
      <ul className="space-y-1.5">
        {analysis.map((feat, index) => (
          <li key={index} className="flex items-center text-sm">
            {feat.present ? (
              <CheckIcon className="h-5 w-5 mr-2 text-green-500 flex-shrink-0" />
            ) : (
              <XMarkIcon className="h-5 w-5 mr-2 text-red-500 flex-shrink-0" />
            )}
            <span className={`capitalize ${feat.present ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500 line-through'}`}>
              {feat.feature}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const ResultItem: React.FC<{
    area: Area, 
    isSelected: boolean, 
    onSelect: (area: Area) => void 
}> = ({ area, isSelected, onSelect }) => (
    <li
        onClick={() => onSelect(area)}
        className={`p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer transition-colors duration-200 ${
            isSelected ? 'bg-indigo-50 dark:bg-indigo-900/50' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
        }`}
    >
        <h3 className="font-semibold text-md text-gray-800 dark:text-gray-200">{area.name}</h3>
        <FeatureAnalysisList analysis={area.featureAnalysis} />
    </li>
);

const SkeletonLoader: React.FC = () => (
    <div className="p-4 space-y-6">
        {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse space-y-4">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                <div className="space-y-4 pt-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                </div>
            </div>
        ))}
    </div>
);

export const ResultsPanel: React.FC<ResultsPanelProps> = ({ areas, isLoading, error, selectedArea, onAreaSelect }) => {
    if (isLoading) {
        return <SkeletonLoader />;
    }

    if (error) {
        return <div className="p-6 text-center text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20">{error}</div>;
    }

    if (areas.length === 0) {
        return <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            <h3 className="font-medium">No locations found</h3>
            <p className="text-sm mt-1">Try adjusting your search criteria or starting a new analysis.</p>
        </div>;
    }

    return (
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {areas.map(area => (
                <ResultItem 
                    key={area.id} 
                    area={area} 
                    isSelected={selectedArea?.id === area.id} 
                    onSelect={onAreaSelect} 
                />
            ))}
        </ul>
    );
};