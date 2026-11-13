import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import type { AuthUser } from '../../domain/entities/auth-user';
import type {
  AuthUserRepository,
  CreateAuthUserData,
} from '../../domain/interfaces/auth-user-repository.interface';
import { AuthUserMapper } from '../mappers/auth-user.mapper';

@Injectable()
// Adaptador Prisma del puerto AuthUserRepository.
export class PrismaAuthUserRepository implements AuthUserRepository {
  async profileDetails(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        phone: true,
        patientProfile: { select: { id: true, phone: true, timeZone: true } },
        doctorProfile: {
          select: {
            id: true,
            professionalLicense: true,
            specialty: true,
            verificationStatus: true,
            verifiedAt: true,
          },
        },
      },
    });
  }
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param prisma Servicio que coordina las operaciones de prisma.
   */
  constructor(private readonly prisma: PrismaService) {}
  /**
   * Crea un usuario autenticado con los datos recibidos.
   * @param data Valor de data requerido por la operacion.
   * @returns Promesa que resuelve con el resultado de la operación.
   */
  async create(data: CreateAuthUserData): Promise<AuthUser> {
    const profile = data.profile ?? 'PATIENT';
    const user = await this.prisma.$transaction(async (tx) => {
      const role = await tx.role.findFirstOrThrow({
        where: { name: profile, isActive: true },
      });
      return tx.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: data.password,
          phone: data.phone,
          role: { connect: { id: role.id } },
          ...(profile === 'PATIENT'
            ? {
                patientProfile: {
                  create: {
                    fullName: data.name,
                    phone: data.phone,
                    timeZone: data.timeZone ?? 'America/Mexico_City',
                  },
                },
              }
            : {}),
          ...(profile === 'DOCTOR'
            ? {
                doctorProfile: {
                  create: {
                    fullName: data.name,
                    email: data.email,
                    phone: data.phone,
                    professionalLicense: data.professionalLicense,
                    specialty: data.specialty,
                    verificationStatus: 'PENDING' as const,
                  },
                },
              }
            : {}),
        },
        include: { role: true },
      });
    });

    return AuthUserMapper.toDomain(user);
  }
  /**
   * Obtiene by email.
   * @param email Valor de email requerido por la operacion.
   * @returns Promesa que resuelve con el resultado de la operación.
   */
  async findByEmail(email: string): Promise<AuthUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        role: true,
      },
    });

    return user ? AuthUserMapper.toDomain(user) : null;
  }

  /**
   * Obtiene un usuario autenticado por su identificador.
   * @param id Identificador único del recurso.
   * @returns Promesa que resuelve con el resultado de la operación.
   */
  async findById(id: number): Promise<AuthUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        role: true,
      },
    });

    return user ? AuthUserMapper.toDomain(user) : null;
  }
}
