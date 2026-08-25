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
}
