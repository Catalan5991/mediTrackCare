import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FileResponseDto {
  @ApiProperty() id!: number;
  @ApiPropertyOptional({ nullable: true }) patientId!: number | null;
  @ApiPropertyOptional({ nullable: true }) prescriptionId!: number | null;
  @ApiPropertyOptional({ nullable: true }) medicationId!: number | null;
  @ApiProperty() fileName!: string;
  @ApiProperty() fileUrl!: string;
  @ApiProperty() fileType!: string;
  @ApiPropertyOptional({ nullable: true }) description!: string | null;
  @ApiProperty() createdAt!: Date;
}

export class PaginatedFilesResponseDto {
  @ApiProperty({ type: [FileResponseDto] }) data!: FileResponseDto[];
  @ApiProperty() total!: number;
  @ApiProperty() page!: number;
  @ApiProperty() limit!: number;
  @ApiProperty() totalPages!: number;
}
