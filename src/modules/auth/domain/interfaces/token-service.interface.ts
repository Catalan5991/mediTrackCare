// Token de inyeccion para abstraer la generacion de tokens.
export const TOKEN_SERVICE = 'TOKEN_SERVICE';

// Carga minima que identifica al usuario dentro del JWT.
export type TokenPayload = {
  sub: number;
  email: string;
  role: string;
};

// Puerto de firma para mantener JWT fuera de la capa de aplicacion.
export interface TokenService {
  sign(payload: TokenPayload): Promise<string>;
}
