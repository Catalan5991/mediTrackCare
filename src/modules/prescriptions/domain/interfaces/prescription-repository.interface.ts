import { PrescriptionStatus } from '../../../../../generated/prisma/client';
import { PrescriptionEntity } from '../entities/prescription.entity';

// Token usado por NestJS para inyectar la implementacion concreta del repositorio.
export const PRESCRIPTION_REPOSITORY = 'PRESCRIPTION_REPOSITORY';

// Datos necesarios para crear o reemplazar un medicamento dentro de una receta.
export interface PrescriptionItemInput {
  medicationId: number;
  dose: string;
  frequency: string;
  duration?: string;
  instructions?: string;
  startDate?: Date;
  endDate?: Date;
  quantity?: number;
}

// Contrato de entrada para registrar una receta con sus medicamentos.
export interface CreatePrescriptionInput {
  patientId: number;
  doctorId?: number;
  diagnosis?: string;
  generalInstructions?: string;
  issueDate?: Date;
  expirationDate?: Date;
  items: PrescriptionItemInput[];
}

// Contrato de entrada para modificar parcialmente una receta.
export interface UpdatePrescriptionInput {
  patientId?: number;
  doctorId?: number;
  diagnosis?: string;
  generalInstructions?: string;
  issueDate?: Date;
  expirationDate?: Date;
  status?: PrescriptionStatus;
  items?: PrescriptionItemInput[];
}

// Filtros aceptados por el listado de recetas.
export interface FindPrescriptionsFilters {
  page?: number;
  limit?: number;
  patientId?: number;
  doctorId?: number;
  status?: PrescriptionStatus;
  search?: string;
}

// Respuesta estandar para listados paginados de recetas.
export interface PaginatedPrescriptions {
  data: PrescriptionEntity[];
  total: number;
  page: number;
  limit: number;
}

// Puerto de persistencia del dominio; la infraestructura decide como implementarlo.
export interface PrescriptionRepository {
  create(data: CreatePrescriptionInput): Promise<PrescriptionEntity>;
  findAll(filters: FindPrescriptionsFilters): Promise<PaginatedPrescriptions>;
  findById(id: number): Promise<PrescriptionEntity | null>;
  update(
    id: number,
    data: UpdatePrescriptionInput,
  ): Promise<PrescriptionEntity>;
  delete(id: number): Promise<void>;
}
