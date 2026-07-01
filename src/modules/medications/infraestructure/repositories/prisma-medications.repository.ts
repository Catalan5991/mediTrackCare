import { Injectable } from '@nestjs/common';
import { Prisma, MedicationForm, MedicationRoute } from '../../../../../generated/prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { MedicationEntity } from '../../domain/entities/medication.entity';
import { FindAllMedicationsParams,MedicationsRepository } from '../../domain/interfaces/medications-repository.interface';
import { MedicationMapper } from '../mappers/medication.mapper';
 
@Injectable()
export class PrismaMedicationsRepository implements MedicationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    params?: FindAllMedicationsParams,
  ): Promise<MedicationEntity[]> {
    const search = params?.search?.trim();

    const orConditions: Prisma.MedicationWhereInput[] = [];

    if (search) {
      orConditions.push(
        {
          name: {
            contains: search,
            mode: Prisma.QueryMode.insensitive,
          },
        },
        {
          description: {
            contains: search,
            mode: Prisma.QueryMode.insensitive,
          },
        },
        {
          concentration: {
            contains: search,
            mode: Prisma.QueryMode.insensitive,
          },
        },
        {
          unit: {
            contains: search,
            mode: Prisma.QueryMode.insensitive,
          },
        },
      );

      const normalizedSearch = search.toUpperCase();

      if (
        Object.values(MedicationForm).includes(
          normalizedSearch as MedicationForm,
        )
      ) {
        orConditions.push({
          presentation: normalizedSearch as MedicationForm,
        });
      }

      if (
        Object.values(MedicationRoute).includes(
          normalizedSearch as MedicationRoute,
        )
      ) {
        orConditions.push({
          route: normalizedSearch as MedicationRoute,
        });
      }
    }

    const where: Prisma.MedicationWhereInput = {
      isActive: params?.isActive,
      OR: orConditions.length > 0 ? orConditions : undefined,
    };

    const medications = await this.prisma.medication.findMany({
      where,
      orderBy: {
        name: 'asc',
      },
    });

    return medications.map(MedicationMapper.toDomain);
  }

  async create(medication: MedicationEntity): Promise<MedicationEntity> {
    const createdMedication = await this.prisma.medication.create({
      data: {
        name: medication.name,
        description: medication.description,
        presentation: medication.presentation,
        concentration: medication.concentration,
        unit: medication.unit,
        route: medication.route,
        isActive: medication.isActive,
      },
    });

    return MedicationMapper.toDomain(createdMedication);
  }

  async findById(id: number): Promise<MedicationEntity | null> {
    const medication = await this.prisma.medication.findUnique({
      where: { id },
    });

    if (!medication) {
      return null;
    }

    return MedicationMapper.toDomain(medication);
  }

  async update(
    id: number,
    medication: Partial<MedicationEntity>,
  ): Promise<MedicationEntity> {
    const updatedMedication = await this.prisma.medication.update({
      where: { id },
      data: {
        name: medication.name,
        description: medication.description,
        presentation: medication.presentation,
        concentration: medication.concentration,
        unit: medication.unit,
        route: medication.route,
        isActive: medication.isActive,
      },
    });

    return MedicationMapper.toDomain(updatedMedication);
  }

  async delete(id: number): Promise<MedicationEntity> {
    const deletedMedication = await this.prisma.medication.update({
      where: { id },
      data: {
        isActive: false,
      },
    });

    return MedicationMapper.toDomain(deletedMedication);
  }
}