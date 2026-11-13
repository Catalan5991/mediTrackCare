import { Inject, Injectable } from '@nestjs/common';
import { UserResponseDto } from '../dtos/user-response.dto';
import {
  USERS_REPOSITORY,
  UsersRepository,
} from '../../domain/interfaces/user-repository.interface';

// Lista usuarios como objetos seguros para no exponer contrasenas.
@Injectable()
export class GetUsersUseCase {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param usersRepository Repositorio utilizado para persistir y consultar users repository.
   */
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepository,
  ) {}
  /**
   * Obtiene informacion de usuario segun los criterios indicados.
   * @returns Promesa que resuelve con el resultado de la operación.
   */
  async execute(): Promise<UserResponseDto[]> {
    const users = await this.usersRepository.findAll();

    return users.map((user) => user.toSafeObject());
  }
}
