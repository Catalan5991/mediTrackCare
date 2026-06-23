import { Inject, Injectable } from '@nestjs/common';
import { AUTH_USER_REPOSITORY } from '../../domain/interfaces/auth-user-repository.interface';
import type { AuthUserRepository } from '../../domain/interfaces/auth-user-repository.interface';
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception';

// Obtiene el perfil desde el dominio y evita exponer usuarios inactivos.
@Injectable()
export class GetProfileUseCase {
  constructor(
    @Inject(AUTH_USER_REPOSITORY)
    private readonly authUserRepository: AuthUserRepository,
  ) {}

  async execute(userId: number) {
    const user = await this.authUserRepository.findById(userId);

    if (!user || !user.isActive) {
      throw new UserNotFoundException();
    }

    return user.toSafeObject();
  }
}
