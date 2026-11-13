import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { GetProjectUseCase } from '../../application/use-cases/get-project.use-case';

@Controller('projects')
export class ProjectsController {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param getProjectUseCase Caso de uso encargado de get project use case.
   */
  constructor(private readonly getProjectUseCase: GetProjectUseCase) {}
  /**
   * Obtiene un projects por su identificador.
   * @param id Identificador único del recurso.
   * @returns Resultado producido por la operación.
   */
  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.getProjectUseCase.execute(id);
  }
}
