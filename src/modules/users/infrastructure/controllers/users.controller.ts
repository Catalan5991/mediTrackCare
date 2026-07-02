import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseFilters,
} from '@nestjs/common';
import { CreateUserDto } from '../../application/dtos/create-user.dto';
import { UpdateUserDto } from '../../application/dtos/update-user.dto';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { GetUsersUseCase } from '../../application/use-cases/get-users.use-case';
import { GetUserUseCase } from '../../application/use-cases/get-user.use-case';
import { UpdateUserUseCase } from '../../application/use-cases/update-user.use-case';
import { DeleteUserUseCase } from '../../application/use-cases/delete-user.use-case';
import { UsersExceptionFilter } from '../filters/users-exception.filter';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserResponseDto } from '../../application/dtos/user-response.dto';

// Expone endpoints CRUD y mantiene la logica de negocio en los casos de uso.
@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseFilters(UsersExceptionFilter)
export class UsersController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUsersUseCase: GetUsersUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear un usuario' })
  @ApiResponse({
    status: 201,
    description: 'Usuario creado correctamente.',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos de usuario invalidos.' })
  @ApiResponse({
    status: 401,
    description: 'No autorizado. Token JWT invalido o no proporcionado.',
  })
  @ApiResponse({
    status: 409,
    description: 'El correo electronico ya esta registrado.',
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.createUserUseCase.execute(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar usuarios' })
  @ApiResponse({
    status: 200,
    description: 'Listado de usuarios obtenido correctamente.',
    type: [UserResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado. Token JWT invalido o no proporcionado.',
  })
  findAll() {
    return this.getUsersUseCase.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un usuario por id' })
  @ApiResponse({
    status: 200,
    description: 'Usuario obtenido correctamente.',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado. Token JWT invalido o no proporcionado.',
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.getUserUseCase.execute(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un usuario' })
  @ApiResponse({
    status: 200,
    description: 'Usuario actualizado correctamente.',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos de usuario invalidos.' })
  @ApiResponse({
    status: 401,
    description: 'No autorizado. Token JWT invalido o no proporcionado.',
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.updateUserUseCase.execute(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un usuario' })
  @ApiResponse({
    status: 200,
    description: 'Usuario eliminado correctamente.',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado. Token JWT invalido o no proporcionado.',
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.deleteUserUseCase.execute(id);
  }
}
