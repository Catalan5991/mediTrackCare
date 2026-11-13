import { Global, Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { PrismaModule } from '../../modules/prisma/prisma.module';
import { PatientAccessService } from './patient-access.service';
@Global()
@Module({
  imports: [PrismaModule],
  providers: [PatientAccessService],
  exports: [PatientAccessService],
})
export class PatientAccessModule implements NestModule {
  constructor(private readonly access: PatientAccessService) {}
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        (
          req: { user?: { id: number; role: string } },
          _res: unknown,
          next: () => void,
        ) => this.access.run(req, next),
      )
      .forRoutes('*');
  }
}
