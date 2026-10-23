import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AsyncLocalStorage } from 'node:async_hooks';
import type { Prisma } from '../../../generated/prisma/client';
import { PrismaService } from '../../modules/prisma/prisma.service';
export type Actor = { id: number; role: string };
export type PatientAction = 'read' | 'track' | 'reminders' | 'clinical';
@Injectable()
export class PatientAccessService {
  private readonly context = new AsyncLocalStorage<{ user?: Actor }>();
  constructor(private readonly prisma: PrismaService) {}
  run(request: { user?: Actor }, next: () => void) {
    this.context.run(request, next);
  }
  actor(): Actor {
    const user = this.context.getStore()?.user;
    if (!user) throw new UnauthorizedException();
    return user;
  }
  admin() {
    if (this.actor().role.toUpperCase() !== 'ADMIN')
      throw new ForbiddenException('Accion reservada a administracion.');
  }
  async patientWhere(
    action: PatientAction = 'read',
  ): Promise<Prisma.PatientWhereInput> {
    const actor = this.actor(),
      role = actor.role.toUpperCase();
    if (role === 'ADMIN') return {};
    if (role === 'PATIENT' && action !== 'clinical')
      return { userId: actor.id, isActive: true };
    if (role === 'DOCTOR') {
      const doctor = await this.prisma.doctor.findUnique({
        where: { userId: actor.id },
      });
      if (!doctor?.isActive || doctor.verificationStatus !== 'VERIFIED')
        throw new ForbiddenException('Se requiere verificacion profesional.');
      return {
        isActive: true,
        doctorAssignments: {
          some: {
            doctorId: doctor.id,
            isActive: true,
            status: 'ACTIVE',
            canRead: true,
            ...(action === 'track' ? { canTrack: true } : {}),
            ...(action === 'reminders' ? { canManageReminders: true } : {}),
          },
        },
      };
    }
    if (role === 'CAREGIVER' && action !== 'clinical')
      return {
        isActive: true,
        caregivers: {
          some: {
            userId: actor.id,
            isActive: true,
            status: 'ACTIVE',
            canRead: true,
            ...(action === 'track' ? { canTrack: true } : {}),
            ...(action === 'reminders' ? { canManageReminders: true } : {}),
          },
        },
      };
    throw new ForbiddenException('No tienes permisos para esta accion.');
  }
  async assert(
    patientId: number,
    action: PatientAction = 'read',
    tx: Prisma.TransactionClient = this.prisma,
  ) {
    if (
      !(await tx.patient.findFirst({
        where: { AND: [{ id: patientId }, await this.patientWhere(action)] },
        select: { id: true },
      }))
    )
      throw new ForbiddenException('Paciente fuera del alcance autorizado.');
  }
  async resource(
    model:
      | 'prescription'
      | 'prescriptionItem'
      | 'reminder'
      | 'intake'
      | 'medicalMeasurement'
      | 'file'
      | 'caregiver',
    id: number,
    action: PatientAction = 'read',
  ) {
    let row: {
      patientId?: number | null;
      prescription?: { patientId: number };
    } | null;
    if (model === 'prescriptionItem')
      row = await this.prisma.prescriptionItem.findUnique({
        where: { id },
        include: { prescription: { select: { patientId: true } } },
      });
    else
      row = await (
        this.prisma[model] as unknown as {
          findUnique(
            args: unknown,
          ): Promise<{ patientId: number | null } | null>;
        }
      ).findUnique({ where: { id } });
    if (!row) throw new NotFoundException('Recurso no encontrado.');
    const patientId = row.patientId ?? row.prescription?.patientId;
    if (patientId) await this.assert(patientId, action);
    else this.admin();
    return patientId;
  }
  async clinicalDoctor(
    patientId: number,
    suppliedId?: number,
    tx: Prisma.TransactionClient = this.prisma,
  ) {
    await this.assert(patientId, 'clinical', tx);
    const actor = this.actor();
    const doctor =
      actor.role.toUpperCase() === 'DOCTOR'
        ? await tx.doctor.findUnique({ where: { userId: actor.id } })
        : suppliedId
          ? await tx.doctor.findUnique({ where: { id: suppliedId } })
          : null;
    if (
      !doctor ||
      !doctor.isActive ||
      doctor.verificationStatus !== 'VERIFIED' ||
      (suppliedId && suppliedId !== doctor.id)
    )
      throw new ForbiddenException('Se requiere un medico verificado.');
    if (
      !(await tx.doctorPatient.findFirst({
        where: {
          doctorId: doctor.id,
          patientId,
          status: 'ACTIVE',
          isActive: true,
          canRead: true,
        },
      }))
    )
      throw new ForbiddenException(
        'El medico no tiene autorizacion del paciente.',
      );
    return doctor.id;
  }
}
