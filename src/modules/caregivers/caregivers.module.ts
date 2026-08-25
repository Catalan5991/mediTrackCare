import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCaregiverUseCase } from './application/use-cases/create-caregiver.use-case';
import { DeleteCaregiverUseCase } from './application/use-cases/delete-caregiver.use-case';
import { FindAllCaregiversUseCase } from './application/use-cases/find-all-caregivers.use-case';
import { FindCaregiverByIdUseCase } from './application/use-cases/find-caregiver-by-id.use-case';
import { UpdateCaregiverUseCase } from './application/use-cases/update-caregiver.use-case';
import { CAREGIVERS_REPOSITORY } from './domain/interfaces/caregivers.repository.interface';
import { CaregiversController } from './infrastructure/controllers/caregivers.controller';
import { PrismaCaregiversRepository } from './infrastructure/repositories/prisma-caregivers.repository';
import { CaregiversService } from './infrastructure/services/caregivers.service';

// Modulo Nest que agrupa todo lo necesario para gestionar cuidadores. Registra
// el controller HTTP, la fachada de servicio, los casos de uso y el adaptador
// Prisma que implementa el contrato de persistencia del dominio.
@Module({
  controllers: [CaregiversController],
  providers: [
    PrismaService,
    CaregiversService,
    CreateCaregiverUseCase,
    FindAllCaregiversUseCase,
    FindCaregiverByIdUseCase,
    UpdateCaregiverUseCase,
    DeleteCaregiverUseCase,
    // Vincula el puerto del dominio con la implementacion concreta de Prisma.
    {
      provide: CAREGIVERS_REPOSITORY,
      useClass: PrismaCaregiversRepository,
    },
  ],
  exports: [CaregiversService],
})
export class CaregiversModule {}
