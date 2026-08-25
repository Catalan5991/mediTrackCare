import { Inject, Injectable } from '@nestjs/common';
import { UserResponseDto } from '../dtos/user-response.dto';
import {
  USERS_REPOSITORY,
  UsersRepository,
} from '../../domain/interfaces/user-repository.interface';
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception';

// Realiza borrado logico para conservar historial y relaciones del usuario.
@Injectable()
export class DeleteUserUseCase {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param usersRepository Repositorio utilizado para persistir y consultar users repository.
   */
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepository,
  ) {}
  /**
   * Elimina un usuario aplicando las reglas del caso de uso.
   * @param id Identificador único del recurso.
   * @returns Promesa que resuelve con el resultado de la operación.
   * @throws {UserNotFoundException} Cuando los datos o el estado incumplen la regla de negocio validada.
   */
  async execute(id: number): Promise<UserResponseDto> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new UserNotFoundException();
    }

    const deletedUser = await this.usersRepository.softDelete(id);

    return deletedUser.toSafeObject();
  }
}
