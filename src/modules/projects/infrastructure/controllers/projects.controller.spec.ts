import { Test, TestingModule } from '@nestjs/testing';
import { GetProjectUseCase } from '../../application/use-cases/get-project.use-case';
import { ProjectsController } from './projects.controller';

describe('Project Controller', () => {
  let controller: ProjectsController;
  let getProjectUseCase: jest.Mocked<Pick<GetProjectUseCase, 'execute'>>;

  beforeEach(async () => {
    getProjectUseCase = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [
        {
          provide: GetProjectUseCase,
          useValue: getProjectUseCase,
        },
      ],
    }).compile();

    controller = module.get<ProjectsController>(ProjectsController);
  });

  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('debe retornar el proyecto obtenido de GetProjectUseCase', () => {
    const mockProject = {
      id: 1,
      name: 'Proyecto de prueba',
      description: 'Proyecto utilizado para pruebas unitarias',
    };
    getProjectUseCase.execute.mockReturnValue(mockProject);

    const result = controller.findById(1);

    expect(result).toEqual(mockProject);
    expect(getProjectUseCase.execute).toHaveBeenCalledWith(1);
    expect(getProjectUseCase.execute).toHaveBeenCalledTimes(1);
  });
});
