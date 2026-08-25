import { Injectable } from '@nestjs/common';
import {
  Prisma,
  MedicationForm,
  MedicationRoute,
} from '../../../../../generated/prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { MedicationEntity } from '../../domain/entities/medication.entity';
import {
  FindAllMedicationsParams,
  MedicationsRepository,
} from '../../domain/interfaces/medications-repository.interface';
import { MedicationMapper } from '../mappers/medication.mapper';

// Adaptador Prisma que implementa el puerto de persistencia de medicamentos.
@Injectable()
export class PrismaMedicationsRepository implements MedicationsRepository {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param prisma Servicio que coordina las operaciones de prisma.
   */
  constructor(private readonly prisma: PrismaService) {}
  /**
   * Obtiene el listado de medicamentos que cumplen los filtros indicados.
   * @param params Valor de params requerido por la operacion.
   * @returns Promesa que resuelve con el resultado de la operación.
   */
  async findAll(
    params?: FindAllMedicationsParams,
  ): Promise<MedicationEntity[]> {
    const search = params?.search?.trim();

    const orConditions: Prisma.MedicationWhereInput[] = [];

    if (search) {
      // Busca texto libre en campos visibles del catalogo.
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

      // Tambien permite buscar por valores exactos de enums escritos como texto.
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
  /**
   * Crea un medicamento con los datos recibidos.
   * @param medication Valor de medication requerido por la operacion.
   * @returns Promesa que resuelve con el resultado de la operación.
   */
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
  /**
   * Actualiza un medicamento existente.
   * @param id Identificador único del recurso.
   * @param medication Valor de medication requerido por la operacion.
   * @returns Promesa que resuelve con el resultado de la operación.
   */
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

  /**
   * Elimina el recurso solicitado.
   * @param id Identificador único del recurso.
   * @returns Promesa que resuelve con el resultado de la operación.
   */
  async delete(id: number): Promise<MedicationEntity> {
    // Borrado logico: conserva el registro y lo oculta de vistas activas.
    const deletedMedication = await this.prisma.medication.update({
      where: { id },
      data: {
        isActive: false,
      },
    });

    return MedicationMapper.toDomain(deletedMedication);
  }

  /**
   * Obtiene un medicamento por su identificador.
   * @param id Identificador único del recurso.
   * @returns Promesa que resuelve con el resultado de la operación.
   */
  async findById(id: number): Promise<MedicationEntity | null> {
    const medication = await this.prisma.medication.findUnique({
      where: { id },
    });

    if (!medication) {
      return null;
    }

    return MedicationMapper.toDomain(medication);
  }
}
