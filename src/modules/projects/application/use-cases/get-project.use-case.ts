import { Injectable } from '@nestjs/common';

@Injectable()
export class GetProjectUseCase {
  /**
   * Obtiene informacion de projects segun los criterios indicados.
   * @param id Identificador único del recurso.
   * @returns Resultado producido por la operación.
   */
  execute(id: number): unknown {
    return { id };
  }
}
