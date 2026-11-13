import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserResponseDto } from '../dtos/user-response.dto';
import {
  USERS_REPOSITORY,
  UsersRepository,
} from '../../domain/interfaces/user-repository.interface';
import {
  USER_PASSWORD_HASHER,
  UserPasswordHasher,
} from '../../domain/interfaces/user-password-hasher.interface';
import { UserAlreadyExistsException } from '../../domain/exceptions/user-alredy-exists.exception';

// Crea usuarios normalizando correo y almacenando siempre la contrasena hasheada.
@Injectable()
export class CreateUserUseCase {
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
   * Crea un usuario aplicando las reglas del caso de uso.
   * @param dto Datos de dto validados para la operacion.
   * @returns Promesa que resuelve con el resultado de la operación.
   * @throws {UserAlreadyExistsException} Cuando los datos o el estado incumplen la regla de negocio validada.
   */
  async execute(dto: CreateUserDto): Promise<UserResponseDto> {
    const email = dto.email.trim().toLowerCase();

    const userExists = await this.usersRepository.findByEmail(email);

    // La unicidad se valida en la aplicacion para devolver un error de dominio claro.
    if (userExists) {
      throw new UserAlreadyExistsException();
    }

    const hashedPassword = await this.passwordHasher.hash(dto.password);

    const user = await this.usersRepository.create({
      name: dto.name.trim(),
      email,
      password: hashedPassword,
      role: dto.role,
      isActive: dto.isActive,
    });

    return user.toSafeObject();
  }
}
