import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DoctorResponseDto {
  @ApiProperty({ enum: ['PENDING', 'VERIFIED', 'REJECTED'] })
  verificationStatus!: string;
  @ApiPropertyOptional({ nullable: true }) verifiedAt!: Date | null;
  @ApiProperty() id!: number;
  @ApiProperty() userId!: number;
  @ApiProperty() fullName!: string;
  @ApiPropertyOptional({ nullable: true }) professionalLicense!: string | null;
  @ApiPropertyOptional({ nullable: true }) specialty!: string | null;
  @ApiPropertyOptional({ nullable: true }) phone!: string | null;
  @ApiPropertyOptional({ nullable: true }) email!: string | null;
  @ApiProperty() isActive!: boolean;
  @ApiProperty() createdAt!: Date;
  @ApiProperty() updatedAt!: Date;
}

export class PaginatedDoctorsResponseDto {
  @ApiProperty({ type: [DoctorResponseDto] }) data!: DoctorResponseDto[];
  @ApiProperty() total!: number;
  @ApiProperty() page!: number;
  @ApiProperty() limit!: number;
  @ApiProperty() lastPage!: number;
}
