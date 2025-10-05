import React, { useState, useCallback, useEffect } from 'react';
import { SearchForm } from './components/SearchForm';
import { MapDisplay } from './components/MapDisplay';
import { ResultsPanel } from './components/ResultsPanel';
import { DetailsPanel } from './components/DetailsPanel';
import { findAreas } from './services/geminiService';
import type { Area, SearchParams, MapViewState, Theme } from './types';
import { LogoIcon } from './components/Icons';
import { ThemeToggle } from './components/ThemeToggle';

const getInitialTheme = (): Theme => {
  if (typeof window !== 'undefined' && localStorage.getItem('theme')) {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
  }
  if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};


const App: React.FC = () => {
  const [areas, setAreas] = useState<Area[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);
  const [mapViewState, setMapViewState] = useState<MapViewState>({
    center: [48.8566, 2.3522], // Default to Paris
    zoom: 12,
  });
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [view, setView] = useState<'search' | 'details'>('search');
  const [searchCircle, setSearchCircle] = useState<{ center: [number, number]; radius: number; } | null>(null);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleSearch = useCallback(async (params: SearchParams) => {
    setIsLoading(true);
    setError(null);
    setAreas([]);
    setSelectedArea(null);
    setView('search');
    setSearchCircle(null);

    try {
      const results = await findAreas(params);
      setAreas(results);
      if (results.length > 0) {
        // Find the center of all returned areas to center the map
        const latitudes = results.map(a => a.lat);
        const longitudes = results.map(a => a.lng);
        const avgLat = latitudes.reduce((sum, lat) => sum + lat, 0) / latitudes.length;
        const avgLng = longitudes.reduce((sum, lng) => sum + lng, 0) / longitudes.length;
        
        const radiusInMeters = params.unit === 'km' 
          ? params.radius * 1000 
          : params.radius * 1609.34;
        
        setSearchCircle({ center: [avgLat, avgLng], radius: radiusInMeters });

        setMapViewState({
          center: [avgLat, avgLng],
          zoom: 13,
        });
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch areas. Please check your query or API key.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleAreaSelect = useCallback((area: Area) => {
    setSelectedArea(area);
    setMapViewState(prevState => ({
        ...prevState,
        center: [area.lat, area.lng],
        zoom: 14,
    }));
    setView('details');
  }, []);

  const handleBackToSearch = useCallback(() => {
    setView('search');
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col font-sans overflow-hidden bg-gray-100 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-md z-20 p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center">
          <LogoIcon className="h-8 w-8 text-indigo-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">SceneBay</h1>
        </div>
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </header>
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-[450px] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col shadow-lg z-10">
          {view === 'search' ? (
            <>
              <SearchForm onSearch={handleSearch} isLoading={isLoading} />
              <div className="flex-1 overflow-y-auto">
                <ResultsPanel 
                  areas={areas} 
                  isLoading={isLoading}
                  error={error}
                  selectedArea={selectedArea}
                  onAreaSelect={handleAreaSelect}
                />
              </div>
            </>
          ) : selectedArea ? (
            <DetailsPanel area={selectedArea} onBack={handleBackToSearch} />
          ) : null}
        </aside>
        <main className="flex-1 h-full">
          <MapDisplay 
            theme={theme}
            areas={areas}
            viewState={mapViewState}
            selectedArea={selectedArea}
            onMarkerClick={handleAreaSelect}
            searchCircle={searchCircle}
          />
        </main>
      </div>
    </div>
  );
};

export default App;