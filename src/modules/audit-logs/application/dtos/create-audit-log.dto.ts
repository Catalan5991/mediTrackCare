import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateAuditLogDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'Usuario que realizó la acción.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  userId?: number;

  @ApiProperty({ example: 'prescriptions' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  module!: string;

  @ApiProperty({ example: 'CREATE' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  action!: string;

  @ApiProperty({ example: 'Prescription' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  entityName!: string;

  @ApiPropertyOptional({ example: 15 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  entityId?: number;

  @ApiPropertyOptional({ example: 'Se creó una prescripción.' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;
}
