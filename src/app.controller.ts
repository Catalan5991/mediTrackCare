import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './common/decorators/public.decorator';

@Controller()
export class AppController {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param appService Servicio que coordina las operaciones de app service.
   */
  constructor(private readonly appService: AppService) {}
  /**
   * Obtiene hello.
   * @returns Resultado producido por la operación.
   */
  @Get()
  @Public()
  getHello(): string {
    return this.appService.getHello();
  }

  /** Endpoint público utilizado por Docker y el proveedor VPS. */
  @Get('health')
  @Public()
  getHealth() {
    return {
      status: 'ok',
      service: 'MediTrackCare API',
      timestamp: new Date().toISOString(),
    };
  }
}
