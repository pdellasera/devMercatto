import { http, HttpResponse } from 'msw';

// Mock data for prospects
const mockProspects = [
  {
    id: 1,
    firstName: 'Carlos',
    lastName: 'Rodríguez',
    email: 'carlos.rodriguez@email.com',
    position: 'Delantero',
    birthYear: 2002,
    nationality: 'España',
    overallRating: 87,
    technicalRating: 85,
    physicalRating: 88,
    tacticalRating: 86,
    mentalRating: 89,
    status: 'activo',
    thumbnailUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop&crop=face',
    videoUrl: 'https://example.com/video1.mp4',
    createdAt: '2024-01-15T10:30:00Z',
    notes: 'Excelente velocidad y definición. Potencial para jugar en primera división.',
    club: 'Real Madrid Juvenil',
    height: 175,
    weight: 70,
    preferredFoot: 'Derecho',
    contractExpiry: '2025-06-30',
    marketValue: 2500000,
    agent: 'Jorge Mendes',
    phone: '+34 600 123 456'
  },
  {
    id: 2,
    firstName: 'María',
    lastName: 'González',
    email: 'maria.gonzalez@email.com',
    position: 'Centrocampista',
    birthYear: 2001,
    nationality: 'Argentina',
    overallRating: 84,
    technicalRating: 87,
    physicalRating: 82,
    tacticalRating: 89,
    mentalRating: 85,
    status: 'activo',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    videoUrl: 'https://example.com/video2.mp4',
    createdAt: '2024-01-20T14:15:00Z',
    notes: 'Gran visión de juego y control del balón. Líder natural en el campo.',
    club: 'Boca Juniors',
    height: 168,
    weight: 58,
    preferredFoot: 'Izquierdo',
    contractExpiry: '2024-12-31',
    marketValue: 1800000,
    agent: 'Pablo Sabbag',
    phone: '+54 911 234 567'
  },
  {
    id: 3,
    firstName: 'Diego',
    lastName: 'Silva',
    email: 'diego.silva@email.com',
    position: 'Defensa',
    birthYear: 2003,
    nationality: 'Brasil',
    overallRating: 82,
    technicalRating: 80,
    physicalRating: 85,
    tacticalRating: 84,
    mentalRating: 83,
    status: 'pendiente',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    videoUrl: null,
    createdAt: '2024-02-01T09:45:00Z',
    notes: 'Defensa sólido con buen juego aéreo. Necesita mejorar la salida de balón.',
    club: 'Flamengo',
    height: 185,
    weight: 78,
    preferredFoot: 'Derecho',
    contractExpiry: '2026-06-30',
    marketValue: 1200000,
    agent: 'Carlos Leite',
    phone: '+55 21 987 654 321'
  },
  {
    id: 4,
    firstName: 'Ana',
    lastName: 'Martínez',
    email: 'ana.martinez@email.com',
    position: 'Portera',
    birthYear: 2000,
    nationality: 'México',
    overallRating: 86,
    technicalRating: 88,
    physicalRating: 84,
    tacticalRating: 85,
    mentalRating: 87,
    status: 'observado',
    thumbnailUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    videoUrl: 'https://example.com/video4.mp4',
    createdAt: '2024-01-10T16:20:00Z',
    notes: 'Excelente reflejos y posicionamiento. Potencial para selección nacional.',
    club: 'América',
    height: 172,
    weight: 65,
    preferredFoot: 'Derecho',
    contractExpiry: '2025-12-31',
    marketValue: 2200000,
    agent: 'Ricardo Peláez',
    phone: '+52 55 1234 5678'
  },
  {
    id: 5,
    firstName: 'Luis',
    lastName: 'Fernández',
    email: 'luis.fernandez@email.com',
    position: 'Delantero',
    birthYear: 2002,
    nationality: 'Colombia',
    overallRating: 83,
    technicalRating: 85,
    physicalRating: 86,
    tacticalRating: 81,
    mentalRating: 82,
    status: 'activo',
    thumbnailUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    videoUrl: 'https://example.com/video5.mp4',
    createdAt: '2024-01-25T11:30:00Z',
    notes: 'Goleador nato con gran instinto. Necesita mejorar el trabajo defensivo.',
    club: 'Atlético Nacional',
    height: 180,
    weight: 75,
    preferredFoot: 'Derecho',
    contractExpiry: '2024-12-31',
    marketValue: 1600000,
    agent: 'Jorge Bermúdez',
    phone: '+57 300 987 654'
  },
  {
    id: 6,
    firstName: 'Sofía',
    lastName: 'López',
    email: 'sofia.lopez@email.com',
    position: 'Centrocampista',
    birthYear: 2001,
    nationality: 'Chile',
    overallRating: 81,
    technicalRating: 83,
    physicalRating: 79,
    tacticalRating: 86,
    mentalRating: 84,
    status: 'activo',
    thumbnailUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    videoUrl: null,
    createdAt: '2024-02-05T13:45:00Z',
    notes: 'Centrocampista técnica con buen toque de balón. Futura líder del equipo.',
    club: 'Colo-Colo',
    height: 165,
    weight: 55,
    preferredFoot: 'Izquierdo',
    contractExpiry: '2025-06-30',
    marketValue: 1400000,
    agent: 'Fernando Astengo',
    phone: '+56 9 8765 4321'
  }
];

export const handlers = [
  // Auth endpoints
  http.post('/api/auth/login', () => {
    return HttpResponse.json({
      user: {
        id: 1,
        email: 'test@example.com',
        firstName: 'Usuario',
        lastName: 'Test',
        role: 'scout',
      },
      token: 'mock-jwt-token',
    });
  }),

  // Prospects endpoints
  http.get('/api/prospects', () => {
    return HttpResponse.json({
      data: mockProspects,
      pagination: {
        page: 1,
        limit: 10,
        total: mockProspects.length,
        totalPages: 1,
      },
    });
  }),

  http.get('/api/prospects/:id', ({ params }) => {
    const prospect = mockProspects.find(p => p.id === Number(params.id));
    if (!prospect) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(prospect);
  }),

  // Metrics endpoint
  http.get('/api/prospects/metrics', () => {
    const total = mockProspects.length;
    const active = mockProspects.filter(p => p.status === 'activo').length;
    const withVideos = mockProspects.filter(p => p.videoUrl).length;
    const averageRating = mockProspects.reduce((sum, p) => sum + p.overallRating, 0) / total;
    const topRated = mockProspects.filter(p => p.overallRating >= 85).length;
    const recentAdditions = mockProspects.filter(p => {
      const createdAt = new Date(p.createdAt);
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      return createdAt > oneMonthAgo;
    }).length;

    return HttpResponse.json({
      total,
      active,
      withVideos,
      averageRating: Math.round(averageRating * 10) / 10,
      topRated,
      recentAdditions,
    });
  }),

  // Tryouts endpoints
  http.get('/api/tryouts', () => {
    return HttpResponse.json({
      data: [
        {
          id: 1,
          name: 'Pruebas de Primavera 2024',
          startDate: '2024-03-15',
          endDate: '2024-03-17',
          location: 'Estadio Principal',
          status: 'próximo',
        },
      ],
      pagination: {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
      },
    });
  }),
];
