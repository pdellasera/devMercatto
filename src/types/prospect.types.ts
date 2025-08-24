export interface Prospect {
  _id?: string;
  name: string;
  sessionID: string;
  position: string;
  sportPositionID: number;
  ovrFisico: number;
  ovrTecnico: number;
  overCompetencia: number;
  ovrGeneral: number;
  status: string;
  age: number;
  yearOfbirth: number;
  birthdayDate: string;
  imgData: string;
  talla: number;
  resistencia: number;
  fuerza: number;
  potencia: number;
  agilidad: number;
  velocidad: number;
  flexibilidad: number;
  videos: string;
  fullaccess: boolean;
  __v: number;
}

export interface ProspectFilters {
  search?: string;
  position?: string;
  status?: string;
  minAge?: number;
  maxAge?: number;
  minRating?: number;
  maxRating?: number;
  page?: number;
  limit?: number;
}

export interface ProspectMetrics {
  total: number;
  active: number;
  withVideos: number;
  averageRating: number;
  topRated: number;
  recentAdditions: number;
}

export interface ProspectsResponse {
  data: Prospect[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
