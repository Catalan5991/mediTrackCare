import { Test, TestingModule } from '@nestjs/testing';
import { MedicalMeasurementsController } from './medical-measurements.controller';
import { MedicalMeasurementsService } from '../services/medical-measurements.service';

/**
 * Pruebas unitarias de MedicalMeasurementsController.
 *
 * El controlador real depende de MedicalMeasurementsService. En esta suite se
 * reemplaza el servicio mediante `useValue`, por lo que ninguna prueba crea una
 * aplicación HTTP, abre conexiones con PostgreSQL ni ejecuta repositorios Prisma.
 *
 * Cada operación sigue Arrange–Act–Assert:
 * 1. Arrange: se configura el valor que debe devolver el mock.
 * 2. Act: se invoca directamente el método público del controlador.
 * 3. Assert: se verifica el resultado, los argumentos y una única delegación.
 */
describe('Controlador de mediciones médicas', () => {
  let controller: MedicalMeasurementsController;
  let service: jest.Mocked<MedicalMeasurementsService>;

  beforeEach(async () => {
    // Todas las operaciones del servicio son funciones Jest controlables.
    service = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    } as unknown as jest.Mocked<MedicalMeasurementsService>;
    // TestingModule resuelve la inyección del controlador con el mock anterior.
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedicalMeasurementsController],
      providers: [{ provide: MedicalMeasurementsService, useValue: service }],
    }).compile();
    controller = module.get(MedicalMeasurementsController);
  });

  it('debe estar definido', () => expect(controller).toBeDefined());

  it('debe crear una medición médica', async () => {
    // Arrange: DTO válido y respuesta que simula una medición persistida.
    const dto = {
      patientId: 1,
      registeredByUserId: 2,
      measurementType: 'GLUCOSA',
      value: 110,
      unit: 'mg/dL',
      measuredAt: new Date().toISOString(),
    } as never;
    const esperado = { id: 1 };
    service.create.mockResolvedValue(esperado as never);
    // Act y Assert: el controlador debe devolver exactamente la respuesta simulada.
    await expect(controller.create(dto)).resolves.toEqual(esperado);
    // La dependencia debe recibir el mismo DTO, sin transformaciones adicionales.
    expect(service.create).toHaveBeenCalledWith(dto);
    expect(service.create).toHaveBeenCalledTimes(1);
  });

  it('debe listar mediciones médicas con los filtros recibidos', async () => {
    // Los filtros de consulta deben pasar íntegros hacia la capa de servicio.
    const filtros = { patientId: 1, page: 1, limit: 10 } as never;
    const esperado = { data: [], meta: { total: 0 } };
    service.findAll.mockResolvedValue(esperado as never);
    await expect(controller.findAll(filtros)).resolves.toEqual(esperado);
    expect(service.findAll).toHaveBeenCalledWith(filtros);
    expect(service.findAll).toHaveBeenCalledTimes(1);
  });

  it('debe obtener una medición médica por ID', async () => {
    // El ID numérico recibido por la ruta debe conservarse durante la delegación.
    const esperado = { id: 1 };
    service.findOne.mockResolvedValue(esperado as never);
    await expect(controller.findOne(1)).resolves.toEqual(esperado);
    expect(service.findOne).toHaveBeenCalledWith(1);
    expect(service.findOne).toHaveBeenCalledTimes(1);
  });

  it('debe actualizar una medición médica', async () => {
    // La actualización requiere delegar simultáneamente el ID y el DTO parcial.
    const dto = { value: 115 } as never;
    const esperado = { id: 1, value: 115 };
    service.update.mockResolvedValue(esperado as never);
    await expect(controller.update(1, dto)).resolves.toEqual(esperado);
    expect(service.update).toHaveBeenCalledWith(1, dto);
    expect(service.update).toHaveBeenCalledTimes(1);
  });

  it('debe eliminar una medición médica', async () => {
    // El servicio simula una eliminación sin contenido y el controlador la propaga.
    service.remove.mockResolvedValue(undefined);
    await expect(controller.remove(1)).resolves.toBeUndefined();
    expect(service.remove).toHaveBeenCalledWith(1);
    expect(service.remove).toHaveBeenCalledTimes(1);
  });
});
