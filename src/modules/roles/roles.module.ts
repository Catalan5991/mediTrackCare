import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoleUseCase } from './application/use-cases/create-role.use-case';
import { DeleteRoleUseCase } from './application/use-cases/delete-role.use-case';
import { FindAllRolesUseCase } from './application/use-cases/find-all-roles.use-case';
import { FindRoleByIdUseCase } from './application/use-cases/find-role-by-id.use-case';
import { UpdateRoleUseCase } from './application/use-cases/update-role.use-case';
import { ROLES_REPOSITORY } from './domain/interfaces/roles.repository.interface';
import { RolesController } from './infrastructure/controllers/roles.controller';
import { PrismaRolesRepository } from './infrastructure/repositories/prisma-roles.repository';
import { RolesService } from './infrastructure/services/roles.service';

// Modulo Nest que agrupa todo lo necesario para gestionar roles. Registra el
// controller HTTP, la fachada de servicio, los casos de uso y el adaptador
// Prisma que implementa el contrato de persistencia del dominio.
@Module({
  controllers: [RolesController],
  providers: [
    PrismaService,
    RolesService,
    CreateRoleUseCase,
    FindAllRolesUseCase,
    FindRoleByIdUseCase,
    UpdateRoleUseCase,
    DeleteRoleUseCase,
    // Vincula el puerto del dominio con la implementacion concreta de Prisma.
    {
      provide: ROLES_REPOSITORY,
      useClass: PrismaRolesRepository,
    },
  ],
  exports: [RolesService],
})
export class RolesModule {}
