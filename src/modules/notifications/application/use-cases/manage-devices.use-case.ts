import { Inject, Injectable } from '@nestjs/common';
import { DEVICES_REPOSITORY } from '../../domain/interfaces/devices.repository';
import type { DevicesRepository } from '../../domain/interfaces/devices.repository';
import { RegisterDeviceDto } from '../dtos/register-device.dto';
@Injectable()
export class ManageDevicesUseCase {
  constructor(
    @Inject(DEVICES_REPOSITORY) private readonly devices: DevicesRepository,
  ) {}
  register(dto: RegisterDeviceDto) {
    return this.devices.register(dto);
  }
  list() {
    return this.devices.list();
  }
  revoke(id: number) {
    return this.devices.revoke(id);
  }
}
