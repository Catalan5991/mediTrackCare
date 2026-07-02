import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PatientsController } from './infrastructure/controllers/patients.controller';
import { PATIENTS_REPOSITORY } from './domain/interfaces/patients.repository.interface';
import { PrismaPatientsRepository } from './infrastructure/repositories/prisma-patients.repository';
import { PatientsService } from './infrastructure/services/patients.service';
import { CreatePatientUseCase } from './application/use-cases/create-patient.use-case';
import { DeletePatientUseCase } from './application/use-cases/delete-patient.use-case';
import { FindAllPatientsUseCase } from './application/use-cases/find-all-patients.use-case';
import { FindPatientByIdUseCase } from './application/use-cases/find-patient-by-id.use-case';
import { UpdatePatientUseCase } from './application/use-cases/update-patient.use-case';

// Agrupa el registro de pacientes y enlaza casos de uso con persistencia Prisma.
@Module({
  controllers: [PatientsController],
  providers: [
    PrismaService,
    PatientsService,
    CreatePatientUseCase,
    FindAllPatientsUseCase,
    FindPatientByIdUseCase,
    UpdatePatientUseCase,
    DeletePatientUseCase,
    // Token del dominio resuelto con el adaptador concreto de base de datos.
    {
      provide: PATIENTS_REPOSITORY,
      useClass: PrismaPatientsRepository,
    },
  ],
  exports: [PatientsService],
})
export class PatientsModule {}