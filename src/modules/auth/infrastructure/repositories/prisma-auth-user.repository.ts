import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import type { AuthUser } from '../../domain/entities/auth-user';
import type {
  AuthUserRepository,
  CreateAuthUserData,
} from '../../domain/interfaces/auth-user-repository.interface';
import { AuthUserMapper } from '../mappers/auth-user.mapper';

const DEFAULT_ROLE_NAME = 'PATIENT';

@Injectable()
// Adaptador Prisma del puerto AuthUserRepository.
export class PrismaAuthUserRepository implements AuthUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateAuthUserData): Promise<AuthUser> {
    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        role: {
          connectOrCreate: {
            where: { name: DEFAULT_ROLE_NAME },
            create: { name: DEFAULT_ROLE_NAME },
          },
        },
      },
      include: {
        role: true,
      },
    });

    return AuthUserMapper.toDomain(user);
  }

  async findById(id: number): Promise<AuthUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        role: true,
      },
    });

    return user ? AuthUserMapper.toDomain(user) : null;
  }

  async findByEmail(email: string): Promise<AuthUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        role: true,
      },
    });

    return user ? AuthUserMapper.toDomain(user) : null;
  }
}
