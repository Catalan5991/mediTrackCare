import { Doctor as PrismaDoctor } from '../../../../../generated/prisma/client';

import { Doctor } from '../../domain/entities/doctor.entity';

export class DoctorMapper {
  /**
   * Transforma el recurso solicitado.
   * @param doctor Valor de doctor requerido por la operacion.
   * @returns Resultado producido por la operación.
   */
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
      doctor.verificationStatus,
      doctor.verifiedAt,
    );
  }
}
