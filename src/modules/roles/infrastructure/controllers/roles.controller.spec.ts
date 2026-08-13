import { Test, TestingModule } from '@nestjs/testing';
import { RolesController } from './roles.controller';
import { RolesService } from '../services/roles.service';

/**
 * Pruebas unitarias de RolesController.
 *
 * RolesService se registra como `useValue` con cinco funciones Jest. Esto permite
 * validar el contrato Controller→Service sin ejecutar permisos HTTP, casos de uso,
 * repositorios o base de datos. Las pruebas aplican Arrange–Act–Assert y revisan
 * explícitamente que no existan llamadas duplicadas al servicio.
 */
describe('Controlador de roles', () => {
  let controller: RolesController;
  let service: jest.Mocked<RolesService>;

  beforeEach(async () => {
    // Cada compilación de TestingModule recibe un servicio completamente simulado.
    service = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    } as unknown as jest.Mocked<RolesService>;
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [{ provide: RolesService, useValue: service }],
    }).compile();
    controller = module.get(RolesController);
  });

  it('debe estar definido', () => expect(controller).toBeDefined());

  it('debe crear un rol', async () => {
    // El DTO de creación debe conservar nombre y descripción durante la delegación.
    const dto = { name: 'E2E_ROLE', description: 'Rol de prueba' };
    service.create.mockResolvedValue({ id: 1, ...dto } as never);
    await expect(controller.create(dto)).resolves.toEqual({ id: 1, ...dto });
    expect(service.create).toHaveBeenCalledWith(dto);
    expect(service.create).toHaveBeenCalledTimes(1);
  });

  it('debe listar roles con la consulta recibida', async () => {
    // La búsqueda y paginación deben enviarse al servicio como el QueryRoleDto real.
    const query = { search: 'E2E', page: 1, limit: 10 };
    service.findAll.mockResolvedValue({
      data: [],
      meta: { total: 0 },
    } as never);
    await expect(controller.findAll(query)).resolves.toEqual({
      data: [],
      meta: { total: 0 },
    });
    expect(service.findAll).toHaveBeenCalledWith(query);
    expect(service.findAll).toHaveBeenCalledTimes(1);
  });

  it('debe obtener un rol por ID', async () => {
    // findOne debe retornar exactamente el rol proporcionado por el mock.
    service.findOne.mockResolvedValue({ id: 1 } as never);
    await expect(controller.findOne(1)).resolves.toEqual({ id: 1 });
    expect(service.findOne).toHaveBeenCalledWith(1);
    expect(service.findOne).toHaveBeenCalledTimes(1);
  });

  it('debe actualizar un rol', async () => {
    // La operación PATCH delega el ID y únicamente los campos parciales recibidos.
    const dto = { description: 'Actualizado' };
    service.update.mockResolvedValue({ id: 1, ...dto } as never);
    await expect(controller.update(1, dto)).resolves.toEqual({ id: 1, ...dto });
    expect(service.update).toHaveBeenCalledWith(1, dto);
    expect(service.update).toHaveBeenCalledTimes(1);
  });

  it('debe eliminar lógicamente un rol', async () => {
    // El resultado simula la desactivación, no una eliminación física del registro.
    service.remove.mockResolvedValue({ id: 1, isActive: false } as never);
    await expect(controller.remove(1)).resolves.toEqual({
      id: 1,
      isActive: false,
    });
    expect(service.remove).toHaveBeenCalledWith(1);
    expect(service.remove).toHaveBeenCalledTimes(1);
  });
  
});
