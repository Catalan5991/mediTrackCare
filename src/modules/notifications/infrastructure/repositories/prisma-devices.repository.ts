import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { PatientAccessService } from '../../../../common/authorization/patient-access.service';
import { RegisterDeviceDto } from '../../application/dtos/register-device.dto';
import type { DevicesRepository } from '../../domain/interfaces/devices.repository';
const select = {
  id: true,
  platform: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} as const;
@Injectable()
export class PrismaDevicesRepository implements DevicesRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly access: PatientAccessService,
  ) {}
  async register(dto: RegisterDeviceDto) {
    const userId = this.access.actor().id;
    return this.prisma.$transaction(
      async (tx) => {
        const old = await tx.device.findUnique({ where: { token: dto.token } });
        if (old && old.userId !== userId && old.isActive)
          throw new ConflictException(
            'El dispositivo debe desvincularse de la cuenta anterior.',
          );
        return tx.device.upsert({
          where: { token: dto.token },
          create: { userId, token: dto.token, platform: dto.platform },
          update: { userId, platform: dto.platform, isActive: true },
          select,
        });
      },
      { isolationLevel: 'Serializable' },
    );
  }
  list() {
    return this.prisma.device.findMany({
      where: { userId: this.access.actor().id, isActive: true },
      select,
      orderBy: { id: 'desc' },
      take: 100,
    });
  }
  async revoke(id: number) {
    const result = await this.prisma.device.updateMany({
      where: { id, userId: this.access.actor().id },
      data: { isActive: false },
    });
    if (!result.count) throw new NotFoundException();
    return { id, isActive: false };
  }
}
