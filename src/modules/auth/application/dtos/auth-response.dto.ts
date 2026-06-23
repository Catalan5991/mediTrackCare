// Respuesta publica de autenticacion: token de acceso mas datos seguros del usuario.
export type AuthResponseDto = {
  accessToken: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
};
