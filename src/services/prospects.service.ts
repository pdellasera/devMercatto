import apiService from './api';
import { Prospect, ProspectFilters, ProspectsResponse, ProspectMetrics } from '../types';

class ProspectsService {
  async getProspects(filters?: ProspectFilters): Promise<ProspectsResponse> {
    try {
      console.log('🔍 Fetching prospects with filters:', filters);
      console.log('🌐 API URL:', 'https://mercatto.app/v1/api/main/home');

      // Call the new API endpoint
      const response = await apiService.post<any>(
        '/main/home',
        {
          "isMemberShip": true,
          "isType": false
        }
      ) as any;

      // Check if the response has the expected structure
      console.log('🔍 Checking response.success:', response.sucess);
      if (!response.sucess) {
        throw new Error(response.error || 'Failed to fetch prospects from API');
      }
      console.log('✅ API response successful');

      // Extract prospects from the deeply nested structure
      let prospects: Prospect[] = [];
      let atletaList: any[] = Array.isArray(response.data) ? response.data[0].tableData.atletaList : [];


      prospects = atletaList
      console.log('Extracted prospects from API:', prospects.length);
      console.log('First prospect sample:', prospects[0]);

      // Apply filters if provided
      if (filters) {
        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
          prospects = prospects.filter(prospect =>
            prospect.name.toLowerCase().includes(searchTerm) ||
            prospect.position.toLowerCase().includes(searchTerm) ||
            prospect.status.toLowerCase().includes(searchTerm)
          );
        }

        if (filters.position) {
          prospects = prospects.filter(prospect =>
            prospect.position === filters.position
          );
        }

        if (filters.status) {
          prospects = prospects.filter(prospect =>
            prospect.status === filters.status
          );
        }

        if (filters.minAge) {
          prospects = prospects.filter(prospect =>
            prospect.age >= filters.minAge!
          );
        }

        if (filters.maxAge) {
          prospects = prospects.filter(prospect =>
            prospect.age <= filters.maxAge!
          );
        }

        if (filters.minRating) {
          prospects = prospects.filter(prospect =>
            prospect.ovrTecnico >= filters.minRating!
          );
        }

        if (filters.maxRating) {
          prospects = prospects.filter(prospect =>
            prospect.ovrTecnico <= filters.maxRating!
          );
        }
      }

      console.log('After filtering prospects count:', prospects.length);

      // Apply pagination - show 10 prospects per page by default
      const page = filters?.page || 1;
      const limit = filters?.limit || 10; // Show 10 prospects per page

      // If limit is 0 or negative, show all prospects without pagination
      let paginatedProspects: Prospect[];
      if (limit <= 0) {
        paginatedProspects = prospects;
        console.log('Showing all prospects without pagination:', prospects.length);
      } else {
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        paginatedProspects = prospects.slice(startIndex, endIndex);
        console.log('Pagination:', { page, limit, startIndex, endIndex, paginatedCount: paginatedProspects.length, totalProspects: prospects.length });
      }

      const result = {
        data: paginatedProspects,
        pagination: {
          page,
          limit,
          total: prospects.length,
          totalPages: Math.ceil(prospects.length / limit),
        },
      };

      console.log('Returning result:', result);
      return result;
    } catch (error) {
      console.error('❌ Error in getProspects:', error);
      console.error('❌ Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace'
      });

