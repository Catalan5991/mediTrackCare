import { Test, TestingModule } from '@nestjs/testing';
import { PrescriptionsController } from './prescriptions.controller';
import { PrescriptionsService } from '../services/prescriptions.service';
import { CreatePrescriptionDto } from '../../application/dtos/create-prescription.dto';
import { UpdatePrescriptionDto } from '../../application/dtos/update-prescription.dto';
import { FindPrescriptionsQueryDto } from '../../application/dtos/find-prescriptions-query.dto';

describe('Controlador de prescripciones', () => {
  let controller: PrescriptionsController;
  let service: jest.Mocked<PrescriptionsService>;

  beforeEach(async () => {
    service = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      cancel: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<PrescriptionsService>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrescriptionsController],
      providers: [
        {
          provide: PrescriptionsService,
          useValue: service,
        },
      ],
    }).compile();

    controller = module.get<PrescriptionsController>(PrescriptionsController);
  });

  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('debe crear una receta', async () => {
    const dto = { patientId: 1, doctorId: 2, notes: 'Receta inicial' } as unknown as CreatePrescriptionDto;
    const esperado = { id: 1, ...dto };
    service.create.mockResolvedValue(esperado as never);

    await expect(controller.create(dto)).resolves.toEqual(esperado);
    expect(service.create).toHaveBeenCalledWith(dto);
    expect(service.create).toHaveBeenCalledTimes(1);
  });

  it('debe listar recetas con filtros', async () => {
    const query = { page: 1, limit: 10 } as unknown as FindPrescriptionsQueryDto;
    const esperado = { data: [], meta: { total: 0 } };
    service.findAll.mockResolvedValue(esperado as never);

    await expect(controller.findAll(query)).resolves.toEqual(esperado);
    expect(service.findAll).toHaveBeenCalledWith(query);
    expect(service.findAll).toHaveBeenCalledTimes(1);
  });

  it('debe obtener una receta por id', async () => {
    const esperado = { id: 1, notes: 'Receta por ID' };
    service.findById.mockResolvedValue(esperado as never);

    await expect(controller.findById(1)).resolves.toEqual(esperado);
    expect(service.findById).toHaveBeenCalledWith(1);
    expect(service.findById).toHaveBeenCalledTimes(1);
  });

  it('debe actualizar una receta', async () => {
    const dto = { notes: 'Receta actualizada' } as unknown as UpdatePrescriptionDto;
    const esperado = { id: 1, ...dto };
    service.update.mockResolvedValue(esperado as never);

    await expect(controller.update(1, dto)).resolves.toEqual(esperado);
    expect(service.update).toHaveBeenCalledWith(1, dto);
    expect(service.update).toHaveBeenCalledTimes(1);
  });

  it('debe cancelar una receta', async () => {
    const esperado = { id: 1, status: 'CANCELADA' };
    service.cancel.mockResolvedValue(esperado as never);

    await expect(controller.cancel(1)).resolves.toEqual(esperado);
    expect(service.cancel).toHaveBeenCalledWith(1);
    expect(service.cancel).toHaveBeenCalledTimes(1);
  });

  it('debe eliminar una receta', async () => {
    const esperado = { id: 1, isDeleted: true };
    service.delete.mockResolvedValue(esperado as never);

    await expect(controller.delete(1)).resolves.toEqual(esperado);
    expect(service.delete).toHaveBeenCalledWith(1);
    expect(service.delete).toHaveBeenCalledTimes(1);
  });
});