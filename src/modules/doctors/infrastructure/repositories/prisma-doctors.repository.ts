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
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateDoctorData): Promise<Doctor> {
    const doctor = await this.prisma.doctor.create({ data });
    return DoctorMapper.toDomain(doctor);
  }

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

  async findById(id: number): Promise<Doctor | null> {
    const doctor = await this.prisma.doctor.findUnique({ where: { id } });
    return doctor ? DoctorMapper.toDomain(doctor) : null;
  }

  async findByUserId(userId: number): Promise<Doctor | null> {
    const doctor = await this.prisma.doctor.findUnique({ where: { userId } });
    return doctor ? DoctorMapper.toDomain(doctor) : null;
  }

  async findByProfessionalLicense(license: string): Promise<Doctor | null> {
    const doctor = await this.prisma.doctor.findUnique({
      where: { professionalLicense: license },
    });
    return doctor ? DoctorMapper.toDomain(doctor) : null;
  }

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

  async update(id: number, data: UpdateDoctorData): Promise<Doctor> {
    const doctor = await this.prisma.doctor.update({ where: { id }, data });
    return DoctorMapper.toDomain(doctor);
  }

  async softDelete(id: number): Promise<Doctor> {
    const doctor = await this.prisma.doctor.update({
      where: { id },
      data: { isActive: false },
    });
    return DoctorMapper.toDomain(doctor);
  }

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
}
