// Roles funcionales soportados por la API.
//
// La estrategia JWT devuelve request.user.role como string desde la base de
// datos. RolesGuard lo normaliza a este enum para evitar comparaciones libres
// y mantener un vocabulario unico en decoradores y matriz de permisos.
export enum SystemRole {
  // Acceso total administrativo.
  ADMIN = 'ADMIN',

  // Profesional medico con acceso a pacientes asignados y recetas.
  DOCTOR = 'DOCTOR',

  // Usuario que apoya el seguimiento diario de uno o mas pacientes.
  CAREGIVER = 'CAREGIVER',

  // Paciente autenticado. Su alcance debe limitarse a su propia informacion.
  PATIENT = 'PATIENT',
}
