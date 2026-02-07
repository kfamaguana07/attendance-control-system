export interface LoginDTO {
  ci: string;
  clave: string;
}

export interface LoginResponseDTO {
  success: boolean;
  token: string;
  user: {
    ci: string;
    nombres: string;
    apellidos: string;
    correo: string;
    nombreCompleto?: string;
  };
  role?: string;
  message?: string;
}
