// Fix: Removed self-import of `HotelInfo` to resolve declaration conflict.
// Fix: Removed self-import which was causing declaration conflicts.

export interface FeatureAnalysis {
  feature: string;
  present: boolean;
}

export interface Availability {
  available: number;
  total: number;
}

export interface Area {
  id: string;
  name: string;
  summary: string;
  featureAnalysis: FeatureAnalysis[];
  lat: number;
  lng: number;
  areaRadius: number;
  scores: {
    accommodation: Availability;
    catering: Availability;
    parking: Availability;
    accommodationCapacity: string;
    exampleHotels?: HotelInfo[];
    exampleCatering?: string[];
    exampleParking?: string[];
  };
}

export interface HotelInfo {
  name: string;
  priceRange: string;
}

export interface SearchParams {
  location: string;
  radius: number;
  unit: 'km' | 'miles';
  desiredFeatures: string;
  crewSize: number;
}

export type Theme = 'light' | 'dark';

export interface MapViewState {
  center: [number, number];
  zoom: number;
}