import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { GetUsersUseCase } from '../../application/use-cases/get-users.use-case';
import { GetUserUseCase } from '../../application/use-cases/get-user.use-case';
import { UpdateUserUseCase } from '../../application/use-cases/update-user.use-case';
import { DeleteUserUseCase } from '../../application/use-cases/delete-user.use-case';

/**
 * Pruebas unitarias de UsersController.
 *
 * Este controlador no utiliza un Service: recibe directamente cinco casos de
 * uso. Cada proveedor se sustituye con `useValue: { execute: jest.fn() }` para
 * probar exclusivamente la coordinación del controlador. De esta forma no se
 * ejecutan hashing de contraseñas, repositorios, Prisma ni PostgreSQL.
 *
 * Las aserciones verifican el valor retornado, los argumentos enviados a
 * `execute()` y que cada caso de uso sea invocado exactamente una vez.
 */
describe('Controlador de usuarios', () => {
  let controller: UsersController;
  const create = { execute: jest.fn() };
  const findAll = { execute: jest.fn() };
  const findOne = { execute: jest.fn() };
  const update = { execute: jest.fn() };
  const remove = { execute: jest.fn() };

  beforeEach(async () => {
    // Evita que llamadas registradas por una prueba afecten a la siguiente.
    jest.clearAllMocks();
    // TestingModule inyecta un mock independiente para cada caso de uso real.
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: CreateUserUseCase, useValue: create },
        { provide: GetUsersUseCase, useValue: findAll },
        { provide: GetUserUseCase, useValue: findOne },
        { provide: UpdateUserUseCase, useValue: update },
        { provide: DeleteUserUseCase, useValue: remove },
      ],
    }).compile();
    controller = module.get(UsersController);
  });

  it('debe estar definido', () => expect(controller).toBeDefined());

  it('debe crear un usuario', async () => {
    // Arrange: se prepara un DTO válido y la respuesta pública sin lógica real.
    const dto = {
      name: 'Usuario E2E',
      email: 'e2e@test.local',
      password: 'Password123',
      role: 'PATIENT',
    };
    create.execute.mockResolvedValue({ id: 1, ...dto });
    // Act y Assert: create debe propagar el resultado del caso de uso.
    await expect(controller.create(dto)).resolves.toEqual({ id: 1, ...dto });
    // El DTO debe llegar completo y execute no debe repetirse.
    expect(create.execute).toHaveBeenCalledWith(dto);
    expect(create.execute).toHaveBeenCalledTimes(1);
  });

  it('debe listar usuarios', async () => {
    // findAll no recibe parámetros; se comprueba que execute también se invoque sin ellos.
    findAll.execute.mockResolvedValue([{ id: 1 }]);
    await expect(controller.findAll()).resolves.toEqual([{ id: 1 }]);
    expect(findAll.execute).toHaveBeenCalledWith();
    expect(findAll.execute).toHaveBeenCalledTimes(1);
  });

  it('debe obtener un usuario por ID', async () => {
    // El identificador debe enviarse sin alteraciones a GetUserUseCase.
    findOne.execute.mockResolvedValue({ id: 1 });
    await expect(controller.findOne(1)).resolves.toEqual({ id: 1 });
    expect(findOne.execute).toHaveBeenCalledWith(1);
    expect(findOne.execute).toHaveBeenCalledTimes(1);
  });

  it('debe actualizar un usuario', async () => {
    // UpdateUserUseCase debe recibir tanto el ID como el DTO parcial.
    const dto = { name: 'Usuario actualizado' };
    update.execute.mockResolvedValue({ id: 1, ...dto });
    await expect(controller.update(1, dto)).resolves.toEqual({ id: 1, ...dto });
    expect(update.execute).toHaveBeenCalledWith(1, dto);
    expect(update.execute).toHaveBeenCalledTimes(1);
  });
  
  it('debe eliminar un usuario', async () => {
    // La eliminación lógica simulada se retorna sin modificar su estado público.
    remove.execute.mockResolvedValue({ id: 1, isActive: false });
    await expect(controller.remove(1)).resolves.toEqual({
      id: 1,
      isActive: false,
    });
    expect(remove.execute).toHaveBeenCalledWith(1);
    expect(remove.execute).toHaveBeenCalledTimes(1);
  });
});
