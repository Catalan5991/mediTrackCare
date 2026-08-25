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
  /**
   * Genera el recurso solicitado.
   * @param payload Datos incluidos en la operación.
   * @returns Resultado producido por la operación.
   */
  sign(payload: TokenPayload): Promise<string>;
}
