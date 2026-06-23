import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AUTH_USER_REPOSITORY } from '../../domain/interfaces/auth-user-repository.interface';
import type { AuthUserRepository } from '../../domain/interfaces/auth-user-repository.interface';

type JwtPayload = {
  sub: number;
  email: string;
  role: string;
};

@Injectable()
// Estrategia Passport que valida el bearer token y carga el usuario vigente.
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,

    @Inject(AUTH_USER_REPOSITORY)
    private readonly authUserRepository: AuthUserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.authUserRepository.findById(payload.sub);

    // Un token firmado no es suficiente si el usuario fue desactivado despues.
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Token inválido o usuario inactivo.');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }
}
