import { Inject, Injectable } from '@nestjs/common';
import { AUTH_USER_REPOSITORY } from '../../domain/interfaces/auth-user-repository.interface';
import type { AuthUserRepository } from '../../domain/interfaces/auth-user-repository.interface';
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception';

// Obtiene el perfil desde el dominio y evita exponer usuarios inactivos.
@Injectable()
export class GetProfileUseCase {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param authUserRepository Repositorio utilizado para persistir y consultar auth user repository.
   */
  constructor(
    @Inject(AUTH_USER_REPOSITORY)
    private readonly authUserRepository: AuthUserRepository,
  ) {}
  /**
   * Obtiene informacion de usuario autenticado segun los criterios indicados.
   * @param userId Valor de user id requerido por la operacion.
   * @returns Promesa que resuelve con el resultado de la operación.
   * @throws {UserNotFoundException} Cuando los datos o el estado incumplen la regla de negocio validada.
   */
  async execute(userId: number) {
    const user = await this.authUserRepository.findById(userId);

    if (!user || !user.isActive) {
      throw new UserNotFoundException();
    }

    return user.toSafeObject();
  }
}
