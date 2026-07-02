import {
  Body,
  Controller,
  Get,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
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
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly getProfileUseCase: GetProfileUseCase,
  ) {}

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
