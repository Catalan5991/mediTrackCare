import { Inject, Injectable } from '@nestjs/common';
import { UserResponseDto } from '../dtos/user-response.dto';
import {
  USERS_REPOSITORY,
  UsersRepository,
} from '../../domain/interfaces/user-repository.interface';

// Lista usuarios como objetos seguros para no exponer contrasenas.
@Injectable()
export class GetUsersUseCase {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute(): Promise<UserResponseDto[]> {
    const users = await this.usersRepository.findAll();

    return users.map((user) => user.toSafeObject());
  }
}
