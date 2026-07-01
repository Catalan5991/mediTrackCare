import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMedicationUseCase } from './application/use-cases/create-medication.use-case';
import { DeleteMedicationUseCase } from './application/use-cases/delete-medication.use-case';
import { FindAllMedicationsUseCase } from './application/use-cases/find-all-medications.use-case';
import { FindMedicationByIdUseCase } from './application/use-cases/find-medication-by-id.use-case';
import { UpdateMedicationUseCase } from './application/use-cases/update-medication.use-case';
import { MedicationsRepository } from './domain/interfaces/medications-repository.interface';
import { MedicationsController } from './infraestructure/controllers/medications.controller';
import { PrismaMedicationsRepository } from './infraestructure/repositories/prisma-medications.repository';
import { MedicationsService } from './infraestructure/services/medications.service';

@Module({
  controllers: [MedicationsController],
  providers: [
    PrismaService,

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
  exports: [
    MedicationsService,
    MedicationsRepository,
  ],
})
export class MedicationsModule {}