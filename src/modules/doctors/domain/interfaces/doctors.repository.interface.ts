import { Doctor } from '../entities/doctor.entity';
import { DoctorPatientAssignment } from '../entities/doctor-patient.entity';

export const DOCTORS_REPOSITORY = Symbol('DOCTORS_REPOSITORY');

export interface CreateDoctorData {
  userId: number;
  fullName: string;
  professionalLicense?: string;
  specialty?: string;
  phone?: string;
  email?: string;
}

export interface UpdateDoctorData {
  userId?: number;
  fullName?: string;
  professionalLicense?: string | null;
  specialty?: string | null;
  phone?: string | null;
  email?: string | null;
  isActive?: boolean;
}

export interface FindDoctorsParams {
  search?: string;
  specialty?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface PaginatedDoctors {
  data: Doctor[];
  total: number;
  page: number;
  limit: number;
  lastPage: number;
}

export interface DoctorsRepository {
  create(data: CreateDoctorData): Promise<Doctor>;
  findAll(params: FindDoctorsParams): Promise<PaginatedDoctors>;
  findById(id: number): Promise<Doctor | null>;
  findByUserId(userId: number): Promise<Doctor | null>;
  findByProfessionalLicense(license: string): Promise<Doctor | null>;
  findDuplicateForUpdate(
    id: number,
    userId?: number,
    license?: string | null,
  ): Promise<Doctor | null>;
  update(id: number, data: UpdateDoctorData): Promise<Doctor>;
  softDelete(id: number): Promise<Doctor>;
  assignPatient(
    doctorId: number,
    patientId: number,
  ): Promise<DoctorPatientAssignment>;
  removePatient(
    doctorId: number,
    patientId: number,
  ): Promise<DoctorPatientAssignment>;
  findPatientAssignments(doctorId: number): Promise<DoctorPatientAssignment[]>;
}
