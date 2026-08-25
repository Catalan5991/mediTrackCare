import { Inject, Injectable } from '@nestjs/common';
import { RegisterDto } from '../dtos/register.dto';
import { AuthResponseDto } from '../dtos/auth-response.dto';
import { AUTH_USER_REPOSITORY } from '../../domain/interfaces/auth-user-repository.interface';
import type { AuthUserRepository } from '../../domain/interfaces/auth-user-repository.interface';
import { PASSWORD_HASHER } from '../../domain/interfaces/password-hasher.interface';
import type { PasswordHasher } from '../../domain/interfaces/password-hasher.interface';
import { TOKEN_SERVICE } from '../../domain/interfaces/token-service.interface';
import type { TokenService } from '../../domain/interfaces/token-service.interface';
import { UserAlreadyExistsException } from '../../domain/exceptions/user-already-exists.exception';

// Registra usuarios normalizando el correo y delegando hashing/token a puertos del dominio.
@Injectable()
export class RegisterUserUseCase {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param authUserRepository Repositorio utilizado para persistir y consultar auth user repository.
   * @param passwordHasher Valor de password hasher requerido por la operacion.
   * @param tokenService Servicio que coordina las operaciones de token service.
   */
  constructor(
    @Inject(AUTH_USER_REPOSITORY)
    private readonly authUserRepository: AuthUserRepository,

    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasher,

    @Inject(TOKEN_SERVICE)
    private readonly tokenService: TokenService,
  ) {}
  /**
   * Registra un usuario y protege sus credenciales.
   * @param dto Datos de dto validados para la operacion.
   * @returns Promesa que resuelve con el resultado de la operación.
   * @throws {UserAlreadyExistsException} Cuando los datos o el estado incumplen la regla de negocio validada.
   */
  async execute(dto: RegisterDto): Promise<AuthResponseDto> {
    const email = dto.email.trim().toLowerCase();

    const userExists = await this.authUserRepository.findByEmail(email);

    if (userExists) {
      throw new UserAlreadyExistsException();
    }

    const hashedPassword = await this.passwordHasher.hash(dto.password);

    const user = await this.authUserRepository.create({
      name: dto.name.trim(),
      email,
      password: hashedPassword,
    });

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
