import type { RegisterDeviceDto } from '../../application/dtos/register-device.dto';
export const DEVICES_REPOSITORY = 'DEVICES_REPOSITORY';
export interface DevicesRepository {
  register(dto: RegisterDeviceDto): Promise<unknown>;
  list(): Promise<unknown>;
  revoke(id: number): Promise<unknown>;
}
