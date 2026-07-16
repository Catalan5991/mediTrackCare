// Permisos de alto nivel definidos desde la matriz funcional del sistema.
//
// Importante:
// - Estos permisos autorizan acciones generales, no filtran datos por si solos.
// - Alcances como "solo mis pacientes" o "solo mi informacion" deben validarse
//   en casos de uso/repositorios, porque dependen de relaciones en base de datos.
// - Mantener nombres en ingles y estables evita acoplar mensajes de UI a reglas.
export enum Permission {
  // Dashboard operativo del sistema. Admin lo tiene por defecto; Doctor puede
  // habilitarse mediante configuracion.
  VIEW_GENERAL_DASHBOARD = 'VIEW_GENERAL_DASHBOARD',

  // CRUD de usuarios de la plataforma.
  MANAGE_USERS = 'MANAGE_USERS',

  // Consulta de pacientes bajo el alcance del rol. Para Patient significa
  // solamente su propio perfil; para Doctor/Caregiver, pacientes asignados.
  VIEW_ASSIGNED_PATIENTS = 'VIEW_ASSIGNED_PATIENTS',

  // Alta y modificaciones funcionales de recetas.
  CREATE_PRESCRIPTIONS = 'CREATE_PRESCRIPTIONS',

  // Registro o actualizacion de tomas de medicamento.
  REGISTER_INTAKES = 'REGISTER_INTAKES',

  // Registro o actualizacion de mediciones medicas.
  REGISTER_MEASUREMENTS = 'REGISTER_MEASUREMENTS',

  // Consulta de bitacora/auditoria del sistema.
  VIEW_AUDIT_LOGS = 'VIEW_AUDIT_LOGS',

  // CRUD de roles funcionales.
  MANAGE_ROLES = 'MANAGE_ROLES',

  // Carga de archivos/evidencias clinicas.
  UPLOAD_EVIDENCES = 'UPLOAD_EVIDENCES',
}
