// Respuesta publica del modulo Users; nunca incluye password.
export type UserResponseDto = {
  id: number;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};
