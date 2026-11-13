import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  IsAscii,
} from 'class-validator';
export class RegisterDeviceDto {
  @ApiProperty({
    description: 'Token push del dispositivo; se almacena sin simular envio.',
  })
  @IsString()
  @IsNotEmpty()
  @IsAscii()
  @MaxLength(2048)
  token!: string;
  @ApiProperty({ enum: ['ios', 'android', 'web'] })
  @IsEnum({ ios: 'ios', android: 'android', web: 'web' })
  platform!: 'ios' | 'android' | 'web';
}
