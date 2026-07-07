import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { AuthModule } from './modules/auth/auth.modules';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { MedicationsModule } from './modules/medications/medications.module';
import { PatientsModule } from './modules/patients/patients.module';
import { PrescriptionsModule } from './modules/prescriptions/prescriptions.module';
import { MedicalMeasurementsModule } from './modules/medical-measurements/medical-measurements.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { IntakesModule } from './modules/intakes/intakes.module';
import { RemindersModule } from './modules/reminders/reminders.module';
import { CaregiversModule } from './modules/caregivers/caregivers.module';
import { RolesModule } from './modules/roles/roles.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    RolesModule,
    UsersModule,
    MedicationsModule,
    PatientsModule,
    CaregiversModule,
    PrescriptionsModule,
    MedicalMeasurementsModule,
    NotificationsModule
    IntakesModule,
    RemindersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
