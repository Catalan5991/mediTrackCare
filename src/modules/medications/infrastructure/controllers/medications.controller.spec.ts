import { Test, TestingModule } from '@nestjs/testing';
import { MedicationsController } from './medications.controller';
import { MedicationsService } from '../services/medications.service';

/**
 * Pruebas unitarias de MedicationsController.
 *
 * MedicationsService se sustituye con un objeto `useValue`. Así se comprueban
 * los nombres reales `findById()` y `delete()` y la delegación del controlador,
 * sin ejecutar enums mediante HTTP, casos de uso, Prisma o PostgreSQL.
 * Cada caso valida respuesta, argumentos exactos y una sola llamada al mock.
 */
describe('Controlador de medicamentos', () => {
  let controller: MedicationsController;
  let service: jest.Mocked<MedicationsService>;

  beforeEach(async () => {
    // Se simulan exclusivamente los cinco métodos consumidos por el controlador.
    service = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<MedicationsService>;
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedicationsController],
      providers: [{ provide: MedicationsService, useValue: service }],
    }).compile();
    controller = module.get(MedicationsController);
  });

  it('debe estar definido', () => expect(controller).toBeDefined());

  it('debe crear un medicamento', async () => {
    // Arrange: DTO con los campos que el endpoint real entrega al servicio.
    const dto = {
      name: 'Medicamento E2E',
      presentation: 'Tableta',
      concentration: '500 mg',
      route: 'ORAL',
    };
    service.create.mockResolvedValue({ id: 1, ...dto } as never);
    await expect(controller.create(dto as never)).resolves.toEqual({
      id: 1,
      ...dto,
    });
    expect(service.create).toHaveBeenCalledWith(dto);
    expect(service.create).toHaveBeenCalledTimes(1);
  });

  it('debe listar medicamentos con sus filtros', async () => {
    // Los filtros `search` e `isActive` deben respetar su orden y valor original.
    service.findAll.mockResolvedValue([{ id: 1 }] as never);
    await expect(controller.findAll('e2e', true)).resolves.toEqual([{ id: 1 }]);
    expect(service.findAll).toHaveBeenCalledWith('e2e', true);
    expect(service.findAll).toHaveBeenCalledTimes(1);
  });

  it('debe obtener un medicamento por ID', async () => {
    // Se usa el nombre real findById y se valida el identificador recibido.
    service.findById.mockResolvedValue({ id: 1 } as never);
    await expect(controller.findById(1)).resolves.toEqual({ id: 1 });
    expect(service.findById).toHaveBeenCalledWith(1);
    expect(service.findById).toHaveBeenCalledTimes(1);
  });

  it('debe actualizar un medicamento', async () => {
    // El servicio debe recibir el ID junto con el DTO parcial de actualización.
    const dto = { name: 'Medicamento actualizado' };
    service.update.mockResolvedValue({ id: 1, ...dto } as never);
    await expect(controller.update(1, dto)).resolves.toEqual({ id: 1, ...dto });
    expect(service.update).toHaveBeenCalledWith(1, dto);
    expect(service.update).toHaveBeenCalledTimes(1);
  });

  it('debe eliminar un medicamento', async () => {
    // El mock simula la desactivación que retorna la operación delete real.
    service.delete.mockResolvedValue({ id: 1, isActive: false } as never);
    await expect(controller.delete(1)).resolves.toEqual({
      id: 1,
      isActive: false,
    });
    expect(service.delete).toHaveBeenCalledWith(1);
    expect(service.delete).toHaveBeenCalledTimes(1);
  });
  
});
