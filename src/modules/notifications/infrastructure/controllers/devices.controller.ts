import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ManageDevicesUseCase } from '../../application/use-cases/manage-devices.use-case';
import { RegisterDeviceDto } from '../../application/dtos/register-device.dto';
@ApiTags('Devices')
@ApiBearerAuth()
@Controller('devices')
export class DevicesController {
  constructor(private readonly devices: ManageDevicesUseCase) {}
  @Post()
  @ApiOperation({
    summary:
      'Registrar mi dispositivo push; envio externo pendiente de proveedor',
  })
  register(@Body() dto: RegisterDeviceDto) {
    return this.devices.register(dto);
  }
  @Get()
  @ApiOperation({ summary: 'Listar mis dispositivos sin exponer tokens' })
  list() {
    return this.devices.list();
  }
  @Delete(':id')
  @ApiOperation({ summary: 'Desvincular mi dispositivo' })
  revoke(@Param('id', ParseIntPipe) id: number) {
    return this.devices.revoke(id);
  }
}
