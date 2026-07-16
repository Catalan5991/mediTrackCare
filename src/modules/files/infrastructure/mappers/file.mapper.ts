import { File, Prisma } from '../../../../../generated/prisma/client';
import { FileResponseDto } from '../../application/dtos/file-response.dto';
import { FileEntity } from '../../domain/entities/file.entity';
import {
  CreateFileData,
  UpdateFileData,
} from '../../domain/interfaces/files.repository.interface';

export class FileMapper {
  static toEntity(file: File): FileEntity {
    return new FileEntity(
      file.id,
      file.patientId,
      file.prescriptionId,
      file.medicationId,
      file.fileName,
      file.fileUrl,
      file.fileType,
      file.description,
      file.createdAt,
    );
  }

  static toPrismaCreate(data: CreateFileData): Prisma.FileUncheckedCreateInput {
    return {
      patientId: data.patientId ?? null,
      prescriptionId: data.prescriptionId ?? null,
      medicationId: data.medicationId ?? null,
      fileName: data.fileName,
      fileUrl: data.fileUrl,
      fileType: data.fileType,
      description: data.description ?? null,
    };
  }

  static toPrismaUpdate(data: UpdateFileData): Prisma.FileUncheckedUpdateInput {
    const result: Prisma.FileUncheckedUpdateInput = {};
    if (data.patientId !== undefined) result.patientId = data.patientId;
    if (data.prescriptionId !== undefined)
      result.prescriptionId = data.prescriptionId;
    if (data.medicationId !== undefined)
      result.medicationId = data.medicationId;
    if (data.fileName !== undefined) result.fileName = data.fileName;
    if (data.fileUrl !== undefined) result.fileUrl = data.fileUrl;
    if (data.fileType !== undefined) result.fileType = data.fileType;
    if (data.description !== undefined) result.description = data.description;
    return result;
  }

  static toResponse(file: FileEntity): FileResponseDto {
    return { ...file };
  }
}
