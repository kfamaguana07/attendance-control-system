export interface LoginDTO {
  username: string;
  password: string;
}

export interface LoginResponseDTO {
  user: {
    id: string;
    username: string;
    email?: string;
    role?: string;
  };
  success: boolean;
  message?: string;
}
