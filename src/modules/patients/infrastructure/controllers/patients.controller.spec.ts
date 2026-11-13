import { Test, TestingModule } from '@nestjs/testing';
import { PatientsController } from './patients.controller';
import { PatientsService } from '../services/patients.service';

/**
 * Pruebas unitarias de PatientsController.
 *
 * PatientsService se reemplaza mediante `useValue` para aislar el controlador
 * de los casos de uso, relaciones User/Patient y persistencia. La suite invoca
 * métodos TypeScript directamente, por lo que guards, pipes y PostgreSQL no
 * participan. Cada escenario comprueba retorno, parámetros y número de llamadas.
 */
describe('Controlador de pacientes', () => {
  let controller: PatientsController;
  let service: jest.Mocked<PatientsService>;

  beforeEach(async () => {
    // Se crean mocks nuevos para garantizar independencia entre escenarios.
    service = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    } as unknown as jest.Mocked<PatientsService>;
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PatientsController],
      providers: [{ provide: PatientsService, useValue: service }],
    }).compile();
    controller = module.get(PatientsController);
  });

  it('debe estar definido', () => expect(controller).toBeDefined());

  it('debe crear un paciente', async () => {
    // Arrange: el DTO contiene la referencia User requerida por el contrato real.
    const dto = {
      userId: 1,
      fullName: 'Paciente E2E',
      birthDate: '1990-01-01',
      gender: 'FEMALE',
    } as never;
    const esperado = { id: 1 };
    service.create.mockResolvedValue(esperado as never);
    await expect(controller.create(dto)).resolves.toEqual(esperado);
    expect(service.create).toHaveBeenCalledWith(dto);
    expect(service.create).toHaveBeenCalledTimes(1);
  });

  it('debe listar pacientes con la consulta recibida', async () => {
    // Los filtros y valores de paginación deben delegarse como un único objeto.
    const query = { search: 'e2e', page: 1, limit: 10 } as never;
    const esperado = { data: [], meta: { total: 0 } };
    service.findAll.mockResolvedValue(esperado as never);
    await expect(controller.findAll(query)).resolves.toEqual(esperado);
    expect(service.findAll).toHaveBeenCalledWith(query);
    expect(service.findAll).toHaveBeenCalledTimes(1);
  });

  it('debe obtener un paciente por ID', async () => {
    // El controlador debe conservar el ID y propagar la entidad simulada.
    service.findOne.mockResolvedValue({ id: 1 } as never);
    await expect(controller.findOne(1)).resolves.toEqual({ id: 1 });
    expect(service.findOne).toHaveBeenCalledWith(1);
    expect(service.findOne).toHaveBeenCalledTimes(1);
  });

  it('debe actualizar un paciente', async () => {
    // Se valida la delegación conjunta del ID y de los campos parciales modificados.
    const dto = { fullName: 'Paciente actualizado' };
    service.update.mockResolvedValue({ id: 1, ...dto } as never);
    await expect(controller.update(1, dto)).resolves.toEqual({ id: 1, ...dto });
    expect(service.update).toHaveBeenCalledWith(1, dto);
    expect(service.update).toHaveBeenCalledTimes(1);
  });

  it('debe eliminar un paciente', async () => {
    // El mock representa el borrado lógico mediante `isActive: false`.
    service.remove.mockResolvedValue({ id: 1, isActive: false } as never);
    await expect(controller.remove(1)).resolves.toEqual({
      id: 1,
      isActive: false,
    });
    expect(service.remove).toHaveBeenCalledWith(1);
    expect(service.remove).toHaveBeenCalledTimes(1);
  });
});
