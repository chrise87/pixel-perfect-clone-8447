/**
 * User Preferences Hook
 * 
 * DEVELOPER NOTES FOR INTEGRATION:
 * - Currently uses localStorage for persistence
 * - Replace with API calls to user settings endpoint
 * - Store preferences per user in your database
 */

import { useState, useEffect, useCallback } from 'react';

export type ViewDensity = 'compact' | 'comfortable';

interface UserPreferences {
  // Pinned items (project IDs, document IDs, etc.)
  pinnedProjects: number[];
  pinnedDocuments: string[];
  
  // Collapsed sections on dashboard
  collapsedSections: string[];
  
  // View density
  viewDensity: ViewDensity;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  pinnedProjects: [],
  pinnedDocuments: [],
  collapsedSections: [],
  viewDensity: 'comfortable',
};

const STORAGE_KEY = 'nomon_user_preferences';

export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) } : DEFAULT_PREFERENCES;
    } catch {
      return DEFAULT_PREFERENCES;
    }
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  }, [preferences]);

  // Pin/Unpin project
  const togglePinProject = useCallback((projectId: number) => {
    setPreferences(prev => ({
      ...prev,
      pinnedProjects: prev.pinnedProjects.includes(projectId)
        ? prev.pinnedProjects.filter(id => id !== projectId)
        : [...prev.pinnedProjects, projectId]
    }));
  }, []);

  // Pin/Unpin document
  const togglePinDocument = useCallback((docId: string) => {
    setPreferences(prev => ({
      ...prev,
      pinnedDocuments: prev.pinnedDocuments.includes(docId)
        ? prev.pinnedDocuments.filter(id => id !== docId)
        : [...prev.pinnedDocuments, docId]
    }));
  }, []);

  // Toggle section collapse
  const toggleSection = useCallback((sectionId: string) => {
    setPreferences(prev => ({
      ...prev,
      collapsedSections: prev.collapsedSections.includes(sectionId)
        ? prev.collapsedSections.filter(id => id !== sectionId)
        : [...prev.collapsedSections, sectionId]
    }));
  }, []);

  // Check if section is collapsed
  const isSectionCollapsed = useCallback((sectionId: string) => {
    return preferences.collapsedSections.includes(sectionId);
  }, [preferences.collapsedSections]);

  // Set view density
  const setViewDensity = useCallback((density: ViewDensity) => {
    setPreferences(prev => ({ ...prev, viewDensity: density }));
  }, []);

  // Check if project is pinned
  const isProjectPinned = useCallback((projectId: number) => {
    return preferences.pinnedProjects.includes(projectId);
  }, [preferences.pinnedProjects]);

  return {
    preferences,
    togglePinProject,
    togglePinDocument,
    toggleSection,
    isSectionCollapsed,
    setViewDensity,
    isProjectPinned,
  };
}
