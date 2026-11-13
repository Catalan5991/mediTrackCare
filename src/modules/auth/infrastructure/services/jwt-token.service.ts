import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type {
  TokenPayload,
  TokenService,
} from '../../domain/interfaces/token-service.interface';

@Injectable()
// Implementacion JWT del puerto de firma de tokens.
export class JwtTokenService implements TokenService {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param jwtService Servicio que coordina las operaciones de jwt service.
   */
  constructor(private readonly jwtService: JwtService) {}

  /**
   * Genera el recurso solicitado.
   * @param payload Datos incluidos en la operación.
   * @returns Promesa que resuelve con el resultado de la operación.
   */
  async sign(payload: TokenPayload): Promise<string> {
    return this.jwtService.signAsync(payload);
  }
}
