import { useState, useEffect, useCallback } from 'react';
import prospectsService from '../services/prospects.service';
import { Prospect, ProspectFilters, ProspectsResponse, ProspectMetrics } from '../types';

interface UseProspectsState {
  prospects: Prospect[];
  metrics: ProspectMetrics | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  loading: boolean;
  error: string | null;
  filters: ProspectFilters;
}

export const useProspects = () => {
  const [state, setState] = useState<UseProspectsState>({
    prospects: [],
    metrics: null,
    pagination: {
      page: 1,
      limit: 10, // Show 10 prospects per page
      total: 0,
      totalPages: 0,
    },
    loading: false,
    error: null,
    filters: {
      page: 1,
      limit: 10, // Show 10 prospects per page
    },
  });

  const fetchProspects = useCallback(async (newFilters?: Partial<ProspectFilters>) => {
    try {
      console.log('fetchProspects called with filters:', newFilters);
      setState(prev => ({ ...prev, loading: true, error: null }));

      const effectiveFilters = newFilters ? { ...state.filters, ...newFilters } : state.filters;
      console.log('Using filters:', effectiveFilters);
      
      const response: ProspectsResponse = await prospectsService.getProspects(effectiveFilters);
      console.log('Prospects response:', response);

      setState(prev => ({
        ...prev,
        prospects: response.data || [],
        pagination: response.pagination || {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        },
        // No modificar filters aquí para evitar bucles; filters se cambia solo con setFilters/setPage
        loading: false,
      }));
    } catch (error) {
      console.error('Error fetching prospects:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch prospects';
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage 
      }));
    }
  }, [state.filters]);

  const fetchMetrics = useCallback(async () => {
    try {
      const metrics = await prospectsService.getMetrics();
      setState(prev => ({ ...prev, metrics }));
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
    }
  }, []);

  const fetchProspectById = useCallback(async (id: string): Promise<Prospect | null> => {
    try {
      const prospect = await prospectsService.getProspectById(id);
      return prospect;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch prospect';
      setState(prev => ({ ...prev, error: errorMessage }));
      return null;
    }
  }, []);

  const createProspect = useCallback(async (prospectData: Omit<Prospect, '_id' | '__v'>) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const newProspect = await prospectsService.createProspect(prospectData as any);

      setState(prev => ({
        ...prev,
        prospects: [newProspect, ...prev.prospects],
        loading: false,
      }));

      // Refresh metrics after creating new prospect
      await fetchMetrics();

      return newProspect;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create prospect';
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage 
      }));
      throw error;
    }
  }, [fetchMetrics]);

  const updateProspect = useCallback(async (id: string, prospectData: Partial<Prospect>) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const updatedProspect = await prospectsService.updateProspect(id, prospectData);

      setState(prev => ({
        ...prev,
        prospects: prev.prospects.map(prospect => 
          prospect._id === id ? updatedProspect : prospect
        ),
        loading: false,
      }));

      return updatedProspect;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update prospect';
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage 
      }));
      throw error;
    }
  }, []);

  const deleteProspect = useCallback(async (id: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      await prospectsService.deleteProspect(id);

      setState(prev => ({
        ...prev,
        prospects: prev.prospects.filter(prospect => prospect._id !== id),
        loading: false,
      }));

      // Refresh metrics after deleting prospect
      await fetchMetrics();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete prospect';
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage 
      }));
      throw error;
    }
  }, [fetchMetrics]);

  const updateRating = useCallback(async (id: string, ratings: {
    ovrFisico?: number;
    ovrTecnico?: number;
    overCompetencia?: number;
  }) => {
    try {
      const updatedProspect = await prospectsService.updateRating(id, ratings);

      setState(prev => ({
        ...prev,
        prospects: prev.prospects.map(prospect => 
          prospect._id === id ? updatedProspect : prospect
        ),
      }));

      return updatedProspect;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update rating';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    }
  }, []);

  const updateStatus = useCallback(async (id: string, status: Prospect['status']) => {
    try {
      const updatedProspect = await prospectsService.updateStatus(id, status);

      setState(prev => ({
        ...prev,
        prospects: prev.prospects.map(prospect => 
          prospect._id === id ? updatedProspect : prospect
        ),
      }));

      return updatedProspect;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update status';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    }
  }, []);

  const addNotes = useCallback(async (id: string, notes: string) => {
    try {
      const updatedProspect = await prospectsService.addNotes(id, notes);

      setState(prev => ({
        ...prev,
        prospects: prev.prospects.map(prospect => 
          prospect._id === id ? updatedProspect : prospect
        ),
      }));

      return updatedProspect;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add notes';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    }
  }, []);

  const uploadVideo = useCallback(async (id: string, videoFile: File) => {
    try {
      const result = await prospectsService.uploadVideo(id, videoFile);

      setState(prev => ({
        ...prev,
        prospects: prev.prospects.map(prospect => 
          prospect._id === id 
            ? { ...prospect, videos: result.videoUrl }
            : prospect
        ),
      }));

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload video';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    }
  }, []);

  const setFilters = useCallback((newFilters: Partial<ProspectFilters>) => {
    setState(prev => ({ 
      ...prev, 
      filters: { ...prev.filters, ...newFilters, page: 1 } 
    }));
  }, []);

  const setPage = useCallback((page: number) => {
    setState(prev => ({ 
      ...prev, 
      filters: { ...prev.filters, page } 
    }));
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Load initial data
  useEffect(() => {
    console.log('Initial useEffect - fetching prospects and metrics');
    fetchProspects();
    fetchMetrics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Refetch when filters change (always fetch on any filter/page change)
  useEffect(() => {
    console.log('Filters changed, refetching prospects:', state.filters);
    fetchProspects();
  }, [state.filters, fetchProspects]);

  return {
    ...state,
    fetchProspects,
    fetchMetrics,
    fetchProspectById,
    createProspect,
    updateProspect,
    deleteProspect,
    updateRating,
    updateStatus,
    addNotes,
    uploadVideo,
    setFilters,
    setPage,
    clearError,
  };
};
