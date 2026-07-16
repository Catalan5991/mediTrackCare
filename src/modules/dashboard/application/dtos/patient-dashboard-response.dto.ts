import { ApiProperty } from '@nestjs/swagger';

import { DashboardPeriod } from './dashboard-filter.dto';

// DTOs de respuesta del dashboard del paciente. La forma evita pedir patientId
// al cliente y documenta solo datos seguros del paciente autenticado.
class DashboardPeriodDto {
  @ApiProperty({ example: DashboardPeriod.THIRTY_DAYS })
  value!: DashboardPeriod;

  @ApiProperty({ example: '2026-06-17T00:00:00.000Z' })
  startDate!: Date;

  @ApiProperty({ example: '2026-07-16T23:59:59.999Z' })
  endDate!: Date;
}

class PatientIdentityDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'Ana Perez' })
  name!: string;
}

class PatientSummaryDto {
  @ApiProperty({ example: 2 })
  activePrescriptions!: number;

  @ApiProperty({ example: 4 })
  currentMedications!: number;

  @ApiProperty({ example: 3 })
  activeReminders!: number;

  @ApiProperty({ example: 18 })
  medicalMeasurements!: number;

  @ApiProperty({ example: 5 })
  unreadNotifications!: number;

  @ApiProperty({ example: '2026-07-16T18:00:00.000Z', nullable: true })
  nextIntakeAt!: Date | null;

  @ApiProperty({ example: '2026-07-15T09:00:00.000Z', nullable: true })
  lastMeasurementAt!: Date | null;
}

class PatientAdherenceDto {
  @ApiProperty({ example: 30 })
  scheduled!: number;

  @ApiProperty({ example: 24 })
  completed!: number;

  @ApiProperty({ example: 4 })
  pending!: number;

  @ApiProperty({ example: 2 })
  missed!: number;

  @ApiProperty({ example: 80 })
  percentage!: number;

  @ApiProperty({ example: 85.71 })
  last7DaysPercentage!: number;

  @ApiProperty({ example: 80 })
  last30DaysPercentage!: number;
}

class PatientNextIntakeDto {
  @ApiProperty({ example: 10 })
  intakeId!: number;

  @ApiProperty({ example: 'Metformina' })
  medicationName!: string;

  @ApiProperty({ example: '500 mg', required: false })
  dosage?: string;

  @ApiProperty({ example: '2026-07-16T18:00:00.000Z' })
  scheduledAt!: Date;

  @ApiProperty({ example: 'PENDIENTE' })
  status!: string;
}

class PatientCurrentMedicationDto {
  @ApiProperty({ example: 'Metformina' })
  medicationName!: string;

  @ApiProperty({ example: 'TABLETA' })
  presentation!: string;

  @ApiProperty({ example: '500 mg', nullable: true })
  concentration!: string | null;

  @ApiProperty({ example: '1 tableta' })
  dose!: string;

  @ApiProperty({ example: 'Cada 12 horas' })
  frequency!: string;

  @ApiProperty({ example: '2026-07-01T00:00:00.000Z' })
  startDate!: Date;

  @ApiProperty({ example: '2026-08-01T00:00:00.000Z', nullable: true })
  endDate!: Date | null;

  @ApiProperty({ example: 'ACTIVO' })
  prescriptionStatus!: string;
}

class PatientMeasurementDto {
  @ApiProperty({ example: 12 })
  id!: number;

  @ApiProperty({ example: 'GLUCOSA' })
  measurementType!: string;

  @ApiProperty({ example: 95 })
  value!: number;

  @ApiProperty({ example: 80, required: false, nullable: true })
  secondValue?: number | null;

  @ApiProperty({ example: 'mg/dL' })
  unit!: string;

  @ApiProperty({ example: '2026-07-15T09:00:00.000Z' })
  measuredAt!: Date;
}

class PatientReminderItemDto {
  @ApiProperty({ example: 6 })
  id!: number;

  @ApiProperty({ example: '08:00' })
  scheduledTime!: string;

