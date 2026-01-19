export interface ConfirmacionAsistencia {
  id?: number;
  nombre_completo: string;
  correo_electronico: string;
  telefono?: string | null;
  asistira: boolean;
  numero_invitados: number;
  cancion_favorita?: string | null;
  mensaje?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface ModelResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}