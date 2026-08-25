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
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param configService Servicio que coordina las operaciones de config service.
   */
  constructor(configService: ConfigService) {
    // Prisma 7 requiere un adapter explicito cuando se usa el generador prisma-client.
    super({
      adapter: new PrismaPg(configService.getOrThrow<string>('DATABASE_URL')),
    });
  }
  /**
   * Ejecuta la operación on module init.
   * @returns Promesa que resuelve con el resultado de la operación.
   */
  async onModuleInit() {
    await this.$connect();
  }
  /**
   * Ejecuta la operación on module destroy.
   * @returns Promesa que resuelve con el resultado de la operación.
   */
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
