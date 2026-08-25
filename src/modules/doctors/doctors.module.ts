import { Module } from '@nestjs/common';

import { CreateDoctorUseCase } from './application/use-cases/create-doctor.use-case';
import { DeleteDoctorUseCase } from './application/use-cases/delete-doctor.use-case';
import { FindAllDoctorsUseCase } from './application/use-cases/find-all-doctors.use-case';
import { FindDoctorByIdUseCase } from './application/use-cases/find-doctor-by-id.use-case';
import { FindDoctorByUserIdUseCase } from './application/use-cases/find-doctor-by-user-id.use-case';
import { UpdateDoctorUseCase } from './application/use-cases/update-doctor.use-case';
import { ManageDoctorPatientsUseCase } from './application/use-cases/manage-doctor-patients.use-case';
import { DOCTORS_REPOSITORY } from './domain/interfaces/doctors.repository.interface';
import { DoctorsController } from './infrastructure/controllers/doctors.controller';
import { PrismaDoctorsRepository } from './infrastructure/repositories/prisma-doctors.repository';
import { DoctorsService } from './infrastructure/services/doctors.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [DoctorsController],
  providers: [
    DoctorsService,
    CreateDoctorUseCase,
    FindAllDoctorsUseCase,
    FindDoctorByIdUseCase,
    FindDoctorByUserIdUseCase,
    UpdateDoctorUseCase,
    DeleteDoctorUseCase,
    ManageDoctorPatientsUseCase,
    { provide: DOCTORS_REPOSITORY, useClass: PrismaDoctorsRepository },
  ],
  exports: [DoctorsService],
})
export class DoctorsModule {}
