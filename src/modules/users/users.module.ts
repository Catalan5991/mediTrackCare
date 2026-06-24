import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';

import { UsersController } from './infrastructure/controllers/users.controller';

import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { GetUsersUseCase } from './application/use-cases/get-users.use-case';
import { GetUserUseCase } from './application/use-cases/get-user.use-case';
import { UpdateUserUseCase } from './application/use-cases/update-user.use-case';
import { DeleteUserUseCase } from './application/use-cases/delete-user.use-case';

import { USERS_REPOSITORY } from './domain/interfaces/user-repository.interface';
import { USER_PASSWORD_HASHER } from './domain/interfaces/user-password-hasher.interface';

import { PrismaUserRepository } from './infrastructure/repositories/prisma-user.repository';
import { BcryptUserPasswordHasherService } from './infrastructure/services/bcrypt-user-password-hasher.service';

// Agrupa las operaciones administrativas de usuarios y enlaza puertos con adaptadores.
@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [
    CreateUserUseCase,
    GetUsersUseCase,
    GetUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    {
      provide: USERS_REPOSITORY,
      useClass: PrismaUserRepository,
    },
    {
      provide: USER_PASSWORD_HASHER,
      useClass: BcryptUserPasswordHasherService,
    },
  ],
  exports: [USERS_REPOSITORY],
})
export class UsersModule {}
