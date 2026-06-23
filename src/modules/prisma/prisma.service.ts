import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../../generated/prisma/client';

@Injectable()
// Cliente Prisma compartido; abre y cierra la conexion junto al ciclo de vida de Nest.
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(configService: ConfigService) {
    // Prisma 7 requiere un adapter explicito cuando se usa el generador prisma-client.
    super({
      adapter: new PrismaPg(configService.getOrThrow<string>('DATABASE_URL')),
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
