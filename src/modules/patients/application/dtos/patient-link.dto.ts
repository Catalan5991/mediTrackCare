import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
export enum LinkKind {
  CAREGIVER = 'CAREGIVER',
  DOCTOR = 'DOCTOR',
}
export class RequestPatientLinkDto {
  @ApiProperty() @IsInt() @Min(1) patientId!: number;
  @ApiProperty({ enum: LinkKind }) @IsEnum(LinkKind) kind!: LinkKind;
  @ApiProperty({
    description: 'Usuario cuidador o medico; nunca el id del perfil.',
  })
  @IsInt()
  @Min(1)
  userId!: number;
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(80)
  relationship?: string;
}
export class DecidePatientLinkDto {
  @ApiProperty({ enum: ['ACTIVE', 'REJECTED', 'REVOKED'] })
  @IsEnum({ ACTIVE: 'ACTIVE', REJECTED: 'REJECTED', REVOKED: 'REVOKED' })
  status!: 'ACTIVE' | 'REJECTED' | 'REVOKED';
  @ApiPropertyOptional() @IsOptional() @IsBoolean() canRead?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() canTrack?: boolean;
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  canManageReminders?: boolean;
}
export class VerifyDoctorDto {
  @ApiProperty({ enum: ['VERIFIED', 'REJECTED', 'PENDING'] })
  @IsEnum({ VERIFIED: 'VERIFIED', REJECTED: 'REJECTED', PENDING: 'PENDING' })
  status!: 'VERIFIED' | 'REJECTED' | 'PENDING';
  @ApiProperty({
    description:
      'Referencia de la revision profesional realizada por administracion.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  reason!: string;
}
