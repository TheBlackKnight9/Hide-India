'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const SavedContext = createContext();

export const SavedProvider = ({ children }) => {
  const [savedPlaces, setSavedPlaces] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const local = localStorage.getItem('hide_rajasthan_saved') || localStorage.getItem('hide_india_saved');
      if (local) setSavedPlaces(JSON.parse(local));
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem('hide_rajasthan_saved', JSON.stringify(savedPlaces));
      } catch (e) {
        console.error('Error saving to localStorage:', e);
      }
    }
  }, [savedPlaces, mounted]);

  const toggleSave = (place) => {
    setSavedPlaces((prev) => {
      const exists = prev.find((p) => p.id === place.id);
      if (exists) {
        return prev.filter((p) => p.id !== place.id);
      } else {
        return [...prev, place];
      }
    });
  };

  const isSaved = (placeId) => {
    return savedPlaces.some((p) => p.id === placeId);
  };

  const removeSaved = (placeId) => {
    setSavedPlaces((prev) => prev.filter((p) => p.id !== placeId));
  };

  return (
    <SavedContext.Provider value={{ savedPlaces, toggleSave, isSaved, removeSaved }}>
      {children}
    </SavedContext.Provider>
  );
};

export const useSaved = () => useContext(SavedContext);
