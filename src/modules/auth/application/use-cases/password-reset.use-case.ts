import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { createHash, randomBytes } from 'node:crypto';
import { AUTH_USER_REPOSITORY } from '../../domain/interfaces/auth-user-repository.interface';
import type { AuthUserRepository } from '../../domain/interfaces/auth-user-repository.interface';
import { PASSWORD_HASHER } from '../../domain/interfaces/password-hasher.interface';
import type { PasswordHasher } from '../../domain/interfaces/password-hasher.interface';
import { PASSWORD_RESET_REPOSITORY } from '../../domain/interfaces/password-reset-repository.interface';
import type { PasswordResetRepository } from '../../domain/interfaces/password-reset-repository.interface';
import { PASSWORD_RESET_MAILER } from '../../domain/interfaces/password-reset-mailer.interface';
import type { PasswordResetMailer } from '../../domain/interfaces/password-reset-mailer.interface';
import {
  ForgotPasswordDto,
  ResetPasswordDto,
} from '../dtos/password-reset.dto';
@Injectable()
export class PasswordResetUseCase {
  private readonly logger = new Logger(PasswordResetUseCase.name);
  constructor(
    @Inject(AUTH_USER_REPOSITORY) private readonly users: AuthUserRepository,
    @Inject(PASSWORD_HASHER) private readonly hasher: PasswordHasher,
    @Inject(PASSWORD_RESET_REPOSITORY)
    private readonly resets: PasswordResetRepository,
    @Inject(PASSWORD_RESET_MAILER) private readonly mailer: PasswordResetMailer,
  ) {}
  async request(dto: ForgotPasswordDto) {
    this.mailer.assertConfigured();
    const result = {
      message:
        'Si el correo esta registrado y activo, recibiras un enlace para restablecer tu contrasena.',
    };
    const user = await this.users.findByEmail(dto.email.trim().toLowerCase());
    if (!user || !user.isActive || !user.roleIsActive) return result;
    const token = randomBytes(32).toString('hex');
    const tokenHash = this.hashToken(token),
      now = new Date();
    if (
      !(await this.resets.reserve(
        user.id,
        tokenHash,
        new Date(now.getTime() + 15 * 60_000),
        now,
      ))
    )
      return result;
    try {
      await this.mailer.send(user.email, token);
    } catch {
      this.logger.error('Fallo el envio del correo de recuperacion.');
      await this.resets.revoke(tokenHash);
    }
    return result;
  }
  async reset(dto: ResetPasswordDto) {
    if (Buffer.byteLength(dto.newPassword, 'utf8') > 72)
      throw new BadRequestException(
        'La contrasena no puede superar 72 bytes UTF-8.',
      );
    const password = await this.hasher.hash(dto.newPassword);
    if (
      !(await this.resets.consume(
        this.hashToken(dto.token),
        password,
        new Date(),
      ))
    )
      throw new BadRequestException(
        'El enlace de recuperacion es invalido o ha vencido.',
      );
    return { message: 'Contrasena restablecida correctamente.' };
  }
  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
