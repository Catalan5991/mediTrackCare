import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AuditLogResponseDto {
  @ApiProperty({ example: 1 }) id!: number;
  @ApiPropertyOptional({ example: 1, nullable: true }) userId!: number | null;
  @ApiProperty({ example: 'prescriptions' }) module!: string;
  @ApiProperty({ example: 'CREATE' }) action!: string;
  @ApiProperty({ example: 'Prescription' }) entityName!: string;
  @ApiPropertyOptional({ example: 15, nullable: true }) entityId!:
    | number
    | null;
  @ApiPropertyOptional({ nullable: true }) description!: string | null;
  @ApiProperty({ example: '2026-07-16T12:00:00.000Z' }) createdAt!: Date;
}

export class PaginatedAuditLogsResponseDto {
  @ApiProperty({ type: [AuditLogResponseDto] }) data!: AuditLogResponseDto[];
  @ApiProperty({ example: 30 }) total!: number;
  @ApiProperty({ example: 1 }) page!: number;
  @ApiProperty({ example: 10 }) limit!: number;
  @ApiProperty({ example: 3 }) totalPages!: number;
}
