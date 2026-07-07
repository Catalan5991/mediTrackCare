import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';

// Define y valida los datos requeridos para registrar un recordatorio.
export class CreateReminderDto {
  @ApiProperty({
    example: 1,
    description: 'ID del paciente al que pertenece el recordatorio.',
  })
  @IsInt()
  @Min(1)
  patientId!: number;

  @ApiProperty({
    example: 3,
    description: 'ID del item de receta asociado al recordatorio.',
  })
  @IsInt()
  @Min(1)
  prescriptionItemId!: number;

  @ApiProperty({
    example: '08:00',
    description: 'Hora programada del recordatorio en formato HH:mm.',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'scheduledTime debe tener formato HH:mm.',
  })
  scheduledTime!: string;

  @ApiPropertyOptional({
    example: 'MON,TUE,WED,THU,FRI',
    description:
      'Dias de la semana en los que aplica el recordatorio. Puede guardarse como lista separada por comas.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  daysOfWeek?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Indica si el recordatorio esta activo.',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
