import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import type { PasswordResetRepository } from '../../domain/interfaces/password-reset-repository.interface';
@Injectable()
export class PrismaPasswordResetRepository implements PasswordResetRepository {
  constructor(private readonly prisma: PrismaService) {}
  async reserve(
    userId: number,
    tokenHash: string,
    expiresAt: Date,
    now: Date,
  ): Promise<boolean> {
    const result = await this.prisma.user.updateMany({
      where: {
        id: userId,
        isActive: true,
        role: { isActive: true },
        OR: [
          { passwordResetRequestedAt: null },
          {
            passwordResetRequestedAt: { lte: new Date(now.getTime() - 60_000) },
          },
        ],
      },
      data: {
        passwordResetTokenHash: tokenHash,
        passwordResetExpiresAt: expiresAt,
        passwordResetRequestedAt: now,
      },
    });
    return result.count === 1;
  }
  async revoke(tokenHash: string): Promise<void> {
    await this.prisma.user.updateMany({
      where: { passwordResetTokenHash: tokenHash },
      data: { passwordResetTokenHash: null, passwordResetExpiresAt: null },
    });
  }
  async consume(
    tokenHash: string,
    password: string,
    now: Date,
  ): Promise<boolean> {
    // Actualizacion condicional atomica: impide reutilizacion concurrente.
    const result = await this.prisma.user.updateMany({
      where: {
        passwordResetTokenHash: tokenHash,
        passwordResetExpiresAt: { gt: now },
        isActive: true,
        role: { isActive: true },
      },
      data: {
        password,
        passwordResetTokenHash: null,
        passwordResetExpiresAt: null,
      },
    });
    return result.count === 1;
  }
}
