import { Body, Controller, Get, Headers, Injectable, Module, Post, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { IsInt, Max, Min } from 'class-validator';
import { createHash } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';
import { Public } from '../auth/infrastructure/decorators/public.decorator';
import { localDate } from '../prescriptions/domain/schedule';

class StepsDto {
  @IsInt() @Min(0) @Max(1000000) steps!: number;
}

@Injectable()
class WearActivityService {
  constructor(private readonly db: PrismaService) {}
  private async actor(token?: string) {
    if (!token || !/^[a-f0-9]{64}$/.test(token)) throw new UnauthorizedException('Reloj no autorizado');
    const hash = createHash('sha256').update(token).digest('hex');
    const device = await this.db.wearDevice.findUnique({
      where: { tokenHash: hash }, include: { user: { include: { patientProfile: true } } },
    });
    if (!device || device.revokedAt || !device.user.isActive || !device.user.patientProfile?.isActive)
      throw new UnauthorizedException('Vinculación revocada');
    return { patientId: device.user.patientProfile.id, timeZone: device.user.patientProfile.timeZone };
  }
  async today(token?: string) {
    const actor = await this.actor(token);
    const date = localDate(new Date(), actor.timeZone);
    const rows = await this.db.$queryRaw<Array<{steps: number; last_synced_at: Date}>>`
      SELECT "steps", "last_synced_at" FROM "wear_daily_activities"
      WHERE "patient_id" = ${actor.patientId} AND "activity_date" = CAST(${date} AS date)
        AND "source" = 'WEAR_OS' LIMIT 1
    `;
    return { date, steps: rows[0]?.steps ?? null, lastSyncedAt: rows[0]?.last_synced_at ?? null, source: 'WEAR_OS' };
  }
  async sync(token: string | undefined, input: StepsDto) {
    const actor = await this.actor(token);
    if (!Number.isInteger(input.steps) || input.steps < 0 || input.steps > 1000000)
      throw new BadRequestException('Pasos inválidos');
    const date = localDate(new Date(), actor.timeZone);
    await this.db.$executeRaw`
      INSERT INTO "wear_daily_activities" ("patient_id", "activity_date", "source", "steps", "last_synced_at")
      VALUES (${actor.patientId}, CAST(${date} AS date), 'WEAR_OS', ${input.steps}, NOW())
      ON CONFLICT ("patient_id", "activity_date", "source")
      DO UPDATE SET "steps" = GREATEST("wear_daily_activities"."steps", EXCLUDED."steps"),
        "last_synced_at" = NOW()
    `;
    return this.today(token);
  }
}
@Controller('wear/activity')
export class WearActivityController {
  constructor(private readonly service: WearActivityService) {}
  @Public() @Get('today')
  today(@Headers('x-wear-token') token?: string) { return this.service.today(token); }
  @Public() @Post('steps')
  steps(@Headers('x-wear-token') token: string | undefined, @Body() body: StepsDto) {
    return this.service.sync(token, body);
  }
}
@Module({controllers: [WearActivityController], providers: [WearActivityService, PrismaService]})
export class WearActivityModule {}
