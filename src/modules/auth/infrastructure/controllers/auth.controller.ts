import { Body, Controller, Get, Post, UseFilters, UseGuards } from '@nestjs/common';
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

// Expone la API HTTP de autenticacion y delega la logica a casos de uso.
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
  register(@Body() registerDto: RegisterDto) {
    return this.registerUserUseCase.execute(registerDto);
  }

  @Public()
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.loginUserUseCase.execute(loginDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@CurrentUser() user: CurrentUserData) {
    return this.getProfileUseCase.execute(user.id);
  }
}
