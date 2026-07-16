import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../../../generated/prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { FileEntity } from '../../domain/entities/file.entity';
import {
  CreateFileData,
  FileFilters,
  FileRelations,
  IFilesRepository,
  PaginatedFiles,
  UpdateFileData,
} from '../../domain/interfaces/files.repository.interface';
import { FileMapper } from '../mappers/file.mapper';

@Injectable()
export class PrismaFilesRepository implements IFilesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateFileData): Promise<FileEntity> {
    return FileMapper.toEntity(
      await this.prisma.file.create({ data: FileMapper.toPrismaCreate(data) }),
    );
  }

  async findAll(filters: FileFilters): Promise<PaginatedFiles> {
    const page = Math.max(filters.page ?? 1, 1);
    const limit = Math.min(Math.max(filters.limit ?? 10, 1), 100);
    const where: Prisma.FileWhereInput = {};
    if (filters.patientId !== undefined) where.patientId = filters.patientId;
    if (filters.prescriptionId !== undefined)
      where.prescriptionId = filters.prescriptionId;
    if (filters.medicationId !== undefined)
      where.medicationId = filters.medicationId;
    if (filters.fileType !== undefined)
      where.fileType = { equals: filters.fileType, mode: 'insensitive' };
    if (filters.search) {
      where.OR = [
        { fileName: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }
    if (filters.dateFrom || filters.dateTo)
      where.createdAt = { gte: filters.dateFrom, lte: filters.dateTo };

    const [files, total] = await this.prisma.$transaction([
      this.prisma.file.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.file.count({ where }),
    ]);
    return {
      data: files.map((file) => FileMapper.toEntity(file)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: number): Promise<FileEntity | null> {
    const file = await this.prisma.file.findUnique({ where: { id } });
    return file ? FileMapper.toEntity(file) : null;
  }

  async update(id: number, data: UpdateFileData): Promise<FileEntity> {
    return FileMapper.toEntity(
      await this.prisma.file.update({
        where: { id },
        data: FileMapper.toPrismaUpdate(data),
      }),
    );
  }

  async delete(id: number): Promise<void> {
    await this.prisma.file.delete({ where: { id } });
  }

  async findMissingRelation(relations: FileRelations): Promise<string | null> {
    if (
      relations.patientId != null &&
      !(await this.prisma.patient.findUnique({
        where: { id: relations.patientId },
        select: { id: true },
      }))
    )
      return `patientId ${relations.patientId}`;
    if (
      relations.prescriptionId != null &&
      !(await this.prisma.prescription.findUnique({
        where: { id: relations.prescriptionId },
        select: { id: true },
      }))
    )
      return `prescriptionId ${relations.prescriptionId}`;
    if (
      relations.medicationId != null &&
      !(await this.prisma.medication.findUnique({
        where: { id: relations.medicationId },
        select: { id: true },
      }))
    )
      return `medicationId ${relations.medicationId}`;
    return null;
  }
}
