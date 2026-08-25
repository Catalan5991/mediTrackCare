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
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param configService Servicio que coordina las operaciones de config service.
   * @param authUserRepository Repositorio utilizado para persistir y consultar auth user repository.
   */
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

  /**
   * Valida el recurso solicitado.
   * @param payload Datos incluidos en la operación.
   * @returns Promesa que resuelve con el resultado de la operación.
   * @throws {Error} Cuando los datos o el estado de la operación incumplen una regla de negocio.
   */
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
