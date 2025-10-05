import React, { useState } from 'react';
import type { Area, HotelInfo, Availability } from '../types';
import { HomeIcon, CateringIcon, CarIcon, ChevronLeftIcon, UsersIcon, ArrowTopRightOnSquareIcon, TagIcon } from './Icons';

interface DetailsPanelProps {
  area: Area;
  onBack: () => void;
}

const HotelListItem: React.FC<{ hotel: HotelInfo; areaName: string; }> = ({ hotel, areaName }) => {
  const searchUrl = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(`${hotel.name} ${areaName}`)}`;

  return (
    <li className="p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg shadow-sm flex items-center justify-between flex-wrap gap-2">
        <div>
            <p className="font-semibold text-gray-800 dark:text-gray-200">{hotel.name}</p>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                <TagIcon className="h-4 w-4 mr-1.5" />
                <span>{hotel.priceRange}</span>
            </div>
        </div>
        <a 
          href={searchUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Check Availability
          <ArrowTopRightOnSquareIcon className="h-3 w-3 ml-1.5" />
        </a>
    </li>
  );
};


const HotelList: React.FC<{ hotels: HotelInfo[] | undefined; areaName: string; }> = ({ hotels, areaName }) => {
  if (!hotels || hotels.length === 0) return null;
  return (
    <div className="mt-3">
      <h5 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 flex items-center">
        <div className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500"><HomeIcon/></div>
        Suggested Hotels
      </h5>
      <ul className="space-y-2">
        {hotels.map((hotel) => (
          <HotelListItem key={hotel.name} hotel={hotel} areaName={areaName} />
        ))}
      </ul>
    </div>
  );
};


const ExampleList: React.FC<{ title: string; examples: string[] | undefined; icon: React.ReactNode; }> = ({ title, examples, icon }) => {
  if (!examples || examples.length === 0) {
    return null;
  }
  return (
    <div className="mt-3">
      <h5 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 flex items-center">
        <div className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500">{icon}</div>
        {title}
      </h5>
      <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-1">
        {examples.map((example, index) => (
          <li key={index} className="pl-1">{example}</li>
        ))}
      </ul>
    </div>
  );
}

const AvailabilityDisplay: React.FC<{ 
  label: string; 
  availability: Availability; 
  icon: React.ReactNode; 
  unitLabel?: string;
  description?: string; 
  descriptionIcon?: React.ReactNode; 
}> = ({ label, availability, icon, unitLabel = "Available", description, descriptionIcon }) => {
    const ratio = availability.total > 0 ? availability.available / availability.total : 0;
    
    let colorClass = 'bg-green-500';
    if (ratio < 0.6) colorClass = 'bg-yellow-500';
    if (ratio < 0.3) colorClass = 'bg-red-500';

    return (
        <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800/50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="w-6 h-6 mr-3 text-gray-500 dark:text-gray-400">{icon}</div>
                <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300">{label}</h4>
              </div>
              <div className="flex items-center">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mr-2">Status</span>
                <div className={`w-3 h-3 rounded-full ${colorClass}`}></div>
              </div>
            </div>
            <div className="text-center my-3">
              <p className="text-3xl font-bold text-gray-800 dark:text-gray-200">
                {availability.available} / <span className="text-2xl text-gray-500 dark:text-gray-400">{availability.total}</span>
              </p>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{unitLabel}</p>
            </div>
            {description && (
              <div className="flex items-center justify-center text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                {descriptionIcon && <div className="w-4 h-4 mr-1.5 text-gray-400 dark:text-gray-500">{descriptionIcon}</div>}
                <p>{description}</p>
              </div>
            )}
        </div>
    );
};


export const DetailsPanel: React.FC<DetailsPanelProps> = ({ area, onBack }) => {
  const [cateringNeeded, setCateringNeeded] = useState(true);

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <button 
          onClick={onBack}
          className="flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
        >
          <ChevronLeftIcon className="h-5 w-5 mr-1" />
          Back to Results
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{area.name}</h2>
            <p className="text-gray-600 dark:text-gray-400">
                {area.summary}
            </p>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">Logistics Analysis</h3>
            <div className="space-y-4">
              <div>
                <AvailabilityDisplay 
                  label="Accommodation" 
                  availability={area.scores.accommodation} 
                  icon={<HomeIcon />}
                  unitLabel="Rooms Available"
                  description={area.scores.accommodationCapacity} 
                  descriptionIcon={<UsersIcon />}
                />
                <HotelList hotels={area.scores.exampleHotels} areaName={area.name} />
              </div>
              <div>
                <AvailabilityDisplay 
                  label="Parking" 
                  availability={area.scores.parking} 
                  icon={<CarIcon />}
                  unitLabel="Lots / Garages"
                />
                <ExampleList title="Examples" examples={area.scores.exampleParking} icon={<CarIcon />} />
              </div>
            </div>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Catering Needs</h3>
                <label htmlFor="catering-toggle" className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" id="catering-toggle" className="sr-only peer" checked={cateringNeeded} onChange={() => setCateringNeeded(!cateringNeeded)} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                </label>
            </div>
            {cateringNeeded && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <ExampleList title="Catering Options" examples={area.scores.exampleCatering} icon={<CateringIcon />} />
                </div>
            )}
        </div>

      </div>
    </div>
  );
};