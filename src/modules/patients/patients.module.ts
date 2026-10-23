import { PatientLinksController } from './infrastructure/controllers/patient-links.controller';
import { ManagePatientLinksUseCase } from './application/use-cases/manage-patient-links.use-case';
import { PATIENT_LINKS_REPOSITORY } from './domain/interfaces/patient-links.repository';
import { PrismaPatientLinksRepository } from './infrastructure/repositories/prisma-patient-links.repository';
import { PatientAgendaController } from './infrastructure/controllers/patient-agenda.controller';
import { GetPatientAgendaUseCase } from './application/use-cases/get-patient-agenda.use-case';
import { PATIENT_AGENDA_REPOSITORY } from './domain/interfaces/patient-agenda.repository';
import { PrismaPatientAgendaRepository } from './infrastructure/repositories/prisma-patient-agenda.repository';
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
  controllers: [
    PatientsController,
    PatientLinksController,
    PatientAgendaController,
  ],
  providers: [
    PrismaService,
    ManagePatientLinksUseCase,
    GetPatientAgendaUseCase,
    {
      provide: PATIENT_AGENDA_REPOSITORY,
      useClass: PrismaPatientAgendaRepository,
    },
    {
      provide: PATIENT_LINKS_REPOSITORY,
      useClass: PrismaPatientLinksRepository,
    },
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
  exports: [
    PatientsService,
    ManagePatientLinksUseCase,
    PATIENTS_REPOSITORY,
    PATIENT_AGENDA_REPOSITORY,
  ],
})
export class PatientsModule {}
