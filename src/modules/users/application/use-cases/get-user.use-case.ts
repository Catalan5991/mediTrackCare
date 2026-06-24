import { Inject, Injectable } from '@nestjs/common';
import { UserResponseDto } from '../dtos/user-response.dto';
import {
  USERS_REPOSITORY,
  UsersRepository,
} from '../../domain/interfaces/user-repository.interface';
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception';

// Recupera un usuario por id y traduce ausencias a una excepcion de dominio.
@Injectable()
export class GetUserUseCase {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute(id: number): Promise<UserResponseDto> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new UserNotFoundException();
    }

    return user.toSafeObject();
  }
}
