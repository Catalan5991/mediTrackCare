import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMedicationUseCase } from './application/use-cases/create-medication.use-case';
import { DeleteMedicationUseCase } from './application/use-cases/delete-medication.use-case';
import { FindAllMedicationsUseCase } from './application/use-cases/find-all-medications.use-case';
import { FindMedicationByIdUseCase } from './application/use-cases/find-medication-by-id.use-case';
import { UpdateMedicationUseCase } from './application/use-cases/update-medication.use-case';
import { MedicationsRepository } from './domain/interfaces/medications-repository.interface';
import { MedicationsController } from './infrastructure/controllers/medications.controller';
import { PrismaMedicationsRepository } from './infrastructure/repositories/prisma-medications.repository';
import { MedicationsService } from './infrastructure/services/medications.service';

// Agrupa el catalogo de medicamentos y conecta casos de uso con Prisma.
@Module({
  controllers: [MedicationsController],
  providers: [
    PrismaService,

    // Token del dominio resuelto con el adaptador de persistencia concreto.
    {
      provide: MedicationsRepository,
      useClass: PrismaMedicationsRepository,
    },

    MedicationsService,

    CreateMedicationUseCase,
    FindAllMedicationsUseCase,
    FindMedicationByIdUseCase,
    UpdateMedicationUseCase,
    DeleteMedicationUseCase,
  ],
  exports: [MedicationsService, MedicationsRepository],
})
export class MedicationsModule {}
