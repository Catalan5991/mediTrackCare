import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Forma del usuario que Passport adjunta al request despues de validar el JWT.
export type CurrentUserData = {
  id: number;
  name: string;
  email: string;
  role: string;
};

// Extrae request.user para que los controladores no dependan del objeto Request completo.
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): CurrentUserData => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
