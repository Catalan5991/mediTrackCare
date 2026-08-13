import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { GetProjectUseCase } from '../../application/use-cases/get-project.use-case';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly getProjectUseCase: GetProjectUseCase) {}

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.getProjectUseCase.execute(id);
  }
}
