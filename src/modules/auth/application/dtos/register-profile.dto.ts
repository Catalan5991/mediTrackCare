import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, Matches } from 'class-validator';
import { RegisterDto } from './register.dto';
export class RegisterPatientDto extends OmitType(RegisterDto, [
  'phone',
] as const) {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  @Matches(/\S/)
  declare phone: string;
}
export class RegisterCaregiverDto extends RegisterPatientDto {}
export class RegisterDoctorDto extends RegisterDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  professionalLicense!: string;
  @ApiProperty() @IsString() @IsNotEmpty() @MaxLength(120) specialty!: string;
}
