import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

import { JwtAuthGuard } from './common/guards/jwt-auth.guard.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { PrismaModule } from './modules/prisma/prisma.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
