import { CreateIntakeDto } from '../../application/dtos/create-intake.dto';
import { FindIntakesDto } from '../../application/dtos/find-intakes.dto';
import { UpdateIntakeDto } from '../../application/dtos/update-intake.dto';
import { IntakeEntity } from '../entities/intake.entity';

export const INTAKES_REPOSITORY = 'INTAKES_REPOSITORY';

// Forma comun de respuesta para listados paginados de tomas.
export interface IntakesPaginatedResponse {
  data: IntakeEntity[];
  meta: {
    total: number;
    page: number;
    limit: number;
    lastPage: number;
  };
}

// Contrato que desacopla los casos de uso de la implementacion con Prisma.
export interface IntakesRepository {
  create(data: CreateIntakeDto): Promise<IntakeEntity>;

  findAll(filters: FindIntakesDto): Promise<IntakesPaginatedResponse>;

  findById(id: number): Promise<IntakeEntity | null>;

  update(id: number, data: UpdateIntakeDto): Promise<IntakeEntity>;

  delete(id: number): Promise<void>;
}
