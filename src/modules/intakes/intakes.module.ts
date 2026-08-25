import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';

import { CreateIntakeUseCase } from './application/use-cases/create-intake.use-case';
import { DeleteIntakeUseCase } from './application/use-cases/delete-intake.use-case';
import { FindIntakeByIdUseCase } from './application/use-cases/find-intake-by-id.use-case';
import { FindIntakesUseCase } from './application/use-cases/find-intakes.use-case';
import { UpdateIntakeUseCase } from './application/use-cases/update-intake.use-case';
import { INTAKES_REPOSITORY } from './domain/interfaces/intakes.repository.interface';
import { IntakesController } from './infrastructure/controllers/intakes.controller';
import { PrismaIntakesRepository } from './infrastructure/repositories/prisma-intakes.repository';
import { IntakesService } from './infrastructure/services/intakes.service';

@Module({
  imports: [PrismaModule],
  controllers: [IntakesController],
  providers: [
    IntakesService,

    CreateIntakeUseCase,
    FindIntakesUseCase,
    FindIntakeByIdUseCase,
    UpdateIntakeUseCase,
    DeleteIntakeUseCase,

    {
      provide: INTAKES_REPOSITORY,
      useClass: PrismaIntakesRepository,
    },
  ],
  exports: [IntakesService],
})
export class IntakesModule {}
