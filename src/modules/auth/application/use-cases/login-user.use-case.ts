import { Inject, Injectable } from '@nestjs/common';
import { LoginDto } from '../dtos/login.dto';
import { AuthResponseDto } from '../dtos/auth-response.dto';
import { AUTH_USER_REPOSITORY } from '../../domain/interfaces/auth-user-repository.interface';
import type { AuthUserRepository } from '../../domain/interfaces/auth-user-repository.interface';
import { PASSWORD_HASHER } from '../../domain/interfaces/password-hasher.interface';
import type { PasswordHasher } from '../../domain/interfaces/password-hasher.interface';
import { TOKEN_SERVICE } from '../../domain/interfaces/token-service.interface';
import type { TokenService } from '../../domain/interfaces/token-service.interface';
import { InvalidCredentialsException } from '../../domain/exceptions/invalid-credentials.exception';

// Orquesta el inicio de sesion sin acoplarse a bcrypt, JWT ni Prisma directamente.
@Injectable()
export class LoginUserUseCase {
  constructor(
    @Inject(AUTH_USER_REPOSITORY)
    private readonly authUserRepository: AuthUserRepository,

    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasher,

    @Inject(TOKEN_SERVICE)
    private readonly tokenService: TokenService,
  ) {}

  async execute(dto: LoginDto): Promise<AuthResponseDto> {
    const email = dto.email.trim().toLowerCase();

    const user = await this.authUserRepository.findByEmail(email);

    // Se usa la misma excepcion para no revelar si fallo el correo o la contrasena.
    if (!user || !user.isActive) {
      throw new InvalidCredentialsException();
    }

    const isPasswordValid = await this.passwordHasher.compare(
      dto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new InvalidCredentialsException();
    }

    const accessToken = await this.tokenService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      accessToken,
      user: user.toSafeObject(),
    };
  }
}
