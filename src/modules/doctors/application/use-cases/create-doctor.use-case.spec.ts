import { Doctor } from '../../domain/entities/doctor.entity';
import { DoctorAlreadyExistsException } from '../../domain/exceptions/doctor-already-exists.exception';
import { InvalidDoctorUserException } from '../../domain/exceptions/invalid-doctor-user.exception';
import { DoctorsRepository } from '../../domain/interfaces/doctors.repository.interface';
import { User } from '../../../users/domain/entities/user';
import { UsersRepository } from '../../../users/domain/interfaces/user-repository.interface';
import { CreateDoctorUseCase } from './create-doctor.use-case';

const doctorUser = User.create({
  id: 1,
  name: 'Doctor',
  email: 'doctor@example.com',
  password: 'hash',
  role: 'DOCTOR',
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
});

describe('Caso de uso para crear un doctor', () => {
  let doctors: jest.Mocked<DoctorsRepository>;
  let users: jest.Mocked<UsersRepository>;
  let useCase: CreateDoctorUseCase;

  beforeEach(() => {
    doctors = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByUserId: jest.fn(),
      findByProfessionalLicense: jest.fn(),
      findDuplicateForUpdate: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
      assignPatient: jest.fn(),
      removePatient: jest.fn(),
      findPatientAssignments: jest.fn(),
    };
    users = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findByEmailExceptId: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
    };
    useCase = new CreateDoctorUseCase(doctors, users);
  });

  it('crea un perfil para un usuario existente con rol DOCTOR', async () => {
    users.findById.mockResolvedValue(doctorUser);
    doctors.findByUserId.mockResolvedValue(null);
    doctors.findByProfessionalLicense.mockResolvedValue(null);
    const expected = new Doctor(
      1,
      1,
      'Doctor',
      'CED-1',
      null,
      null,
      null,
      true,
      new Date(),
      new Date(),
    );
    doctors.create.mockResolvedValue(expected);
    await expect(
      useCase.execute({
        userId: 1,
        fullName: 'Doctor',
        professionalLicense: 'CED-1',
      }),
    ).resolves.toBe(expected);
  });

  it('rechaza usuarios inexistentes o sin rol DOCTOR', async () => {
    users.findById.mockResolvedValue(null);
    await expect(
      useCase.execute({ userId: 1, fullName: 'Doctor' }),
    ).rejects.toBeInstanceOf(InvalidDoctorUserException);
  });

  it('rechaza un perfil de doctor duplicado', async () => {
    users.findById.mockResolvedValue(doctorUser);
    doctors.findByUserId.mockResolvedValue({} as Doctor);
    await expect(
      useCase.execute({ userId: 1, fullName: 'Doctor' }),
    ).rejects.toBeInstanceOf(DoctorAlreadyExistsException);
  });
});
