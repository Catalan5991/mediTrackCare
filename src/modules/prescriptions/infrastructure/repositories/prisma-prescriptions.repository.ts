import { Injectable } from '@nestjs/common';
import {
  Prisma,
  PrescriptionStatus,
} from '../../../../../generated/prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  CreatePrescriptionInput,
  FindPrescriptionsFilters,
  PaginatedPrescriptions,
  PrescriptionRepository,
  UpdatePrescriptionInput,
} from '../../domain/interfaces/prescription-repository.interface';
import { PrescriptionEntity } from '../../domain/entities/prescription.entity';
import { PrismaPrescriptionMapper } from '../mappers/prisma-prescription.mapper';

@Injectable()
// Persistencia de recetas usando Prisma como fuente de datos.
export class PrismaPrescriptionsRepository implements PrescriptionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreatePrescriptionInput): Promise<PrescriptionEntity> {
    // Crea la receta y sus items en una sola operacion anidada.
    const prescription = await this.prisma.prescription.create({
      data: {
        patientId: data.patientId,
        doctorId: data.doctorId,
        diagnosis: data.diagnosis,
        notes: data.generalInstructions,
        startDate: data.issueDate ?? new Date(),
        endDate: data.expirationDate,
        status: PrescriptionStatus.ACTIVO,
        items: {
          createMany: {
            data: data.items.map((item) => ({
              medicationId: item.medicationId,
              dose: item.dose,
              frequency: item.frequency,
              instructions: item.instructions,
              startDate: item.startDate ?? data.issueDate ?? new Date(),
              endDate: item.endDate,
            })),
          },
        },
      },
      include: {
        items: true,
      },
    });

    return PrismaPrescriptionMapper.toDomain(prescription);
  }

  async findAll(
    filters: FindPrescriptionsFilters,
  ): Promise<PaginatedPrescriptions> {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 10;
    const skip = (page - 1) * limit;

    // Construye filtros dinamicos para busqueda, paciente, doctor y estado.
    const where: Prisma.PrescriptionWhereInput = {
      patientId: filters.patientId,
      doctorId: filters.doctorId,
      status: filters.status,
      OR: filters.search
        ? [
            {
              diagnosis: {
                contains: filters.search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              notes: {
                contains: filters.search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
          ]
        : undefined,
    };

    // Ejecuta conteo y consulta en paralelo para devolver metadatos de paginacion.
    const [total, prescriptions] = await Promise.all([
      this.prisma.prescription.count({ where }),
      this.prisma.prescription.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          items: true,
        },
      }),
    ]);

    return {
      data: prescriptions.map(PrismaPrescriptionMapper.toDomain),
      total,
      page,
      limit,
    };
  }

  async findById(id: number): Promise<PrescriptionEntity | null> {
    const prescription = await this.prisma.prescription.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });

    if (!prescription) {
      return null;
    }

    return PrismaPrescriptionMapper.toDomain(prescription);
  }

  async update(
    id: number,
    data: UpdatePrescriptionInput,
  ): Promise<PrescriptionEntity> {
    // Si llegan medicamentos, se reemplaza la lista completa dentro de una transaccion.
    const prescription = await this.prisma.$transaction(async (tx) => {
      if (data.items) {
        await tx.prescriptionItem.deleteMany({
          where: {
            prescriptionId: id,
          },
        });
      }

      return tx.prescription.update({
        where: { id },
        data: {
          patientId: data.patientId,
          doctorId: data.doctorId,
          diagnosis: data.diagnosis,
          notes: data.generalInstructions,
          startDate: data.issueDate,
          endDate: data.expirationDate,
          status: data.status,
          items: data.items
            ? {
                createMany: {
                  data: data.items.map((item) => ({
                    medicationId: item.medicationId,
                    dose: item.dose,
                    frequency: item.frequency,
                    instructions: item.instructions,
                    startDate: item.startDate ?? data.issueDate ?? new Date(),
                    endDate: item.endDate,
                  })),
                },
              }
            : undefined,
        },
        include: {
          items: true,
        },
      });
    });

    return PrismaPrescriptionMapper.toDomain(prescription);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.$transaction(async (transaction) => {
      await transaction.prescriptionItem.deleteMany({
        where: { prescriptionId: id },
      });
      await transaction.prescription.delete({
        where: { id },
      });
    });
  }
}
