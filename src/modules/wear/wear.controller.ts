import { BadRequestException, Body, Controller, Delete, ForbiddenException, Get, Headers, Injectable, Module, NotFoundException, Param, Post, Req, UnauthorizedException } from '@nestjs/common';
import { IsString, Length } from 'class-validator';
import { randomBytes, createHash, timingSafeEqual } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';
import { Public } from '../auth/infrastructure/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { CurrentUser as UserContext } from '../../common/decorators/current-user.decorator';

const digest = (value: string) => createHash('sha256').update(value).digest('hex');
const validHash = (candidate: string, hash: string) => {
  const a = Buffer.from(digest(candidate), 'hex');
  const b = Buffer.from(hash, 'hex');
  return a.length === b.length && timingSafeEqual(a, b);
};
class PairingCodeDto {
  @IsString() @Length(10, 10) code!: string;
}
class ExchangeDto {
  @IsString() sessionId!: string;
  @IsString() secret!: string;
}
@Injectable()
class WearService {
  constructor(private readonly db: PrismaService) {}
  async start() {
    const code = randomBytes(8).toString('hex').slice(0, 10).toUpperCase();
    const secret = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 5 * 60_000);
    const session = await this.db.wearPairing.create({
      data: { codeHash: digest(code), secretHash: digest(secret), expiresAt },
    });
    return { sessionId: session.id, code, secret, expiresAt };
  }
  async approve(code: string, user: UserContext) {
    if (user.role !== 'PATIENT') throw new ForbiddenException('Solo el paciente autoriza sus relojes.');
    const patient = await this.db.patient.findUnique({ where: { userId: user.id } });
    if (!patient || !patient.isActive) throw new ForbiddenException('Paciente inactivo o inexistente.');
    const session = await this.db.wearPairing.findUnique({ where: { codeHash: digest(code.toUpperCase()) } });
    if (!session || session.expiresAt <= new Date() || session.consumedAt || session.approvedById) {
      throw new BadRequestException('Código inválido, utilizado o vencido.');
    }
    await this.db.wearPairing.update({ where: { id: session.id }, data: { approvedById: user.id } });
    return { approved: true, expiresAt: session.expiresAt };
  }
  async exchange(sessionId: string, secret: string) {
    const session = await this.db.wearPairing.findUnique({ where: { id: sessionId } });
    if (!session || !validHash(secret, session.secretHash)) throw new UnauthorizedException('Intento desconocido.');
    if (session.expiresAt <= new Date()) throw new UnauthorizedException('Intento vencido.');
    if (!session.approvedById) return { status: 'pending' };
    const token = randomBytes(32).toString('hex');
    const device = await this.db.$transaction(async (tx) => {
      const claim = await tx.wearPairing.updateMany({
        where: { id: session.id, consumedAt: null, approvedById: { not: null } },
        data: { consumedAt: new Date() },
      });
      if (claim.count !== 1) throw new UnauthorizedException('Intento ya utilizado.');
      return tx.wearDevice.create({ data: { userId: session.approvedById!, tokenHash: digest(token) } });
    });
    return { status: 'linked', deviceId: device.id, token };
  }
  async treatments(token: string | undefined) {
    const access = await this.check(token);
    const patient = await this.db.patient.findUnique({ where: { userId: access.userId } });
    if (!patient || !patient.isActive) throw new ForbiddenException('Paciente no disponible.');
    return this.db.patientTreatment.findMany({
      where: { patientId: patient.id, status: 'ACTIVE' },
      select: {
        id: true, dose: true, doseUnit: true, frequency: true,
        scheduledTimes: true, timeZone: true, instructions: true,
        medication: { select: { name: true, concentration: true, unit: true } },
      },
      orderBy: { id: 'asc' },
      take: 50,
    });
  }
  async list(user: UserContext) {
    return this.db.wearDevice.findMany({
      where: { userId: user.id, revokedAt: null },
      select: { id: true, name: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
  }
  async revoke(id: string, user: UserContext) {
    const result = await this.db.wearDevice.updateMany({
      where: { id, userId: user.id, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    if (!result.count) throw new NotFoundException('Reloj no encontrado.');
    return { revoked: true };
  }
  async check(token: string | undefined) {
    if (!token || !/^[a-f0-9]{64}$/.test(token)) throw new UnauthorizedException('Credencial inválida.');
    const device = await this.db.wearDevice.findUnique({ where: { tokenHash: digest(token) }, include: { user: true } });
    if (!device || device.revokedAt || !device.user.isActive) throw new UnauthorizedException('Acceso revocado.');
    return { authorized: true, deviceId: device.id, userId: device.userId };
  }
}
@Controller('wear')
export class WearController {
  constructor(private readonly service: WearService) {}
  @Public() @Post('pairing/start') start() { return this.service.start(); }
  @Post('pairing/approve') approve(@Body() data: PairingCodeDto, @CurrentUser() user: UserContext) {
    return this.service.approve(data.code, user);
  }
  @Public() @Post('pairing/exchange') exchange(@Body() data: ExchangeDto) {
    return this.service.exchange(data.sessionId, data.secret);
  }
  @Public() @Get('treatments') treatments(@Headers('x-wear-token') token?: string) {
    return this.service.treatments(token);
  }
  @Get('devices') list(@CurrentUser() user: UserContext) { return this.service.list(user); }
  @Delete('devices/:id') revoke(@Param('id') id: string, @CurrentUser() user: UserContext) {
    return this.service.revoke(id, user);
  }
  @Public() @Get('session') session(@Headers('x-wear-token') token?: string) {
    return this.service.check(token);
  }
}
@Module({ controllers: [WearController], providers: [WearService, PrismaService] })
export class WearModule {}
