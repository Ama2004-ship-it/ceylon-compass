import { createContext, useContext, useEffect, useState } from 'react';

const ItineraryContext = createContext(null);
const STORAGE_KEY = 'cc_itinerary_places';

export function ItineraryProvider({ children }) {
  const [places, setPlaces] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(places));
  }, [places]);

  function addPlace(place) {
    setPlaces((prev) => (prev.some((p) => p.id === place.id) ? prev : [...prev, place]));
  }

  function removePlace(id) {
    setPlaces((prev) => prev.filter((p) => p.id !== id));
  }

  function isInItinerary(id) {
    return places.some((p) => p.id === id);
  }

  function clearItinerary() {
    setPlaces([]);
  }

  return (
    <ItineraryContext.Provider
      value={{ places, addPlace, removePlace, isInItinerary, clearItinerary }}
    >
      {children}
    </ItineraryContext.Provider>
  );
}

export function useItinerary() {
  return useContext(ItineraryContext);
}
