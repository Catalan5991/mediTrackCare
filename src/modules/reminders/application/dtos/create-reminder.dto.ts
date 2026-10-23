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
  Max,
} from 'class-validator';

// Define y valida los datos requeridos para registrar un recordatorio.
export class CreateReminderDto {
  @ApiPropertyOptional({ minimum: 0, maximum: 1440 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(1440)
  advanceMinutes?: number;
  @ApiPropertyOptional({ minimum: 1, maximum: 1440 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(1440)
  repeatMinutes?: number;
  @ApiPropertyOptional({ minimum: 0, maximum: 5 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(5)
  repeatCount?: number;
  @ApiPropertyOptional({
    description: 'Avisar solo a cuidadores activos con permiso de seguimiento.',
  })
  @IsOptional()
  @IsBoolean()
  notifyCaregiver?: boolean;
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
