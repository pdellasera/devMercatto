import apiService from './api';
import { Prospect, ProspectFilters, ProspectsResponse, ProspectMetrics } from '../types';

// Mock data for prospects
const mockProspects: Prospect[] = [
  {
    _id: '1',
    name: 'Jhamal Rodriguez',
    sessionID: '5f4b2f9ac8e6d90043a2b4a9',
    position: 'Portero',
    sportPositionID: 1,
    ovrFisico: 62,
    ovrTecnico: 70,
    overCompetencia: 60,
    status: 'Libre',
    age: 22,
    yearOfbirth: 2002,
    birthdayDate: '2002-03-15',
    imgData: 'https://fitwaveimages.s3.us-east-2.amazonaws.com/jhamal.jpeg',
    talla: 1.72,
    resistencia: 34,
    fuerza: 0,
    potencia: 62,
    agilidad: 90,
    velocidad: 88,
    flexibilidad: 53,
    videos: 'https://example.com/video1.mp4',
    fullaccess: false,
    __v: 0
  },
  {
    _id: '2',
    name: 'Carlos Mendoza',
    sessionID: '5f4b2f9ac8e6d90043a2b4aa',
    position: 'Delantero',
    sportPositionID: 4,
    ovrFisico: 78,
    ovrTecnico: 82,
    overCompetencia: 75,
    status: 'Contratado',
    age: 20,
    yearOfbirth: 2004,
    birthdayDate: '2004-07-22',
    imgData: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop&crop=face',
    talla: 1.75,
    resistencia: 65,
    fuerza: 72,
    potencia: 78,
    agilidad: 85,
    velocidad: 92,
    flexibilidad: 68,
    videos: 'https://example.com/video2.mp4',
    fullaccess: true,
    __v: 0
  },
  {
    _id: '3',
    name: 'María González',
    sessionID: '5f4b2f9ac8e6d90043a2b4ab',
    position: 'Centrocampista',
    sportPositionID: 3,
    ovrFisico: 71,
    ovrTecnico: 87,
    overCompetencia: 82,
    status: 'Libre',
    age: 23,
    yearOfbirth: 2001,
    birthdayDate: '2001-11-08',
    imgData: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    talla: 1.68,
    resistencia: 85,
    fuerza: 58,
    potencia: 78,
    agilidad: 88,
    velocidad: 75,
    flexibilidad: 82,
    videos: '',
    fullaccess: false,
    __v: 0
  },
  {
    _id: '4',
    name: 'Diego Silva',
    sessionID: '5f4b2f9ac8e6d90043a2b4ac',
    position: 'Defensa',
    sportPositionID: 2,
    ovrFisico: 85,
    ovrTecnico: 80,
    overCompetencia: 78,
    status: 'Contratado',
    age: 21,
    yearOfbirth: 2003,
    birthdayDate: '2003-05-12',
    imgData: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    talla: 1.85,
    resistencia: 80,
    fuerza: 88,
    potencia: 88,
    agilidad: 72,
    velocidad: 68,
    flexibilidad: 65,
    videos: 'https://example.com/video4.mp4',
    fullaccess: true,
    __v: 0
  },
  {
    _id: '5',
    name: 'Ana Martínez',
    sessionID: '5f4b2f9ac8e6d90043a2b4ad',
    position: 'Portera',
    sportPositionID: 1,
    ovrFisico: 84,
    ovrTecnico: 88,
    overCompetencia: 85,
    status: 'Libre',
    age: 24,
    yearOfbirth: 2000,
    birthdayDate: '2000-09-30',
    imgData: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    talla: 1.72,
    resistencia: 86,
    fuerza: 65,
    potencia: 82,
    agilidad: 78,
    velocidad: 72,
    flexibilidad: 87,
    videos: 'https://example.com/video5.mp4',
    fullaccess: false,
    __v: 0
  },
  {
    _id: '6',
    name: 'Luis Fernández',
    sessionID: '5f4b2f9ac8e6d90043a2b4ae',
    position: 'Delantero',
    sportPositionID: 4,
    ovrFisico: 86,
    ovrTecnico: 85,
    overCompetencia: 81,
    status: 'Libre',
    age: 22,
    yearOfbirth: 2002,
    birthdayDate: '2002-01-18',
    imgData: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    talla: 1.80,
    resistencia: 79,
    fuerza: 87,
    potencia: 87,
    agilidad: 82,
    velocidad: 89,
    flexibilidad: 71,
    videos: '',
    fullaccess: false,
    __v: 0
  }
];

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

      console.log('📡 Raw API response:', response);
      console.log('📊 Response type:', typeof response);
      console.log('📊 Response keys:', Object.keys(response || {}));

      // Check if the response has the expected structure
      console.log('🔍 Checking response.success:', response.sucess);
      if (!response.sucess) {
        console.error('❌ API response error:', response);
        console.error('❌ Response.error:', response.error);
        throw new Error(response.error || 'Failed to fetch prospects from API');
      }
      console.log('✅ API response successful');

      // Extract prospects from the deeply nested structure
      let prospects: Prospect[] = [];
      
      try {
        console.log('🔍 Parsing response.data:', response.data);
        console.log('🔍 response.data type:', typeof response.data);
        console.log('🔍 response.data is array:', Array.isArray(response.data));
        
        // Access the specific path: response.data[0].tableData.atletaList
        if (response.data && 
            Array.isArray(response.data) && 
            response.data.length > 0 &&
            response.data[0].tableData &&
            response.data[0].tableData.atletaList &&
            Array.isArray(response.data[0].tableData.atletaList)) {
          
          prospects = response.data[0].tableData.atletaList;
          console.log('✅ Successfully extracted atletaList from API response');
        } else {
          console.warn('⚠️ Expected data structure not found, trying fallback parsing...');
          console.log('🔍 response.data[0]:', response.data?.[0]);
          console.log('🔍 response.data[0]?.tableData:', response.data?.[0]?.tableData);
          
          // Fallback: try to find atletaList in the response
          const findAtletaList = (obj: any): Prospect[] | null => {
            if (obj && typeof obj === 'object') {
              if (obj.atletaList && Array.isArray(obj.atletaList)) {
                return obj.atletaList;
              }
              for (const key in obj) {
                const result = findAtletaList(obj[key]);
                if (result) return result;
              }
            }
            return null;
          };
          
          const fallbackProspects = findAtletaList(response);
          if (fallbackProspects) {
            prospects = fallbackProspects;
            console.log('✅ Found prospects using fallback parsing');
          } else {
            console.error('❌ Could not find atletaList in response structure');
            console.error('❌ Full response structure:', JSON.stringify(response, null, 2));
            throw new Error('Invalid response structure: atletaList not found');
          }
        }
      } catch (parseError) {
        console.error('Error parsing API response:', parseError);
        throw new Error('Failed to parse prospects data from API response');
      }

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
      return this.getMockProspects(filters);
    }
  }

  // Fallback method for mock data
  private getMockProspects(filters?: ProspectFilters): ProspectsResponse {
    try {
      console.log('Using mock data with filters:', filters);

      let filteredProspects = [...mockProspects];

      if (filters) {
        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
          filteredProspects = filteredProspects.filter(prospect =>
            prospect.name.toLowerCase().includes(searchTerm) ||
            prospect.position.toLowerCase().includes(searchTerm) ||
            prospect.status.toLowerCase().includes(searchTerm)
          );
        }

        if (filters.position) {
          filteredProspects = filteredProspects.filter(prospect =>
            prospect.position === filters.position
          );
        }

        if (filters.status) {
          filteredProspects = filteredProspects.filter(prospect =>
            prospect.status === filters.status
          );
        }

        if (filters.minAge) {
          filteredProspects = filteredProspects.filter(prospect =>
            prospect.age >= filters.minAge!
          );
        }

        if (filters.maxAge) {
          filteredProspects = filteredProspects.filter(prospect =>
            prospect.age <= filters.maxAge!
          );
        }

        if (filters.minRating) {
          filteredProspects = filteredProspects.filter(prospect =>
            prospect.ovrTecnico >= filters.minRating!
          );
        }

        if (filters.maxRating) {
          filteredProspects = filteredProspects.filter(prospect =>
            prospect.ovrTecnico <= filters.maxRating!
          );
        }
      }

      console.log('After filtering prospects count:', filteredProspects.length);

      // Apply pagination - show 10 prospects per page by default
      const page = filters?.page || 1;
      const limit = filters?.limit || 10; // Show 10 prospects per page
      
      // If limit is 0 or negative, show all prospects without pagination
      let paginatedProspects: Prospect[];
      if (limit <= 0) {
        paginatedProspects = filteredProspects;
        console.log('Showing all prospects without pagination:', filteredProspects.length);
      } else {
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        paginatedProspects = filteredProspects.slice(startIndex, endIndex);
        console.log('Pagination:', { page, limit, startIndex, endIndex, paginatedCount: paginatedProspects.length, totalProspects: filteredProspects.length });
      }

      const result = {
        data: paginatedProspects,
        pagination: {
          page,
          limit,
          total: filteredProspects.length,
          totalPages: Math.ceil(filteredProspects.length / limit),
        },
      };

      console.log('Returning mock result:', result);
      return result;
    } catch (error) {
      console.error('Error in getMockProspects:', error);
      throw new Error('Failed to fetch prospects');
    }
  }

  async getProspectById(id: string): Promise<Prospect> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));

      const prospect = mockProspects.find(p => p._id === id);
      if (!prospect) {
        throw new Error('Prospect not found');
      }
      return prospect;
    } catch (error) {
      throw new Error('Failed to fetch prospect');
    }
  }

  async createProspect(prospectData: Omit<Prospect, '_id' | 'createdAt' | 'updatedAt'>): Promise<Prospect> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const newProspect: Prospect = {
        ...prospectData,
        _id: (Math.max(...mockProspects.map(p => parseInt(p._id || '0', 10))).toString() + 1).toString(),
      };

      mockProspects.push(newProspect);
      return newProspect;
    } catch (error) {
      throw new Error('Failed to create prospect');
    }
  }

  async updateProspect(id: string, prospectData: Partial<Prospect>): Promise<Prospect> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 400));

      const index = mockProspects.findIndex(p => p._id === id);
      if (index === -1) {
        throw new Error('Prospect not found');
      }

      mockProspects[index] = { ...mockProspects[index], ...prospectData };
      return mockProspects[index];
    } catch (error) {
      throw new Error('Failed to update prospect');
    }
  }

  async deleteProspect(id: string): Promise<void> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      const index = mockProspects.findIndex(p => p._id === id);
      if (index === -1) {
        throw new Error('Prospect not found');
      }

      mockProspects.splice(index, 1);
    } catch (error) {
      throw new Error('Failed to delete prospect');
    }
  }

  async getMetrics(): Promise<ProspectMetrics> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));

      const total = mockProspects.length;
      const active = mockProspects.filter(p => p.status === 'Contratado').length;
      const withVideos = mockProspects.filter(p => p.videos).length;
      const averageRating = mockProspects.reduce((sum, p) => sum + p.ovrTecnico, 0) / total;
      const topRated = mockProspects.filter(p => p.ovrTecnico >= 85).length;
      const recentAdditions = mockProspects.filter(p => p.age <= 22).length; // Simplified logic

      return {
        total,
        active,
        withVideos,
        averageRating: Math.round(averageRating * 10) / 10,
        topRated,
        recentAdditions,
      };
    } catch (error) {
      throw new Error('Failed to fetch metrics');
    }
  }

  async uploadVideo(id: string, videoFile: File): Promise<{ videoUrl: string; thumbnailUrl: string }> {
    try {
      const formData = new FormData();
      formData.append('video', videoFile);

      const response = await apiService.post<{ videoUrl: string; thumbnailUrl: string }>(
        `/prospects/${id}/video`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.sucess && response.data) {
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to upload video');
      }
    } catch (error) {
      throw error;
    }
  }

  async updateRating(id: string, ratings: {
    ovrFisico?: number;
    ovrTecnico?: number;
    overCompetencia?: number;
  }): Promise<Prospect> {
    try {
      const response = await apiService.patch<Prospect>(`/prospects/${id}/ratings`, ratings);

      if (response.sucess && response.data) {
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to update ratings');
      }
    } catch (error) {
      throw error;
    }
  }

  async updateStatus(id: string, status: Prospect['status']): Promise<Prospect> {
    try {
      const response = await apiService.patch<Prospect>(`/prospects/${id}/status`, { status });

      if (response.sucess && response.data) {
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to update status');
      }
    } catch (error) {
      throw error;
    }
  }

  async addNotes(id: string, notes: string): Promise<Prospect> {
    try {
      const response = await apiService.patch<Prospect>(`/prospects/${id}/notes`, { notes });

      if (response.sucess && response.data) {
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to add notes');
      }
    } catch (error) {
      throw error;
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
