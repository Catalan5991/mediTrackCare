import { ApiProperty } from '@nestjs/swagger';

import { DashboardPeriod } from './dashboard-filter.dto';

// DTOs de respuesta del dashboard administrativo. Estan separados por secciones
// para que Swagger documente una estructura legible y estable.
class DashboardPeriodDto {
  @ApiProperty({ example: DashboardPeriod.THIRTY_DAYS })
  value!: DashboardPeriod;

  @ApiProperty({ example: '2026-06-17T00:00:00.000Z' })
  startDate!: Date;

  @ApiProperty({ example: '2026-07-16T23:59:59.999Z' })
  endDate!: Date;
}

class RoleDistributionDto {
  @ApiProperty({ example: 'PATIENT' })
  role!: string;

  @ApiProperty({ example: 24 })
  total!: number;
}

class AdminUsersMetricsDto {
  @ApiProperty({ example: 120 })
  total!: number;

  @ApiProperty({ example: 105 })
  active!: number;

  @ApiProperty({ example: 15 })
  inactive!: number;

  @ApiProperty({ example: 24 })
  patients!: number;

  @ApiProperty({ example: 8 })
  doctors!: number;

  @ApiProperty({ example: 16 })
  caregivers!: number;

  @ApiProperty({ type: [RoleDistributionDto] })
  byRole!: RoleDistributionDto[];

  @ApiProperty({ example: 9 })
  recentlyRegistered!: number;
}

class AdminPatientsMetricsDto {
  @ApiProperty({ example: 24 })
  total!: number;

  @ApiProperty({ example: 18 })
  withActivePrescriptions!: number;
}

class MostPrescribedMedicationDto {
  @ApiProperty({ example: 1 })
  medicationId!: number;

  @ApiProperty({ example: 'Metformina' })
  medicationName!: string;

  @ApiProperty({ example: 12 })
  total!: number;
}

class AdminPrescriptionsMetricsDto {
  @ApiProperty({ example: 50 })
  total!: number;

  @ApiProperty({ example: 32 })
  active!: number;

  @ApiProperty({ example: 12 })
  expired!: number;

  @ApiProperty({ example: 2.4 })
  averageMedicationsPerPrescription!: number;

  @ApiProperty({ type: [MostPrescribedMedicationDto] })
  mostPrescribedMedications!: MostPrescribedMedicationDto[];
}

class LowAdherencePatientDto {
  @ApiProperty({ example: 4 })
  patientId!: number;

  @ApiProperty({ example: 'Ana Perez' })
  patientName!: string;

  @ApiProperty({ example: 62.5 })
  adherencePercentage!: number;
}

class AdminIntakesMetricsDto {
  @ApiProperty({ example: 240 })
  total!: number;

  @ApiProperty({ example: 180 })
  completed!: number;

  @ApiProperty({ example: 42 })
  pending!: number;

  @ApiProperty({ example: 18 })
  missed!: number;

  @ApiProperty({ example: 4 })
  delayed!: number;

  @ApiProperty({ example: 75 })
  adherencePercentage!: number;

  @ApiProperty({ type: [LowAdherencePatientDto] })
  patientsWithLowAdherence!: LowAdherencePatientDto[];
}

class AdminRemindersMetricsDto {
  @ApiProperty({ example: 80 })
  total!: number;

  @ApiProperty({ example: 65 })
  active!: number;

  @ApiProperty({ example: 15 })
  inactive!: number;
}

class AdminNotificationsMetricsDto {
  @ApiProperty({ example: 350 })
  total!: number;

  @ApiProperty({ example: 45 })
  pending!: number;

  @ApiProperty({ example: 210 })
  sent!: number;

  @ApiProperty({ example: 120 })
  read!: number;

  @ApiProperty({ example: 230 })
  unread!: number;

  @ApiProperty({ example: 34.29 })
  readPercentage!: number;
}

class MeasurementTypeDistributionDto {
  @ApiProperty({ example: 'GLUCOSA' })
  type!: string;

  @ApiProperty({ example: 35 })
  total!: number;
}

class AdminMeasurementsMetricsDto {
  @ApiProperty({ example: 140 })
  total!: number;

  @ApiProperty({ example: 27 })
  recentlyRegistered!: number;

  @ApiProperty({ type: [MeasurementTypeDistributionDto] })
  byType!: MeasurementTypeDistributionDto[];

  @ApiProperty({ example: 12 })
  patientsRecentlyMeasured!: number;
}

class AdminFilesMetricsDto {
  @ApiProperty({ example: 22 })
  total!: number;

  @ApiProperty({ example: 5 })
  recentlyUploaded!: number;
}

class AuditByModuleDto {
  @ApiProperty({ example: 'prescriptions' })
  module!: string;

  @ApiProperty({ example: 14 })
  total!: number;
}

class RecentAuditActivityDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'prescriptions' })
  module!: string;

  @ApiProperty({ example: 'CREATE' })
  action!: string;

  @ApiProperty({ example: 'Prescription' })
  entityName!: string;

  @ApiProperty({ example: '2026-07-16T10:00:00.000Z' })
  createdAt!: Date;
}

class AdminAuditMetricsDto {
  @ApiProperty({ example: 100 })
  total!: number;

  @ApiProperty({ type: [RecentAuditActivityDto] })
  recentActivities!: RecentAuditActivityDto[];

  @ApiProperty({ type: [AuditByModuleDto] })
  byModule!: AuditByModuleDto[];
}

class DailyIntakeEvolutionDto {
  @ApiProperty({ example: '2026-07-16' })
  date!: string;

  @ApiProperty({ example: 16 })
  completed!: number;

  @ApiProperty({ example: 3 })
  missed!: number;
}

class DailyUserRegistrationDto {
  @ApiProperty({ example: '2026-07-16' })
  date!: string;

  @ApiProperty({ example: 4 })
  total!: number;
}

class AdminChartsDto {
  @ApiProperty({ type: [DailyIntakeEvolutionDto] })
  adherenceEvolution!: DailyIntakeEvolutionDto[];

  @ApiProperty({ type: [DailyUserRegistrationDto] })
  userRegistrations!: DailyUserRegistrationDto[];
}

export class AdminDashboardResponseDto {
  @ApiProperty({ type: DashboardPeriodDto })
  period!: DashboardPeriodDto;

  @ApiProperty({ type: AdminUsersMetricsDto })
  users!: AdminUsersMetricsDto;

  @ApiProperty({ type: AdminPatientsMetricsDto })
  patients!: AdminPatientsMetricsDto;

  @ApiProperty({ type: AdminPrescriptionsMetricsDto })
  prescriptions!: AdminPrescriptionsMetricsDto;

  @ApiProperty({ type: AdminIntakesMetricsDto })
  intakes!: AdminIntakesMetricsDto;

  @ApiProperty({ type: AdminRemindersMetricsDto })
  reminders!: AdminRemindersMetricsDto;

  @ApiProperty({ type: AdminNotificationsMetricsDto })
  notifications!: AdminNotificationsMetricsDto;

  @ApiProperty({ type: AdminMeasurementsMetricsDto })
  medicalMeasurements!: AdminMeasurementsMetricsDto;

  @ApiProperty({ type: AdminFilesMetricsDto })
  files!: AdminFilesMetricsDto;

  @ApiProperty({ type: AdminAuditMetricsDto })
  audit!: AdminAuditMetricsDto;

  @ApiProperty({ type: AdminChartsDto })
  charts!: AdminChartsDto;
}
