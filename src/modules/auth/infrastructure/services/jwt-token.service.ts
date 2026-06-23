import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type {
  TokenPayload,
  TokenService,
} from '../../domain/interfaces/token-service.interface';

@Injectable()
// Implementacion JWT del puerto de firma de tokens.
export class JwtTokenService implements TokenService {
  constructor(private readonly jwtService: JwtService) {}

  async sign(payload: TokenPayload): Promise<string> {
    return this.jwtService.signAsync(payload);
  }
}
