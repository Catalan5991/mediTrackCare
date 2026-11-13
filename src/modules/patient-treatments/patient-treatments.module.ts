import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { PatientTreatmentsController } from './infrastructure/controllers/patient-treatments.controller';
import { PatientTreatmentsService } from './infrastructure/patient-treatments.service';
@Module({imports:[PrismaModule],controllers:[PatientTreatmentsController],providers:[PatientTreatmentsService]})
export class PatientTreatmentsModule {}
