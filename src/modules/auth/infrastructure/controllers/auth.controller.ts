import {
  Body,
  HttpCode,
  Controller,
  Get,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import {
  ForgotPasswordDto,
  ResetPasswordDto,
  PasswordResetResponseDto,
} from '../../application/dtos/password-reset.dto';
import { PasswordResetUseCase } from '../../application/use-cases/password-reset.use-case';
import {
  RegisterPatientDto,
  RegisterCaregiverDto,
  RegisterDoctorDto,
} from '../../application/dtos/register-profile.dto';
import { RegisterDto } from '../../application/dtos/register.dto';
import { LoginDto } from '../../application/dtos/login.dto';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case';
import { LoginUserUseCase } from '../../application/use-cases/login-user.use-case';
import { GetProfileUseCase } from '../../application/use-cases/get-profile.use-case';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/curren-user.decorator';
import type { CurrentUserData } from '../decorators/curren-user.decorator';
import { Public } from '../decorators/public.decorator';
import { AuthExceptionFilter } from '../filters/auth-exception.filter';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthResponseDto } from '../../application/dtos/auth-response.dto';

// Expone la API HTTP de autenticacion y delega la logica a casos de uso.
@ApiTags('Auth')
@ApiBearerAuth()
@Controller('auth')
@UseFilters(AuthExceptionFilter)
export class AuthController {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param registerUserUseCase Caso de uso encargado de register user use case.
   * @param loginUserUseCase Caso de uso encargado de login user use case.
   * @param getProfileUseCase Caso de uso encargado de get profile use case.
   */
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly getProfileUseCase: GetProfileUseCase,
    private readonly passwordResetUseCase: PasswordResetUseCase,
  ) {}
  /**
   * Ejecuta la operación register.
   * @param registerDto Datos de register validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiResponse({
    status: 201,
    description: 'Usuario registrado correctamente.',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos de registro invalidos.' })
  @ApiResponse({
    status: 409,
    description: 'El correo electronico ya esta registrado.',
  })
  register(@Body() registerDto: RegisterDto) {
    return this.registerUserUseCase.execute(registerDto);
  }
  /**
   * Ejecuta la operación login.
   * @param loginDto Datos de login validados para la operacion.
   * @returns Resultado producido por la operación.
   */
  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesion' })
  @ApiResponse({
    status: 201,
    description: 'Sesion iniciada correctamente.',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Credenciales invalidas o datos incompletos.',
  })
  @ApiResponse({ status: 401, description: 'Credenciales incorrectas.' })
  login(@Body() loginDto: LoginDto) {
    return this.loginUserUseCase.execute(loginDto);
  }
  /**
   * Obtiene profile.
   * @param user Valor de user requerido por la operacion.
   * @returns Resultado producido por la operación.
   */
  @Public()
  @Post('forgot-password')
  @HttpCode(200)
  @ApiOperation({ summary: 'Solicitar un enlace de recuperacion por correo' })
  @ApiResponse({ status: 200, type: PasswordResetResponseDto })
  @ApiResponse({ status: 400, description: 'Correo invalido.' })
  @ApiResponse({
    status: 503,
    description: 'Servicio de recuperacion sin configurar.',
  })
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.passwordResetUseCase.request(dto);
  }

  @Public()
  @Post('reset-password')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Restablecer la contrasena con un token de un solo uso',
  })
  @ApiResponse({ status: 200, type: PasswordResetResponseDto })
  @ApiResponse({
    status: 400,
    description: 'Datos invalidos o token vencido, usado o incorrecto.',
  })
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.passwordResetUseCase.reset(dto);
  }

  @Public()
  @Post('register/patient')
  @ApiOperation({ summary: 'Registrar paciente con perfil y telefono' })
  @ApiResponse({ status: 201, type: AuthResponseDto })
  registerPatient(@Body() dto: RegisterPatientDto) {
    return this.registerUserUseCase.execute(dto, 'PATIENT');
  }
  @Public()
  @Post('register/caregiver')
  @ApiOperation({
    summary:
      'Registrar cuidador sin acceso clinico hasta autorizacion del paciente',
  })
  @ApiResponse({ status: 201, type: AuthResponseDto })
  registerCaregiver(@Body() dto: RegisterCaregiverDto) {
    return this.registerUserUseCase.execute(dto, 'CAREGIVER');
  }
  @Public()
  @Post('register/doctor')
  @ApiOperation({
    summary: 'Solicitar registro medico; verificacion profesional pendiente',
  })
  @ApiResponse({ status: 201, type: AuthResponseDto })
  registerDoctor(@Body() dto: RegisterDoctorDto) {
    return this.registerUserUseCase.execute(dto, 'DOCTOR');
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener el perfil del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Perfil obtenido correctamente.' })
  @ApiResponse({
    status: 401,
    description: 'No autorizado. Token JWT invalido o no proporcionado.',
  })
  getProfile(@CurrentUser() user: CurrentUserData) {
    return this.getProfileUseCase.execute(user.id);
  }
}
