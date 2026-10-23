import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { PatientAccessService } from '../../../../common/authorization/patient-access.service';
import {
  LinkKind,
  RequestPatientLinkDto,
  DecidePatientLinkDto,
  VerifyDoctorDto,
} from '../../application/dtos/patient-link.dto';
import type { PatientLinksRepository } from '../../domain/interfaces/patient-links.repository';
@Injectable()
export class PrismaPatientLinksRepository implements PatientLinksRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly access: PatientAccessService,
  ) {}
  async request(dto: RequestPatientLinkDto) {
    const actor = this.access.actor();
    return this.prisma.$transaction(
      async (tx) => {
        const patient = await tx.patient.findUnique({
          where: { id: dto.patientId },
        });
        if (!patient?.isActive)
          throw new NotFoundException('Paciente no encontrado.');
        if (
          actor.role.toUpperCase() !== 'ADMIN' &&
          actor.id !== patient.userId &&
          actor.id !== dto.userId
        )
          throw new ForbiddenException();
        const user = await tx.user.findUnique({
          where: { id: dto.userId },
          include: { role: true, doctorProfile: true },
        });
        if (
          !user?.isActive ||
          !user.role.isActive ||
          user.role.name.toUpperCase() !== dto.kind
        )
          throw new ForbiddenException(
            'Perfil incompatible con el vinculo solicitado.',
          );
        const data = {
          status: 'PENDING' as const,
          isActive: false,
          requestedAt: new Date(),
          acceptedAt: null,
          requestedByUserId: actor.id,
          canRead: false,
          canTrack: false,
          canManageReminders: false,
        };
        let result;
        if (dto.kind === LinkKind.CAREGIVER) {
          const where = {
            userId_patientId: { userId: dto.userId, patientId: dto.patientId },
          };
          const old = await tx.caregiver.findUnique({ where });
          if (old?.status === 'ACTIVE' || old?.status === 'PENDING')
            throw new ConflictException('Ya existe un vinculo o solicitud.');
          result = await tx.caregiver.upsert({
            where,
            create: {
              userId: dto.userId,
              patientId: dto.patientId,
              relationship: dto.relationship ?? 'Familiar',
              ...data,
            },
            update: { ...data, relationship: dto.relationship ?? 'Familiar' },
          });
        } else {
          const doctor = user.doctorProfile;
          if (!doctor?.isActive || doctor.verificationStatus !== 'VERIFIED')
            throw new ForbiddenException(
              'El medico requiere verificacion profesional.',
            );
          const where = {
            doctorId_patientId: {
              doctorId: doctor.id,
              patientId: dto.patientId,
            },
          };
          const old = await tx.doctorPatient.findUnique({ where });
          if (old?.status === 'ACTIVE' || old?.status === 'PENDING')
            throw new ConflictException('Ya existe un vinculo o solicitud.');
          result = await tx.doctorPatient.upsert({
            where,
            create: { doctorId: doctor.id, patientId: dto.patientId, ...data },
            update: data,
          });
        }
        await tx.auditLog.create({
          data: {
            userId: actor.id,
            module: 'patient-links',
            action: 'REQUEST',
            entityName: dto.kind,
            entityId: dto.patientId,
            description: JSON.stringify({ relatedUserId: dto.userId }),
          },
        });
        return result;
      },
      { isolationLevel: 'Serializable' },
    );
  }
  async list() {
    const actor = this.access.actor(),
      admin = actor.role.toUpperCase() === 'ADMIN';
    const caregiverWhere = admin
      ? {}
      : { OR: [{ userId: actor.id }, { patient: { userId: actor.id } }] };
    const doctorWhere = admin
      ? {}
      : {
          OR: [
            { doctor: { userId: actor.id } },
            { patient: { userId: actor.id } },
          ],
        };
    // Solo identidad minima para decidir solicitudes; no incluye datos clinicos.
    const [caregivers, doctors] = await Promise.all([
      this.prisma.caregiver.findMany({
        where: caregiverWhere,
        include: {
          patient: { select: { id: true, fullName: true } },
          user: { select: { id: true, name: true } },
        },
        orderBy: { requestedAt: 'desc' },
        take: 100,
      }),
      this.prisma.doctorPatient.findMany({
        where: doctorWhere,
        include: {
          patient: { select: { id: true, fullName: true } },
          doctor: {
            select: {
              id: true,
              userId: true,
              fullName: true,
              verificationStatus: true,
            },
          },
        },
        orderBy: { requestedAt: 'desc' },
        take: 100,
      }),
    ]);
    return { caregivers, doctors };
  }
  async decide(
    patientId: number,
    userId: number,
    kind: LinkKind,
    dto: DecidePatientLinkDto,
  ) {
    const actor = this.access.actor();
    return this.prisma.$transaction(
      async (tx) => {
        const patient = await tx.patient.findUnique({
          where: { id: patientId },
        });
        if (!patient) throw new NotFoundException();
        const owner =
          actor.role.toUpperCase() === 'ADMIN' || actor.id === patient.userId;
        if (!owner && (actor.id !== userId || dto.status === 'ACTIVE'))
          throw new ForbiddenException(
            'Solo el paciente o administracion autoriza el acceso.',
          );
        const data = {
          status: dto.status,
          isActive: dto.status === 'ACTIVE',
          canRead: dto.status === 'ACTIVE' && (dto.canRead ?? true),
          canTrack: dto.status === 'ACTIVE' && (dto.canTrack ?? false),
          canManageReminders:
            dto.status === 'ACTIVE' && (dto.canManageReminders ?? false),
          acceptedAt: dto.status === 'ACTIVE' ? new Date() : undefined,
        };
        let result;
        if (kind === LinkKind.CAREGIVER) {
          const where = { userId_patientId: { userId, patientId } };
          const current = await tx.caregiver.findUnique({ where });
          if (!current) throw new NotFoundException();
          if (
            dto.status === 'ACTIVE' &&
            !['PENDING', 'ACTIVE'].includes(current.status)
          )
            throw new ConflictException('Solicita un nuevo vinculo.');
          result = await tx.caregiver.update({ where, data });
        } else {
          const doctor = await tx.doctor.findUnique({ where: { userId } });
          if (!doctor) throw new NotFoundException();
          if (
            dto.status === 'ACTIVE' &&
            (!doctor.isActive || doctor.verificationStatus !== 'VERIFIED')
          )
            throw new ForbiddenException('Medico no verificado.');
          const where = {
            doctorId_patientId: { doctorId: doctor.id, patientId },
          };
          const current = await tx.doctorPatient.findUnique({ where });
          if (!current) throw new NotFoundException();
          if (
            dto.status === 'ACTIVE' &&
            !['PENDING', 'ACTIVE'].includes(current.status)
          )
            throw new ConflictException('Solicita un nuevo vinculo.');
          result = await tx.doctorPatient.update({ where, data });
        }
        if (
          dto.status !== 'ACTIVE' ||
          dto.canRead === false ||
          dto.canTrack === false
        )
          await tx.notification.updateMany({
            where: { patientId, userId, status: 'PENDIENTE' },
            data: { cancelledAt: new Date() },
          });
        await tx.auditLog.create({
          data: {
            userId: actor.id,
            module: 'patient-links',
            action: dto.status,
            entityName: kind,
            entityId: patientId,
            description: JSON.stringify({
              relatedUserId: userId,
              permissions: data,
            }),
          },
        });
        return result;
      },
      { isolationLevel: 'Serializable' },
    );
  }
  async verify(doctorId: number, dto: VerifyDoctorDto) {
    this.access.admin();
    return this.prisma.$transaction(async (tx) => {
      const result = await tx.doctor.update({
        where: { id: doctorId },
        data: {
          verificationStatus: dto.status,
          verifiedAt: dto.status === 'VERIFIED' ? new Date() : null,
        },
      });
      await tx.auditLog.create({
        data: {
          userId: this.access.actor().id,
          module: 'doctors',
          action: 'VERIFY',
          entityName: 'Doctor',
          entityId: doctorId,
          description: JSON.stringify({
            status: dto.status,
            reason: dto.reason,
          }),
        },
      });
      return {
        id: result.id,
        verificationStatus: result.verificationStatus,
        verifiedAt: result.verifiedAt,
      };
    });
  }
}
