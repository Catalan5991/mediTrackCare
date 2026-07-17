import { Doctor as PrismaDoctor } from '../../../../../generated/prisma/client';

import { Doctor } from '../../domain/entities/doctor.entity';

export class DoctorMapper {
  static toDomain(doctor: PrismaDoctor): Doctor {
    return new Doctor(
      doctor.id,
      doctor.userId,
      doctor.fullName,
      doctor.professionalLicense,
      doctor.specialty,
      doctor.phone,
      doctor.email,
      doctor.isActive,
      doctor.createdAt,
      doctor.updatedAt,
    );
  }
}
