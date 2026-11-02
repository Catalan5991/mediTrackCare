import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SelfProfileController } from './self-profile.controller';
@Module({imports:[PrismaModule],controllers:[SelfProfileController]})
export class SelfProfileModule {}
