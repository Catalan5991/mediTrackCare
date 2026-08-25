import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';

import { MedicalMeasurementsController } from './infrastructure/controllers/medical-measurements.controller';
import { MedicalMeasurementsService } from './infrastructure/services/medical-measurements.service';
import { PrismaMedicalMeasurementsRepository } from './infrastructure/repositories/prisma-medical-measurements.repository';

import { CreateMedicalMeasurementUseCase } from './application/use-cases/create-medical-measurement.use-case';
import { FindMedicalMeasurementsUseCase } from './application/use-cases/find-medical-measurements.use-case';
import { FindMedicalMeasurementByIdUseCase } from './application/use-cases/find-medical-measurement-by-id.use-case';
import { UpdateMedicalMeasurementUseCase } from './application/use-cases/update-medical-measurement.use-case';
import { DeleteMedicalMeasurementUseCase } from './application/use-cases/delete-medical-measurement.use-case';

import { MEDICAL_MEASUREMENTS_REPOSITORY } from './domain/interfaces/medical-measurements.repository.interface';

@Module({
  imports: [PrismaModule],
  controllers: [MedicalMeasurementsController],
  providers: [
    MedicalMeasurementsService,

    CreateMedicalMeasurementUseCase,
    FindMedicalMeasurementsUseCase,
    FindMedicalMeasurementByIdUseCase,
    UpdateMedicalMeasurementUseCase,
    DeleteMedicalMeasurementUseCase,

    {
      provide: MEDICAL_MEASUREMENTS_REPOSITORY,
      useClass: PrismaMedicalMeasurementsRepository,
    },
  ],
  exports: [MedicalMeasurementsService],
})
export class MedicalMeasurementsModule {}
