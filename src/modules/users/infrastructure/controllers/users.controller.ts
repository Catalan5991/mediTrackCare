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
import { Permissions } from '../../../../common/decorators/permissions.decorator';
import { Permission } from '../../../../common/enums/permission.enum';

// Expone endpoints CRUD y mantiene la logica de negocio en los casos de uso.
@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
//@Permissions(Permission.MANAGE_USERS)
@UseFilters(UsersExceptionFilter)
export class UsersController {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param createUserUseCase Caso de uso encargado de create user use case.
   * @param getUsersUseCase Caso de uso encargado de get users use case.
   * @param getUserUseCase Caso de uso encargado de get user use case.
   * @param updateUserUseCase Caso de uso encargado de update user use case.
   * @param deleteUserUseCase Caso de uso encargado de delete user use case.
   */
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUsersUseCase: GetUsersUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}
  /**
   * Crea un usuario con los datos recibidos.
   * @param createUserDto Datos de create user validados para la operacion.
   * @returns Resultado producido por la operación.
   */
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
  /**
   * Obtiene el listado de usuarios que cumplen los filtros indicados.
   * @returns Resultado producido por la operación.
   */
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
  /**
   * Obtiene un usuario por su identificador.
   * @param id Identificador único del recurso.
   * @returns Resultado producido por la operación.
   */
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
  /**
   * Actualiza un usuario existente.
   * @param id Identificador único del recurso.
   * @param updateUserDto Datos de update user validados para la operacion.
   * @returns Resultado producido por la operación.
   */
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
  /**
   * Elimina un usuario por su identificador.
   * @param id Identificador único del recurso.
   * @returns Resultado producido por la operación.
   */
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
