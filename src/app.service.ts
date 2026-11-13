import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  /**
   * Obtiene hello.
   * @returns Resultado producido por la operación.
   */
  getHello(): string {
    return 'Hello World!';
  }
}
