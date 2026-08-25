import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
/**
 * Ejecuta la operación public.
 * @returns Resultado producido por la operación.
 */
/**
 * Ejecuta la operación public.
 * @returns Resultado producido por la operación.
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
