import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../../../generated/prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreatePatientData,FindPatientsParams,PaginatedPatients,PatientsRepository,UpdatePatientData} from '../../domain/interfaces/patients.repository.interface';
import { Patient } from '../../domain/entities/patient.entity';
import { PatientMapper } from '../mappers/patient.mapper';

@Injectable()
export class PrismaPatientsRepository implements PatientsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreatePatientData): Promise<Patient> {
    const patient = await this.prisma.patient.create({
      data: {
        userId: data.userId,
        fullName: data.fullName, 
        birthDate: new Date(data.birthDate),
        gender: data.gender,
        phone: data.phone,
        address: data.address,
        emergencyContactName: data.emergencyContactName,
        emergencyContactPhone: data.emergencyContactPhone,
      },
    });

    return PatientMapper.toDomain(patient);
  }

  async findAll(params: FindPatientsParams): Promise<PaginatedPatients> {
    const page = params.page ?? 1;
    const limit = params.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.PatientWhereInput = {
      ...(params.isActive !== undefined && {
        isActive: params.isActive,
      }),
      ...(params.search && {
        OR: [
          {
            fullName: {
              contains: params.search,
              mode: Prisma.QueryMode.insensitive,
            },
          },
          {
            phone: {
              contains: params.search,
              mode: Prisma.QueryMode.insensitive,
            },
          },
          {
            emergencyContactName: {
              contains: params.search,
              mode: Prisma.QueryMode.insensitive,
            },
          },
        ],
      }),
    };

    const [total, patients] = await this.prisma.$transaction([
      this.prisma.patient.count({ where }),
      this.prisma.patient.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ]);

    return {
      data: patients.map(PatientMapper.toDomain),
      total,
      page,
      limit,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findById(id: number): Promise<Patient | null> {
    const patient = await this.prisma.patient.findUnique({
      where: { id },
    });

    if (!patient) return null;

    return PatientMapper.toDomain(patient);
  }

  async findByUserId(userId: number): Promise<Patient | null> {
    const patient = await this.prisma.patient.findUnique({
      where: { userId },
    });

    if (!patient) return null;

    return PatientMapper.toDomain(patient);
  }

  async update(id: number, data: UpdatePatientData): Promise<Patient> {
    const patient = await this.prisma.patient.update({
      where: { id },
      data: {
        userId: data.userId,
        fullName: data.fullName,
        birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
        gender: data.gender,
        phone: data.phone,
        address: data.address,
        emergencyContactName: data.emergencyContactName,
        emergencyContactPhone: data.emergencyContactPhone,
        isActive: data.isActive,
      },
    });

    return PatientMapper.toDomain(patient);
  }

  async softDelete(id: number): Promise<Patient> {
    const patient = await this.prisma.patient.update({
      where: { id },
      data: {
        isActive: false,
      },
    });

    return PatientMapper.toDomain(patient);
  }
}