import { PatientAccessService } from '../../../../common/authorization/patient-access.service';
import { Injectable, BadRequestException } from '@nestjs/common';
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
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param prisma Servicio que coordina las operaciones de prisma.
   */
  constructor(
    private readonly prisma: PrismaService,
    private readonly access: PatientAccessService,
  ) {}
  private async checkRelations(
    data: { patientId?: number | null; prescriptionId?: number | null },
    write = false,
  ) {
    if (data.prescriptionId) {
      const prescription = await this.prisma.prescription.findUniqueOrThrow({
        where: { id: data.prescriptionId },
      });
      if (data.patientId && data.patientId !== prescription.patientId)
        throw new BadRequestException(
          'El archivo y la receta deben pertenecer al mismo paciente.',
        );
      data.patientId = prescription.patientId;
    }
    if (data.patientId)
      await this.access.assert(data.patientId, write ? 'track' : 'read');
    else this.access.admin();
  }
  /**
   * Crea un archivo con los datos recibidos.
   * @param data Valor de data requerido por la operacion.
   * @returns Promesa que resuelve con el resultado de la operación.
   */
  async create(data: CreateFileData): Promise<FileEntity> {
    await this.checkRelations(data, true);
    return FileMapper.toEntity(
      await this.prisma.file.create({ data: FileMapper.toPrismaCreate(data) }),
    );
  }
  /**
   * Obtiene el listado de archivos que cumplen los filtros indicados.
   * @param filters Valor de filters requerido por la operacion.
   * @returns Promesa que resuelve con el resultado de la operación.
   */
  async findAll(filters: FileFilters): Promise<PaginatedFiles> {
    const page = Math.max(filters.page ?? 1, 1);
    const limit = Math.min(Math.max(filters.limit ?? 10, 1), 100);
    const where: Prisma.FileWhereInput =
      this.access.actor().role.toUpperCase() === 'ADMIN'
        ? {}
        : {
            OR: [
              { patient: await this.access.patientWhere() },
              { prescription: { patient: await this.access.patientWhere() } },
            ],
          };
    if (filters.patientId !== undefined) where.patientId = filters.patientId;
    if (filters.prescriptionId !== undefined)
      where.prescriptionId = filters.prescriptionId;
    if (filters.medicationId !== undefined)
      where.medicationId = filters.medicationId;
    if (filters.fileType !== undefined)
      where.fileType = { equals: filters.fileType, mode: 'insensitive' };
    if (filters.search) {
      where.AND = [
        {
          OR: [
            { fileName: { contains: filters.search, mode: 'insensitive' } },
            { description: { contains: filters.search, mode: 'insensitive' } },
          ],
        },
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
  /**
   * Actualiza un archivo existente.
   * @param id Identificador único del recurso.
   * @param data Valor de data requerido por la operacion.
   * @returns Promesa que resuelve con el resultado de la operación.
   */
  async update(id: number, data: UpdateFileData): Promise<FileEntity> {
    const old = await this.prisma.file.findUniqueOrThrow({ where: { id } });
    await this.checkRelations(old, true);
    await this.checkRelations({ ...old, ...data }, true);
    return FileMapper.toEntity(
      await this.prisma.file.update({
        where: { id },
        data: FileMapper.toPrismaUpdate(data),
      }),
    );
  }
  /**
   * Obtiene missing relation.
   * @param relations Valor de relations requerido por la operacion.
   * @returns Promesa que resuelve con el resultado de la operación.
   */
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

  /**
   * Obtiene un archivo por su identificador.
   * @param id Identificador único del recurso.
   * @returns Promesa que resuelve con el resultado de la operación.
   */
  async findById(id: number): Promise<FileEntity | null> {
    const file = await this.prisma.file.findUnique({ where: { id } });
    if (file) await this.checkRelations(file);
    return file ? FileMapper.toEntity(file) : null;
  }

  /**
   * Elimina un archivo por su identificador.
   * @param id Identificador único del recurso.
   * @returns No retorna ningún valor.
   */
  async delete(id: number): Promise<void> {
    this.access.admin();
    await this.prisma.file.delete({ where: { id } });
  }
}
