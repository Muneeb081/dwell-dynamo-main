
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { AuthUser } from '@/types/auth';

export const useUserProfile = (
  initialUser: AuthUser | null, 
  setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>
) => {
  const { toast } = useToast();

  const addToFavorites = (propertyId: string) => {
    if (!initialUser) return;
    
    const updatedUser = {
      ...initialUser,
      favorites: [...initialUser.favorites, propertyId]
    };
    
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    toast({
      title: "Added to Favorites",
      description: "Property added to your favorites.",
    });
  };

  const removeFromFavorites = (propertyId: string) => {
    if (!initialUser) return;
    
    const updatedUser = {
      ...initialUser,
      favorites: initialUser.favorites.filter(id => id !== propertyId)
    };
    
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    toast({
      title: "Removed from Favorites",
      description: "Property removed from your favorites.",
    });
  };

  const isPropertyFavorite = (propertyId: string): boolean => {
    return initialUser ? initialUser.favorites.includes(propertyId) : false;
  };

  const addSearchQuery = (query: string) => {
    if (!initialUser) return;
    
    const newSearchQuery = {
      query,
      timestamp: new Date().toISOString()
    };
    
    const updatedUser = {
      ...initialUser,
      searchHistory: [newSearchQuery, ...initialUser.searchHistory.slice(0, 9)] // Keep last 10 searches
    };
    
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return {
    addToFavorites,
    removeFromFavorites,
    isPropertyFavorite,
    addSearchQuery
  };
};
