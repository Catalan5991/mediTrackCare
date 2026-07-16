import { Permission } from '../enums/permission.enum';
import { SystemRole } from '../enums/system-role.enum';

// Relacion entre permisos configurables y el nombre de la variable de entorno
// que los habilita para un rol especifico.
export type RolePermissionConfig = Partial<Record<Permission, string>>;

// Matriz base de permisos por rol.
//
// Esta tabla representa el comportamiento por defecto de la API. Si una accion
// esta marcada como "segun configuracion" en la matriz funcional, no se incluye
// aqui; se agrega en CONFIGURABLE_ROLE_PERMISSIONS para mantenerla cerrada por
// defecto y habilitarla de forma explicita por ambiente.
export const ROLE_PERMISSIONS: Record<SystemRole, Permission[]> = {
  // Admin puede ejecutar todas las acciones operativas y administrativas.
  [SystemRole.ADMIN]: [
    Permission.VIEW_GENERAL_DASHBOARD,
    Permission.MANAGE_USERS,
    Permission.VIEW_ASSIGNED_PATIENTS,
    Permission.CREATE_PRESCRIPTIONS,
    Permission.REGISTER_INTAKES,
    Permission.REGISTER_MEASUREMENTS,
    Permission.VIEW_AUDIT_LOGS,
    Permission.MANAGE_ROLES,
    Permission.UPLOAD_EVIDENCES,
  ],
  // Doctor consulta pacientes asignados, crea recetas, registra mediciones y
  // puede cargar evidencias. Dashboard general y tomas quedan configurables.
  [SystemRole.DOCTOR]: [
    Permission.VIEW_ASSIGNED_PATIENTS,
    Permission.CREATE_PRESCRIPTIONS,
    Permission.REGISTER_MEASUREMENTS,
    Permission.UPLOAD_EVIDENCES,
  ],
  // Caregiver opera el seguimiento diario: pacientes asignados, tomas,
  // mediciones y evidencias. No administra recetas, usuarios ni auditoria.
  [SystemRole.CAREGIVER]: [
    Permission.VIEW_ASSIGNED_PATIENTS,
    Permission.REGISTER_INTAKES,
    Permission.REGISTER_MEASUREMENTS,
    Permission.UPLOAD_EVIDENCES,
  ],
  // Patient puede consultar su propia informacion y registrar su seguimiento.
  // Carga de evidencias queda configurable.
  [SystemRole.PATIENT]: [
    Permission.VIEW_ASSIGNED_PATIENTS,
    Permission.REGISTER_INTAKES,
    Permission.REGISTER_MEASUREMENTS,
  ],
};

// Permisos que la matriz define como "segun configuracion".
//
// Por defecto quedan cerrados salvo que la variable de entorno correspondiente
// sea true/1/yes/on. Esto permite activar capacidades por despliegue sin cambiar
// codigo ni abrir permisos sensibles accidentalmente.
//
// Variables actuales:
// - PERMISSION_DOCTOR_VIEW_GENERAL_DASHBOARD
// - PERMISSION_DOCTOR_REGISTER_INTAKES
// - PERMISSION_PATIENT_UPLOAD_EVIDENCES
export const CONFIGURABLE_ROLE_PERMISSIONS: Record<
  SystemRole,
  RolePermissionConfig
> = {
  [SystemRole.ADMIN]: {},
  [SystemRole.DOCTOR]: {
    [Permission.VIEW_GENERAL_DASHBOARD]:
      'PERMISSION_DOCTOR_VIEW_GENERAL_DASHBOARD',
    [Permission.REGISTER_INTAKES]: 'PERMISSION_DOCTOR_REGISTER_INTAKES',
  },
  [SystemRole.CAREGIVER]: {},
  [SystemRole.PATIENT]: {
    [Permission.UPLOAD_EVIDENCES]: 'PERMISSION_PATIENT_UPLOAD_EVIDENCES',
  },
};
