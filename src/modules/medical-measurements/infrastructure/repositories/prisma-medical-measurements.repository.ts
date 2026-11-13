import { PatientAccessService } from '../../../../common/authorization/patient-access.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '../../../../../generated/prisma/client';

import { PrismaService } from '../../../prisma/prisma.service';
import { CreateMedicalMeasurementDto } from '../../application/dtos/create-medical-measurement.dto';
import { UpdateMedicalMeasurementDto } from '../../application/dtos/update-medical-measurement.dto';
import { FindMedicalMeasurementsDto } from '../../application/dtos/find-medical-measurements.dto';
import {
  MedicalMeasurementsPaginatedResponse,
  MedicalMeasurementsRepository,
} from '../../domain/interfaces/medical-measurements.repository.interface';
import { MedicalMeasurementEntity } from '../../domain/entities/medical-measurement.entity';
import { MedicalMeasurementMapper } from '../mappers/medical-measurement.mapper';

@Injectable()
// Implementacion del contrato de repositorio usando Prisma como fuente de datos.
export class PrismaMedicalMeasurementsRepository implements MedicalMeasurementsRepository {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param prisma Servicio que coordina las operaciones de prisma.
   */
  constructor(
    private readonly prisma: PrismaService,
    private readonly access: PatientAccessService,
  ) {}
  /**
   * Crea un medicion medica con los datos recibidos.
   * @param data Datos de data validados para la operacion.
   * @returns Promesa que resuelve con el resultado de la operación.
   */
  async create(
    data: CreateMedicalMeasurementDto,
  ): Promise<MedicalMeasurementEntity> {
    await this.access.assert(data.patientId, 'track');
    data.registeredByUserId = this.access.actor().id;
    try {
      // Los numeros decimales se guardan con Prisma.Decimal para evitar perdida.
      const measurement = await this.prisma.medicalMeasurement.create({
        data: {
          patientId: data.patientId,
          registeredByUserId: data.registeredByUserId ?? null,
          measurementType: data.measurementType,
          value: new Prisma.Decimal(data.value),
          secondValue:
            data.secondValue !== undefined
              ? new Prisma.Decimal(data.secondValue)
              : null,
          unit: data.unit,
          notes: data.notes ?? null,
          measuredAt: new Date(data.measuredAt),
        },
      });

      return MedicalMeasurementMapper.fromPrisma(measurement);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }
  /**
   * Obtiene el listado de medicion medicas que cumplen los filtros indicados.
   * @param filters Datos de filters validados para la operacion.
   * @returns Promesa que resuelve con el resultado de la operación.
   */
  async findAll(
    filters: FindMedicalMeasurementsDto,
  ): Promise<MedicalMeasurementsPaginatedResponse> {
    // Paginacion basada en page/limit para mantener estable la respuesta.
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.MedicalMeasurementWhereInput = {
      patient: await this.access.patientWhere(),
    };

    // Construye el where incrementalmente solo con filtros presentes.
    if (filters.patientId) {
      where.patientId = filters.patientId;
    }

    if (filters.registeredByUserId) {
      where.registeredByUserId = filters.registeredByUserId;
    }

    if (filters.measurementType) {
      where.measurementType = filters.measurementType;
    }

    if (filters.dateFrom || filters.dateTo) {
      where.measuredAt = {};

      if (filters.dateFrom) {
        where.measuredAt.gte = new Date(filters.dateFrom);
      }

      if (filters.dateTo) {
        where.measuredAt.lte = new Date(filters.dateTo);
      }
    }

    // Consulta y conteo via transaccion para que ambos usen el mismo filtro.
    const [measurements, total] = await this.prisma.$transaction([
      this.prisma.medicalMeasurement.findMany({
        where,
        orderBy: {
          measuredAt: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.medicalMeasurement.count({
        where,
      }),
    ]);

    return {
      data: measurements.map(MedicalMeasurementMapper.fromPrisma),
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      },
    };
  }
  /**
   * Actualiza un medicion medica existente.
   * @param id Identificador único del recurso.
   * @param data Datos de data validados para la operacion.
   * @returns Promesa que resuelve con el resultado de la operación.
   */
  async update(
    id: number,
    data: UpdateMedicalMeasurementDto,
  ): Promise<MedicalMeasurementEntity> {
    try {
      // Evita enviar campos undefined para no sobrescribir datos existentes.
      await this.access.resource('medicalMeasurement', id, 'track');
      if (data.patientId !== undefined)
        await this.access.assert(data.patientId, 'track');
      data.registeredByUserId = this.access.actor().id;
      const updateData: Prisma.MedicalMeasurementUncheckedUpdateInput = {};

      if (data.patientId !== undefined) {
        updateData.patientId = data.patientId;
      }

      if (data.registeredByUserId !== undefined) {
        updateData.registeredByUserId = data.registeredByUserId;
      }

      if (data.measurementType !== undefined) {
        updateData.measurementType = data.measurementType;
      }

      if (data.value !== undefined) {
        updateData.value = new Prisma.Decimal(data.value);
      }

      if (data.secondValue !== undefined) {
        updateData.secondValue = new Prisma.Decimal(data.secondValue);
      }

      if (data.unit !== undefined) {
        updateData.unit = data.unit;
      }

      if (data.notes !== undefined) {
        updateData.notes = data.notes;
      }

      if (data.measuredAt !== undefined) {
        updateData.measuredAt = new Date(data.measuredAt);
      }

      const measurement = await this.prisma.medicalMeasurement.update({
        where: { id },
        data: updateData,
      });

      return MedicalMeasurementMapper.fromPrisma(measurement);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }
  /**
   * Ejecuta la operación handle prisma error.
   * @param error Valor de error requerido por la operacion.
   * @returns Resultado producido por la operación.
   * @throws {BadRequestException} Cuando los datos o el estado incumplen la regla de negocio validada.
   * @throws {Error} Cuando los datos o el estado incumplen la regla de negocio validada.
   */
  private handlePrismaError(error: unknown): never {
    // Traduce errores conocidos de Prisma a excepciones HTTP entendibles.
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003') {
        throw new BadRequestException(
          'No existe el paciente o el usuario relacionado con la medición médica.',
        );
      }

      if (error.code === 'P2025') {
        throw new BadRequestException(
          'No se pudo completar la operación porque el registro no existe.',
        );
      }
    }

    throw error;
  }

  /**
   * Obtiene un medicion medica por su identificador.
   * @param id Identificador único del recurso.
   * @returns Promesa que resuelve con el resultado de la operación.
   */
  async findById(id: number): Promise<MedicalMeasurementEntity | null> {
    await this.access.resource('medicalMeasurement', id);
    const measurement = await this.prisma.medicalMeasurement.findUnique({
      where: { id },
    });

    if (!measurement) {
      return null;
    }

    return MedicalMeasurementMapper.fromPrisma(measurement);
  }

  /**
   * Elimina un medicion medica por su identificador.
   * @param id Identificador único del recurso.
   * @returns No retorna ningún valor.
   */
  async delete(id: number): Promise<void> {
    this.access.admin();
    await this.prisma.medicalMeasurement.delete({
      where: { id },
    });
  }
}
