import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class AgendaSummaryDto {
  @ApiProperty() scheduled!: number;
  @ApiProperty() due!: number;
  @ApiProperty() confirmed!: number;
  @ApiProperty() omitted!: number;
  @ApiProperty({
    description: 'Tomas vencidas sin resolucion; no son omisiones confirmadas.',
  })
  pending!: number;
  @ApiProperty() cancelled!: number;
  @ApiProperty({
    nullable: true,
    description: 'Confirmadas / tomas vencidas no canceladas.',
  })
  confirmedRate!: number | null;
  @ApiProperty({
    nullable: true,
    description: 'Confirmadas / (confirmadas + omisiones explicitas).',
  })
  resolvedAdherence!: number | null;
}
export class AgendaEntryDto {
  @ApiProperty({
    nullable: true,
    description: 'null para ocurrencias calculadas que aun no se materializan.',
  })
  id!: number | null;
  @ApiProperty() occurrenceKey!: string;
  @ApiProperty() patientId!: number;
  @ApiProperty() prescriptionItemId!: number;
  @ApiProperty({ type: Object }) medication!: object;
  @ApiProperty() dose!: string;
  @ApiProperty() frequency!: string;
  @ApiProperty() scheduledAt!: Date;
  @ApiProperty({ nullable: true }) takenAt!: Date | null;
  @ApiProperty({
    enum: ['PENDIENTE', 'RETRASADA', 'TOMADA', 'OMITIDA', 'CANCELADA'],
  })
  status!: string;
  @ApiProperty({ type: Object, nullable: true }) prescriptionSnapshot!:
    | object
    | null;
}
export class PatientAgendaResponseDto {
  @ApiProperty() patientId!: number;
  @ApiProperty() timeZone!: string;
  @ApiProperty() from!: string;
  @ApiProperty() toExclusive!: string;
  @ApiProperty({ type: [AgendaEntryDto] }) data!: AgendaEntryDto[];
  @ApiProperty() total!: number;
  @ApiProperty() page!: number;
  @ApiProperty() limit!: number;
  @ApiProperty({ type: AgendaSummaryDto }) summary!: AgendaSummaryDto;
  @ApiProperty({
    type: Object,
    description: 'Mapa YYYY-MM-DD a AgendaSummary.',
  })
  dailySummary!: Record<string, AgendaSummaryDto>;
}
export class PatientMedicationDto {
  @ApiProperty() id!: number;
  @ApiProperty() prescriptionId!: number;
  @ApiProperty() medicationId!: number;
  @ApiProperty({ type: Object }) medication!: object;
  @ApiProperty({ type: Object }) prescription!: object;
  @ApiProperty() dose!: string;
  @ApiPropertyOptional({ nullable: true }) doseUnit?: string | null;
  @ApiProperty() frequency!: string;
  @ApiProperty({ type: [String] }) scheduledTimes!: string[];
  @ApiProperty({ type: [Number] }) daysOfWeek!: number[];
  @ApiProperty() timeZone!: string;
  @ApiProperty() isActive!: boolean;
  @ApiProperty() startDate!: Date;
  @ApiProperty({ nullable: true }) endDate!: Date | null;
  @ApiProperty({ nullable: true }) nextIntake!: Date | null;
  @ApiProperty({ nullable: true }) retiredAt!: Date | null;
  @ApiProperty({ nullable: true }) effectiveFrom!: Date | null;
  @ApiProperty({ nullable: true }) patientConfirmedAt!: Date | null;
  @ApiProperty({ type: [Object] }) reminders!: object[];
}
export class PatientMedicationsResponseDto {
  @ApiProperty({ type: [PatientMedicationDto] }) data!: PatientMedicationDto[];
  @ApiProperty() total!: number;
  @ApiProperty() page!: number;
  @ApiProperty() limit!: number;
}
export class PatientLinkDto {
  @ApiProperty() patientId!: number;
  @ApiProperty({ enum: ['PENDING', 'ACTIVE', 'REJECTED', 'REVOKED'] })
  status!: string;
  @ApiProperty() isActive!: boolean;
  @ApiProperty() requestedAt!: Date;
  @ApiProperty({ nullable: true }) acceptedAt!: Date | null;
  @ApiProperty({ nullable: true }) requestedByUserId!: number | null;
  @ApiProperty() canRead!: boolean;
  @ApiProperty() canTrack!: boolean;
  @ApiProperty() canManageReminders!: boolean;
  @ApiPropertyOptional() id?: number;
  @ApiPropertyOptional() userId?: number;
  @ApiPropertyOptional() doctorId?: number;
  @ApiPropertyOptional() relationship?: string;
  @ApiPropertyOptional({ type: Object }) patient?: object;
  @ApiPropertyOptional({ type: Object }) user?: object;
  @ApiPropertyOptional({ type: Object }) doctor?: object;
}
export class PatientLinksResponseDto {
  @ApiProperty({ type: [PatientLinkDto] }) caregivers!: PatientLinkDto[];
  @ApiProperty({ type: [PatientLinkDto] }) doctors!: PatientLinkDto[];
}
