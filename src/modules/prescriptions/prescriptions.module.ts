import { Module } from '@nestjs/common';
import { PrescriptionsController } from './infrastructure/controllers/prescriptions.controller';
import { PrescriptionsService } from './infrastructure/services/prescriptions.service';
import { PrismaPrescriptionsRepository } from './infrastructure/repositories/prisma-prescriptions.repository';
import { PRESCRIPTION_REPOSITORY } from './domain/interfaces/prescription-repository.interface';
import { CreatePrescriptionUseCase } from './application/use-cases/create-prescription.use-case';
import { FindAllPrescriptionsUseCase } from './application/use-cases/find-all-prescriptions.use-case';
import { FindPrescriptionByIdUseCase } from './application/use-cases/find-prescription-by-id.use-case';
import { UpdatePrescriptionUseCase } from './application/use-cases/update-prescription.use-case';
import { CancelPrescriptionUseCase } from './application/use-cases/cancel-prescription.use-case';
import { DeletePrescriptionUseCase } from './application/use-cases/delete-prescription.use-case';
import { PrismaModule } from '../prisma/prisma.module';

// Agrupa todas las dependencias necesarias para gestionar recetas medicas.
@Module({
  imports: [PrismaModule],
  controllers: [PrescriptionsController],
  providers: [
    PrescriptionsService,

    // Casos de uso que encapsulan las reglas de aplicacion del modulo.
    CreatePrescriptionUseCase,
    FindAllPrescriptionsUseCase,
    FindPrescriptionByIdUseCase,
    UpdatePrescriptionUseCase,
    CancelPrescriptionUseCase,
    DeletePrescriptionUseCase,

    // Implementacion concreta del repositorio usada por inyeccion de dependencias.
    {
      provide: PRESCRIPTION_REPOSITORY,
      useClass: PrismaPrescriptionsRepository,
    },
  ],
  exports: [PrescriptionsService],
})
export class PrescriptionsModule {}
