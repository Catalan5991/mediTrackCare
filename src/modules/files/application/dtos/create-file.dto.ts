import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateFileDto {
  @ApiPropertyOptional({ example: 1, nullable: true })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  patientId?: number | null;

  @ApiPropertyOptional({ example: 1, nullable: true })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  prescriptionId?: number | null;

  @ApiPropertyOptional({ example: 1, nullable: true })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  medicationId?: number | null;

  @ApiProperty({ example: 'receta-julio.pdf' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  fileName!: string;

  @ApiProperty({ example: 'https://cdn.example.com/receta-julio.pdf' })
  @IsString()
  @IsNotEmpty()
  @IsUrl({ require_tld: false })
  @MaxLength(2048)
  fileUrl!: string;

  @ApiProperty({ example: 'application/pdf' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  fileType!: string;

  @ApiPropertyOptional({ example: 'Receta emitida en julio.', nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string | null;
}
