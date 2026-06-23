import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// Publica PrismaService para los modulos que necesitan acceso a persistencia.
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
