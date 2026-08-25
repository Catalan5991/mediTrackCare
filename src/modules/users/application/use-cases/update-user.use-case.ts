import { Inject, Injectable } from '@nestjs/common';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UserResponseDto } from '../dtos/user-response.dto';
import {
  UpdateUserData,
  USERS_REPOSITORY,
  UsersRepository,
} from '../../domain/interfaces/user-repository.interface';
import {
  USER_PASSWORD_HASHER,
  UserPasswordHasher,
} from '../../domain/interfaces/user-password-hasher.interface';
import { UserAlreadyExistsException } from '../../domain/exceptions/user-alredy-exists.exception';
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception';

// Aplica cambios parciales preservando reglas de correo unico y hashing de password.
@Injectable()
export class UpdateUserUseCase {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param usersRepository Repositorio utilizado para persistir y consultar users repository.
   * @param passwordHasher Valor de password hasher requerido por la operacion.
   */
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepository,

    @Inject(USER_PASSWORD_HASHER)
    private readonly passwordHasher: UserPasswordHasher,
  ) {}
  /**
   * Actualiza un usuario aplicando las reglas del caso de uso.
   * @param id Identificador único del recurso.
   * @param dto Datos de dto validados para la operacion.
   * @returns Promesa que resuelve con el resultado de la operación.
   * @throws {UserNotFoundException} Cuando los datos o el estado incumplen la regla de negocio validada.
   * @throws {UserAlreadyExistsException} Cuando los datos o el estado incumplen la regla de negocio validada.
   */
  async execute(id: number, dto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new UserNotFoundException();
    }

    const data: UpdateUserData = {};

    // Solo se agregan campos presentes para evitar sobrescribir valores con undefined.
    if (dto.name !== undefined) {
      data.name = dto.name.trim();
    }

    if (dto.email !== undefined) {
      const email = dto.email.trim().toLowerCase();

      // Permite conservar el mismo correo del usuario editado sin marcar duplicado.
      const emailExists = await this.usersRepository.findByEmailExceptId(
        email,
        id,
      );

      if (emailExists) {
        throw new UserAlreadyExistsException();
      }

      data.email = email;
    }

    if (dto.password !== undefined) {
      data.password = await this.passwordHasher.hash(dto.password);
    }

    if (dto.role !== undefined) {
      data.role = dto.role;
    }

    if (dto.isActive !== undefined) {
      data.isActive = dto.isActive;
    }

    const updatedUser = await this.usersRepository.update(id, data);

    return updatedUser.toSafeObject();
  }
}
