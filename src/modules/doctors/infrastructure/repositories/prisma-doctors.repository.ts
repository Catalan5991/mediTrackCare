import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../../../generated/prisma/client';

import { PrismaService } from '../../../prisma/prisma.service';
import { Doctor } from '../../domain/entities/doctor.entity';
import {
  CreateDoctorData,
  DoctorsRepository,
  FindDoctorsParams,
  PaginatedDoctors,
  UpdateDoctorData,
} from '../../domain/interfaces/doctors.repository.interface';
import { DoctorMapper } from '../mappers/doctor.mapper';
import { DoctorPatientAssignment } from '../../domain/entities/doctor-patient.entity';

@Injectable()
export class PrismaDoctorsRepository implements DoctorsRepository {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param prisma Servicio que coordina las operaciones de prisma.
   */
  constructor(private readonly prisma: PrismaService) {}
  /**
   * Crea un medico con los datos recibidos.
   * @param data Valor de data requerido por la operacion.
   * @returns Promesa que resuelve con el resultado de la operación.
   */
  async create(data: CreateDoctorData): Promise<Doctor> {
    const doctor = await this.prisma.doctor.create({ data });
    return DoctorMapper.toDomain(doctor);
  }
  /**
   * Obtiene el listado de medicos que cumplen los filtros indicados.
   * @param params Valor de params requerido por la operacion.
   * @returns Promesa que resuelve con el resultado de la operación.
   */
  async findAll(params: FindDoctorsParams): Promise<PaginatedDoctors> {
    const page = params.page ?? 1;
    const limit = params.limit ?? 10;
    const where: Prisma.DoctorWhereInput = {
      isActive: params.isActive,
      specialty: params.specialty
        ? { contains: params.specialty, mode: Prisma.QueryMode.insensitive }
        : undefined,
      OR: params.search
        ? [
            {
              fullName: {
                contains: params.search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              professionalLicense: {
                contains: params.search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              specialty: {
                contains: params.search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              email: {
                contains: params.search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
          ]
        : undefined,
    };
    const [total, doctors] = await this.prisma.$transaction([
      this.prisma.doctor.count({ where }),
      this.prisma.doctor.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
    ]);
    return {
      data: doctors.map(DoctorMapper.toDomain),
      total,
      page,
      limit,
      lastPage: Math.ceil(total / limit),
    };
  }
  /**
   * Obtiene by user id.
   * @param userId Valor de user id requerido por la operacion.
   * @returns Promesa que resuelve con el resultado de la operación.
   */
  async findByUserId(userId: number): Promise<Doctor | null> {
    const doctor = await this.prisma.doctor.findUnique({ where: { userId } });
    return doctor ? DoctorMapper.toDomain(doctor) : null;
  }
  /**
   * Obtiene by professional license.
   * @param license Valor de license requerido por la operacion.
   * @returns Promesa que resuelve con el resultado de la operación.
   */
  async findByProfessionalLicense(license: string): Promise<Doctor | null> {
    const doctor = await this.prisma.doctor.findUnique({
      where: { professionalLicense: license },
    });
    return doctor ? DoctorMapper.toDomain(doctor) : null;
  }
  /**
   * Obtiene duplicate for update.
   * @param id Identificador único del recurso.
   * @param userId Valor de user id requerido por la operacion.
   * @param license Valor de license requerido por la operacion.
   * @returns Promesa que resuelve con el resultado de la operación.
   */
  async findDuplicateForUpdate(
    id: number,
    userId?: number,
    license?: string | null,
  ): Promise<Doctor | null> {
    if (userId === undefined && !license) return null;
    const doctor = await this.prisma.doctor.findFirst({
      where: {
        id: { not: id },
        OR: [
          ...(userId !== undefined ? [{ userId }] : []),
          ...(license ? [{ professionalLicense: license }] : []),
        ],
      },
    });
    return doctor ? DoctorMapper.toDomain(doctor) : null;
  }
  /**
   * Actualiza un medico existente.
   * @param id Identificador único del recurso.
   * @param data Valor de data requerido por la operacion.
   * @returns Promesa que resuelve con el resultado de la operación.
   */
  async update(id: number, data: UpdateDoctorData): Promise<Doctor> {
    const doctor = await this.prisma.doctor.update({ where: { id }, data });
    return DoctorMapper.toDomain(doctor);
  }
  /**
   * Ejecuta la operación soft delete.
   * @param id Identificador único del recurso.
   * @returns Promesa que resuelve con el resultado de la operación.
   */
  async softDelete(id: number): Promise<Doctor> {
    const doctor = await this.prisma.doctor.update({
      where: { id },
      data: { isActive: false },
    });
    return DoctorMapper.toDomain(doctor);
  }
  /**
   * Ejecuta la operación assign patient.
   * @param doctorId Valor de doctor id requerido por la operacion.
   * @param patientId Valor de patient id requerido por la operacion.
   * @returns Promesa que resuelve con el resultado de la operación.
   */
  async assignPatient(
    doctorId: number,
    patientId: number,
  ): Promise<DoctorPatientAssignment> {
    const assignment = await this.prisma.doctorPatient.upsert({
      where: { doctorId_patientId: { doctorId, patientId } },
      create: { doctorId, patientId },
      update: { isActive: true },
    });
    return new DoctorPatientAssignment(
      assignment.doctorId,
      assignment.patientId,
      assignment.isActive,
      assignment.createdAt,
      assignment.updatedAt,
    );
  }
  /**
   * Elimina patient.
   * @param doctorId Valor de doctor id requerido por la operacion.
   * @param patientId Valor de patient id requerido por la operacion.
   * @returns Promesa que resuelve con el resultado de la operación.
   */
  async removePatient(
    doctorId: number,
    patientId: number,
  ): Promise<DoctorPatientAssignment> {
    const assignment = await this.prisma.doctorPatient.update({
      where: { doctorId_patientId: { doctorId, patientId } },
      data: { isActive: false },
    });
    return new DoctorPatientAssignment(
      assignment.doctorId,
      assignment.patientId,
      assignment.isActive,
      assignment.createdAt,
      assignment.updatedAt,
    );
  }
  /**
   * Obtiene patient assignments.
   * @param doctorId Valor de doctor id requerido por la operacion.
   * @returns Promesa que resuelve con el resultado de la operación.
   */
  async findPatientAssignments(
    doctorId: number,
  ): Promise<DoctorPatientAssignment[]> {
    const assignments = await this.prisma.doctorPatient.findMany({
      where: { doctorId, isActive: true },
      orderBy: { createdAt: 'desc' },
    });
    return assignments.map(
      (assignment) =>
        new DoctorPatientAssignment(
          assignment.doctorId,
          assignment.patientId,
          assignment.isActive,
          assignment.createdAt,
          assignment.updatedAt,
        ),
    );
  }

  /**
   * Obtiene un medico por su identificador.
   * @param id Identificador único del recurso.
   * @returns Promesa que resuelve con el resultado de la operación.
   */
  async findById(id: number): Promise<Doctor | null> {
    const doctor = await this.prisma.doctor.findUnique({ where: { id } });
    return doctor ? DoctorMapper.toDomain(doctor) : null;
  }
}