  @ApiProperty({ example: '1,2,3,4,5', nullable: true })
  daysOfWeek!: string | null;

  @ApiProperty({ example: true })
  isActive!: boolean;
}

class PatientRemindersDto {
  @ApiProperty({ example: 8 })
  total!: number;

  @ApiProperty({ example: 5 })
  active!: number;

  @ApiProperty({ example: 3 })
  inactive!: number;

  @ApiProperty({ type: [PatientReminderItemDto] })
  upcoming!: PatientReminderItemDto[];
}

class PatientNotificationItemDto {
  @ApiProperty({ example: 4 })
  id!: number;

  @ApiProperty({ example: 'Recordatorio de toma' })
  title!: string;

  @ApiProperty({ example: 'Tienes una toma programada.' })
  message!: string;

  @ApiProperty({ example: 'PENDIENTE' })
  status!: string;

  @ApiProperty({ example: '2026-07-16T10:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: null, nullable: true })
  readAt!: Date | null;
}

class PatientNotificationsDto {
  @ApiProperty({ example: 20 })
  total!: number;

  @ApiProperty({ example: 6 })
  pending!: number;

  @ApiProperty({ example: 8 })
  unread!: number;

  @ApiProperty({ type: [PatientNotificationItemDto] })
  recent!: PatientNotificationItemDto[];

  @ApiProperty({ example: '2026-07-16T10:00:00.000Z', nullable: true })
  latestNotificationAt!: Date | null;
}

class DailyIntakeEvolutionDto {
  @ApiProperty({ example: '2026-07-16' })
  date!: string;

  @ApiProperty({ example: 2 })
  completed!: number;

  @ApiProperty({ example: 1 })
  missed!: number;
}

class MeasurementEvolutionDto {
  @ApiProperty({ example: '2026-07-16' })
  date!: string;

  @ApiProperty({ example: 'GLUCOSA' })
  measurementType!: string;

  @ApiProperty({ example: 95 })
  value!: number;

  @ApiProperty({ example: null, required: false, nullable: true })
  secondValue?: number | null;

  @ApiProperty({ example: 'mg/dL' })
  unit!: string;
}

class PatientChartsDto {
  @ApiProperty({ type: [DailyIntakeEvolutionDto] })
  intakeEvolution!: DailyIntakeEvolutionDto[];

  @ApiProperty({ type: [MeasurementEvolutionDto] })
  measurementsEvolution!: MeasurementEvolutionDto[];
}

class DashboardAlertDto {
  @ApiProperty({ example: 'LOW_ADHERENCE' })
  type!: string;

  @ApiProperty({ example: 'WARNING' })
  severity!: string;

  @ApiProperty({ example: 'Adherencia por debajo del objetivo' })
  title!: string;

  @ApiProperty({ example: 'Tu adherencia de los ultimos 7 dias es del 65%.' })
  message!: string;
}

export class PatientDashboardResponseDto {
  @ApiProperty({ type: DashboardPeriodDto })
  period!: DashboardPeriodDto;

  @ApiProperty({ type: PatientIdentityDto })
  patient!: PatientIdentityDto;

  @ApiProperty({ type: PatientSummaryDto })
  summary!: PatientSummaryDto;

  @ApiProperty({ type: PatientAdherenceDto })
  adherence!: PatientAdherenceDto;

  @ApiProperty({ type: [PatientNextIntakeDto] })
  nextIntakes!: PatientNextIntakeDto[];

  @ApiProperty({ type: [PatientCurrentMedicationDto] })
  currentMedications!: PatientCurrentMedicationDto[];

  @ApiProperty({ type: [PatientMeasurementDto] })
  recentMeasurements!: PatientMeasurementDto[];

  @ApiProperty({ type: PatientRemindersDto })
  reminders!: PatientRemindersDto;

  @ApiProperty({ type: PatientNotificationsDto })
  notifications!: PatientNotificationsDto;

  @ApiProperty({ type: PatientChartsDto })
  charts!: PatientChartsDto;

  @ApiProperty({ type: [DashboardAlertDto] })
  alerts!: DashboardAlertDto[];
}
