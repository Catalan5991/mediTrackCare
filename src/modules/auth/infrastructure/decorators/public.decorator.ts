import { SetMetadata } from '@nestjs/common';

// Clave que el guard global usa para omitir autenticacion en rutas publicas.
export const IS_PUBLIC_KEY = 'isPublic';

// Marca endpoints como publicos sin duplicar condiciones dentro del guard.
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