      // Fallback to mock data if API fails
      console.log('🔄 Falling back to mock data due to API error');
      const result = {
        data: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0
        },
      };
      return result;
    }
  }


  async getProspectById(id: string): Promise<Prospect> {
    try {
      // For now, return a mock prospect since we don't have individual prospect API
      const mockProspect: Prospect = {
        _id: id,
        name: 'Jugador Ejemplo',
        sessionID: 'example-session',
        position: 'Delantero',
        sportPositionID: 4,
        ovrFisico: 75,
        ovrTecnico: 80,
        overCompetencia: 78,
        ovrGeneral: 78,
        status: 'Libre',
        age: 22,
        yearOfbirth: 2002,
        birthdayDate: '2002-03-15',
        imgData: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop&crop=face',
        talla: 1.75,
        resistencia: 70,
        fuerza: 75,
        potencia: 80,
        agilidad: 85,
        velocidad: 88,
        flexibilidad: 72,
        videos: 'https://example.com/video.mp4',
        fullaccess: false,
        __v: 0
      };
      return mockProspect;
    } catch (error) {
      throw new Error('Failed to fetch prospect');
    }
  }

  async createProspect(prospectData: Omit<Prospect, '_id' | '__v'>): Promise<Prospect> {
    try {
      // For now, return a mock prospect since we don't have create prospect API
      const newProspect: Prospect = {
        ...prospectData,
        _id: Date.now().toString(),
        __v: 0
      };
      return newProspect;
    } catch (error) {
      throw new Error('Failed to create prospect');
    }
  }

  async updateProspect(id: string, prospectData: Partial<Prospect>): Promise<Prospect> {
    try {
      // For now, return a mock updated prospect since we don't have update prospect API
      const updatedProspect: Prospect = {
        _id: id,
        name: 'Jugador Actualizado',
        sessionID: 'updated-session',
        position: 'Delantero',
        sportPositionID: 4,
        ovrFisico: 75,
        ovrTecnico: 80,
        overCompetencia: 78,
        ovrGeneral: 78,
        status: 'Libre',
        age: 22,
        yearOfbirth: 2002,
        birthdayDate: '2002-03-15',
        imgData: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop&crop=face',
        talla: 1.75,
        resistencia: 70,
        fuerza: 75,
        potencia: 80,
        agilidad: 85,
        velocidad: 88,
        flexibilidad: 72,
        videos: 'https://example.com/video.mp4',
        fullaccess: false,
        __v: 0,
        ...prospectData
      };
      return updatedProspect;
    } catch (error) {
      throw new Error('Failed to update prospect');
    }
  }

  async deleteProspect(id: string): Promise<void> {
    try {
      // For now, just simulate success since we don't have delete prospect API
      console.log('Deleting prospect with ID:', id);
      // In a real implementation, this would call the API to delete the prospect
    } catch (error) {
      throw new Error('Failed to delete prospect');
    }
  }

  async getMetrics(): Promise<ProspectMetrics> {
    try {
      // For now, return mock metrics since we don't have metrics API
      return {
        total: 534, // This should come from the API response
        active: 150,
        withVideos: 200,
        averageRating: 75.5,
        topRated: 50,
        recentAdditions: 100,
      };
    } catch (error) {
      throw new Error('Failed to fetch metrics');
    }
  }

  async uploadVideo(id: string, videoFile: File): Promise<{ videoUrl: string; thumbnailUrl: string }> {
    try {
      // For now, return mock video URLs since we don't have upload video API
      console.log('Uploading video for prospect ID:', id, 'File:', videoFile.name);
      return {
        videoUrl: 'https://example.com/video.mp4',
        thumbnailUrl: 'https://example.com/thumbnail.jpg'
      };
    } catch (error) {
      throw new Error('Failed to upload video');
    }
  }

  async updateRating(id: string, ratings: {
    ovrFisico?: number;
    ovrTecnico?: number;
    overCompetencia?: number;
  }): Promise<Prospect> {
    try {
      // For now, return a mock updated prospect since we don't have update ratings API
      const updatedProspect: Prospect = {
        _id: id,
        name: 'Jugador con Ratings Actualizados',
        sessionID: 'ratings-session',
        position: 'Delantero',
        sportPositionID: 4,
        ovrFisico: ratings.ovrFisico || 75,
        ovrTecnico: ratings.ovrTecnico || 80,
        overCompetencia: ratings.overCompetencia || 78,
        ovrGeneral: Math.round(((ratings.ovrFisico || 75) + (ratings.ovrTecnico || 80) + (ratings.overCompetencia || 78)) / 3),
        status: 'Libre',
        age: 22,
        yearOfbirth: 2002,
        birthdayDate: '2002-03-15',
        imgData: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop&crop=face',
        talla: 1.75,
        resistencia: 70,
        fuerza: 75,
        potencia: 80,
        agilidad: 85,
        velocidad: 88,
        flexibilidad: 72,
        videos: 'https://example.com/video.mp4',
        fullaccess: false,
        __v: 0
      };
      return updatedProspect;
    } catch (error) {
      throw new Error('Failed to update ratings');
    }
  }

  async updateStatus(id: string, status: Prospect['status']): Promise<Prospect> {
    try {
      // For now, return a mock updated prospect since we don't have update status API
      const updatedProspect: Prospect = {
        _id: id,
        name: 'Jugador Actualizado',
        sessionID: 'updated-session',
        position: 'Delantero',
        sportPositionID: 4,
        ovrFisico: 75,
        ovrTecnico: 80,
        overCompetencia: 78,
        ovrGeneral: 78,
        status: status,
        age: 22,
        yearOfbirth: 2002,
        birthdayDate: '2002-03-15',
        imgData: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop&crop=face',
        talla: 1.75,
        resistencia: 70,
        fuerza: 75,
        potencia: 80,
        agilidad: 85,
        velocidad: 88,
        flexibilidad: 72,
        videos: 'https://example.com/video.mp4',
        fullaccess: false,
        __v: 0
      };
      return updatedProspect;
    } catch (error) {
      throw new Error('Failed to update status');
    }
  }

  async addNotes(id: string, notes: string): Promise<Prospect> {
    try {
      // For now, return a mock updated prospect since we don't have add notes API
      const updatedProspect: Prospect = {
        _id: id,
        name: 'Jugador con Notas',
        sessionID: 'notes-session',
        position: 'Delantero',
        sportPositionID: 4,
        ovrFisico: 75,
        ovrTecnico: 80,
        overCompetencia: 78,
        ovrGeneral: 78,
        status: 'Libre',
        age: 22,
        yearOfbirth: 2002,
        birthdayDate: '2002-03-15',
        imgData: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop&crop=face',
        talla: 1.75,
        resistencia: 70,
        fuerza: 75,
        potencia: 80,
        agilidad: 85,
        velocidad: 88,
        flexibilidad: 72,
        videos: 'https://example.com/video.mp4',
        fullaccess: false,
        __v: 0
      };
      return updatedProspect;
    } catch (error) {
      throw new Error('Failed to add notes');
    }
  }

  // Utility methods for filtering and sorting
  getPositions(): string[] {
    return [
      'Goalkeeper',
      'Defender',
      'Midfielder',
      'Forward',
      'Winger',
      'Striker',
      'Center Back',
      'Full Back',
      'Defensive Midfielder',
      'Attacking Midfielder',
      'Center Forward',
    ];
  }

  getStatuses(): Array<{ value: Prospect['status']; label: string }> {
    return [
      { value: 'Contratado', label: 'Contratado' },
      { value: 'Libre', label: 'Libre' },
      { value: 'Observado', label: 'Observado' },
      { value: 'Pendiente', label: 'Pendiente' },
    ];
  }

  getNationalities(): string[] {
    return [
      'Argentina', 'Brazil', 'Spain', 'Germany', 'France', 'England', 'Italy',
      'Portugal', 'Netherlands', 'Belgium', 'Croatia', 'Uruguay', 'Colombia',
      'Mexico', 'United States', 'Canada', 'Japan', 'South Korea', 'Australia',
      'Morocco', 'Senegal', 'Nigeria', 'Ghana', 'Egypt', 'Tunisia',
    ];
  }

  // Method to get all prospects without pagination
  async getAllProspects(filters?: Omit<ProspectFilters, 'page' | 'limit'>): Promise<Prospect[]> {
    try {
      console.log('Fetching all prospects without pagination');

      const allFilters = { ...filters, limit: 0 }; // Set limit to 0 to disable pagination
      const response = await this.getProspects(allFilters);

      console.log('All prospects fetched:', response.data.length);
      return response.data;
    } catch (error) {
      console.error('Error fetching all prospects:', error);
      throw error;
    }
  }

  // Test method to verify API connectivity
  async testApiConnection(): Promise<any> {
    try {
      console.log('Testing API connection...');

      const response = await apiService.post<any>(
        '/campaigns/GetCampaingData',
        {
          token: "U2FsdGVkX1/yP/FA+FcHqECz/wGGtLUiDGpOkO2Es/q/K5HnBzr5peiyIL9feqVPfMSNdfzUOba4fJsWybUKQKv1wEki8bQj6/zHHRR5lC7ra1OvdH6TAsx5o/oGPuQnpiM1kOW0slHGgeaKWPp0iLosT67ux9C/I9KBM0Xl10SqDBSX/8mslJi7s5EPoDL5YfzqNp5ZhjqCsEL1N//9kg=="
        }
      );

      console.log('API Test Response:', response);
      return response;
    } catch (error) {
      console.error('API Test Error:', error);
      throw error;
    }
  }
}

export const prospectsService = new ProspectsService();
export default prospectsService;
