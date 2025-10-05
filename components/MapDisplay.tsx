import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Circle, Popup, useMap, Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import type { Area, MapViewState, Theme } from '../types';

interface MapDisplayProps {
  areas: Area[];
  viewState: MapViewState;
  selectedArea: Area | null;
  onMarkerClick: (area: Area) => void;
  theme: Theme;
  searchCircle: { center: [number, number]; radius: number } | null;
}

const MapUpdater: React.FC<{ viewState: MapViewState; theme: Theme }> = ({ viewState, theme }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(viewState.center, viewState.zoom);
  }, [map, viewState]);

  useEffect(() => {
    const popupPane = map.getPane('popupPane');
    if (popupPane) {
      if (theme === 'dark') {
        popupPane.classList.add('dark-theme-popup');
      } else {
        popupPane.classList.remove('dark-theme-popup');
      }
    }
  }, [map, theme]);

  return null;
};

const createPinSvg = (color: string) => `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="36" height="36" style="filter: drop-shadow(0px 3px 3px rgba(0,0,0,0.4));">
    <path fill-rule="evenodd" d="M12 2.25c-3.72 0-6.75 3.03-6.75 6.75 0 4.163 3.435 9.17 6.75 12.75 3.315-3.58 6.75-8.587 6.75-12.75 0-3.72-3.03-6.75-6.75-6.75zM12 12a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clip-rule="evenodd" />
  </svg>`;

const createMarkerIcon = (isSelected: boolean, theme: Theme): L.DivIcon => {
  let color: string;
  if (theme === 'dark') {
    color = isSelected ? '#a5b4fc' : '#6366f1'; // indigo-300, indigo-500
  } else {
    color = isSelected ? '#4f46e5' : '#818cf8'; // indigo-600, indigo-400
  }

  return L.divIcon({
    html: createPinSvg(color),
    className: '', // important to clear default styling
    iconSize: [36, 36],
    iconAnchor: [18, 36], // Point of the pin
    popupAnchor: [0, -36]
  });
};


export const MapDisplay: React.FC<MapDisplayProps> = ({ areas, viewState, selectedArea, onMarkerClick, theme, searchCircle }) => {
  const popupRef = useRef<L.Popup | null>(null);
  
  const tileUrl = theme === 'light' 
    ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
  
  const attribution = theme === 'light'
    ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

  return (
    <MapContainer key={theme} center={viewState.center} zoom={viewState.zoom} scrollWheelZoom={true} className="h-full w-full">
      <TileLayer
        attribution={attribution}
        url={tileUrl}
      />
      <MapUpdater viewState={viewState} theme={theme} />
      
      {searchCircle && (
          <Circle
            center={searchCircle.center}
            radius={searchCircle.radius}
            pathOptions={{
              color: theme === 'dark' ? '#22c55e' : '#16a34a', // green-500, green-600
              fillColor: theme === 'dark' ? '#22c55e' : '#16a34a',
              fillOpacity: 0.05,
              weight: 2,
              dashArray: '10, 5',
            }}
          />
        )}

      {areas.map(area => {
        const isSelected = selectedArea?.id === area.id;
        const accommodationCircleOptions = {
          color: theme === 'dark' ? '#fb923c' : '#f97316', // orange-400, orange-500
          fillColor: theme === 'dark' ? '#fb923c' : '#f97316',
          fillOpacity: 0.1,
          weight: 2,
          dashArray: '5, 10',
        };

        return (
          <React.Fragment key={area.id}>
            <Circle 
              center={[area.lat, area.lng]} 
              radius={area.areaRadius}
              pathOptions={accommodationCircleOptions}
              eventHandlers={{
                  click: () => onMarkerClick(area),
              }}
            >
              <Tooltip sticky>
                <div className="font-sans">
                  <span className="font-semibold">Accommodation Perimeter</span>
                  <br/>
                  Radius: {(area.areaRadius / 1000).toFixed(2)} km
                </div>
              </Tooltip>
              <Popup ref={popupRef}>
                <div className="font-sans">
                  <h3 className="font-bold text-base mb-1">{area.name}</h3>
                  <p className="text-sm">{area.summary}</p>
                </div>
              </Popup>
            </Circle>
            <Marker
              position={[area.lat, area.lng]}
              icon={createMarkerIcon(isSelected, theme)}
              eventHandlers={{
                click: () => onMarkerClick(area),
              }}
            />
          </React.Fragment>
        )
      })}
    </MapContainer>
  );
};