import { Injectable } from '@nestjs/common';
import {
  IntakeStatus,
  NotificationStatus,
  PrescriptionStatus,
} from '../../../../../generated/prisma/client';

import { PrismaService } from '../../../prisma/prisma.service';
import {
  AdminDashboardEntity,
  DashboardPeriodRange,
} from '../../domain/entities/admin-dashboard.entity';
import { PatientDashboardEntity } from '../../domain/entities/patient-dashboard.entity';
import { PatientProfileNotFoundException } from '../../domain/exceptions/patient-profile-not-found.exception';
import { DashboardRepository } from '../../domain/interfaces/dashboard.repository';
import { DashboardService } from '../services/dashboard.service';

@Injectable()
// Adaptador de persistencia del Dashboard con Prisma. Mantiene las consultas
// agregadas fuera de controller/use-cases y selecciona solo campos necesarios.
export class PrismaDashboardRepository implements DashboardRepository {
  /**
   * Inicializa una nueva instancia con sus dependencias y estado inicial.
   * @param prisma Servicio que coordina las operaciones de prisma.
   * @param dashboardService Servicio que coordina las operaciones de dashboard service.
   */
  constructor(
    private readonly prisma: PrismaService,
    private readonly dashboardService: DashboardService,
  ) {}
  /**
   * Obtiene admin metrics.
   * @param period Valor de period requerido por la operacion.
   * @returns Promesa que resuelve con el resultado de la operación.
   */
  async getAdminMetrics(
    period: DashboardPeriodRange,
  ): Promise<AdminDashboardEntity> {
    // Las recetas activas se consideran por estado y por fecha de finalizacion
    // para no contar tratamientos ya vencidos como vigentes.
    const now = new Date();
    const activePrescriptionWhere = this.activePrescriptionWhere(now);

    // Ejecuta metricas independientes en una transaccion para reducir viajes a
    // base de datos y mantener una lectura consistente del dashboard.
    const [
      totalUsers,
      activeUsers,
      inactiveUsers,
      totalPatients,
      totalDoctors,
      totalCaregivers,
      usersByRole,
      recentlyRegisteredUsers,
      totalMedications,
      totalPrescriptions,
      activePrescriptions,
      expiredPrescriptions,
      prescriptionItemsAggregate,
      mostPrescribedRows,
      patientsWithActivePrescriptionRows,
      totalIntakes,
      completedIntakes,
      pendingIntakes,
      missedIntakes,
      delayedIntakes,
      remindersTotal,
      remindersActive,
      remindersInactive,
      notificationsTotal,
      notificationsPending,
      notificationsSent,
      notificationsRead,
      notificationsUnread,
      medicalMeasurementsTotal,
      medicalMeasurementsRecent,
      measurementsByTypeRows,
      patientsRecentlyMeasuredRows,
      filesTotal,
      filesRecent,
      auditTotal,
      recentAuditRows,
      auditByModuleRows,
      intakeEvolutionRows,
      userRegistrationRows,
      lowAdherenceRows,
    ] = await this.prisma.$transaction([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { isActive: true } }),
      this.prisma.user.count({ where: { isActive: false } }),
      this.prisma.patient.count(),
      this.prisma.doctor.count(),
      this.prisma.caregiver.count(),
      this.prisma.user.groupBy({
        by: ['roleId'],
        _count: { _all: true },
        orderBy: { roleId: 'asc' },
      }),
      this.prisma.user.count({
        where: {
          createdAt: {
            gte: period.startDate,
            lte: period.endDate,
          },
        },
      }),
      this.prisma.medication.count(),
      this.prisma.prescription.count(),
      this.prisma.prescription.count({ where: activePrescriptionWhere }),
      this.prisma.prescription.count({
        where: {
          OR: [
            { status: PrescriptionStatus.FINALIZADO },
            { endDate: { lt: now } },
          ],
        },
      }),
      this.prisma.prescriptionItem.aggregate({
        _count: { _all: true },
      }),
      this.prisma.prescriptionItem.groupBy({
        by: ['medicationId'],
        _count: { _all: true },
        orderBy: {
          _count: {
            medicationId: 'desc',
          },
        },
        take: 5,
      }),
      this.prisma.prescription.groupBy({
        by: ['patientId'],
        where: activePrescriptionWhere,
        _count: { _all: true },
        orderBy: { patientId: 'asc' },
      }),
      this.prisma.intake.count(),
      this.prisma.intake.count({ where: { status: IntakeStatus.TOMADA } }),
      this.prisma.intake.count({ where: { status: IntakeStatus.PENDIENTE } }),
      this.prisma.intake.count({ where: { status: IntakeStatus.OMITIDA } }),
      this.prisma.intake.count({ where: { status: IntakeStatus.RETRASADA } }),
      this.prisma.reminder.count(),
      this.prisma.reminder.count({ where: { isActive: true } }),
      this.prisma.reminder.count({ where: { isActive: false } }),
      this.prisma.notification.count(),
      this.prisma.notification.count({
        where: { status: NotificationStatus.PENDIENTE },
      }),
      this.prisma.notification.count({
        where: { status: NotificationStatus.ENVIADA },
      }),
      this.prisma.notification.count({
        where: { status: NotificationStatus.LEIDA },
      }),
      this.prisma.notification.count({
        where: { readAt: null },
      }),
      this.prisma.medicalMeasurement.count(),
      this.prisma.medicalMeasurement.count({
        where: {
          measuredAt: {
            gte: period.startDate,
            lte: period.endDate,
          },
        },
      }),
      this.prisma.medicalMeasurement.groupBy({
        by: ['measurementType'],
        _count: { _all: true },
        orderBy: { measurementType: 'asc' },
      }),
      this.prisma.medicalMeasurement.groupBy({
        by: ['patientId'],
        where: {
          measuredAt: {
            gte: period.startDate,
            lte: period.endDate,
          },
        },
        _count: { _all: true },
        orderBy: { patientId: 'asc' },
      }),
      this.prisma.file.count(),
      this.prisma.file.count({
        where: {
          createdAt: {
            gte: period.startDate,
            lte: period.endDate,
          },
        },
      }),
      this.prisma.auditLog.count(),
      this.prisma.auditLog.findMany({
        select: {
          id: true,
          module: true,
          action: true,
          entityName: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      this.prisma.auditLog.groupBy({
        by: ['module'],
        _count: { _all: true },
        orderBy: {
          _count: {
            module: 'desc',
          },
        },
        take: 10,
      }),
      this.prisma.intake.findMany({
        where: {
          scheduledAt: {
            gte: period.startDate,
            lte: period.endDate,
          },
        },
        select: {
          scheduledAt: true,
          status: true,
        },
      }),
      this.prisma.user.findMany({
        where: {
          createdAt: {
            gte: period.startDate,
            lte: period.endDate,
          },
        },
        select: {
          createdAt: true,
        },
      }),
      this.prisma.intake.groupBy({
        by: ['patientId', 'status'],
        where: {
          scheduledAt: {
            gte: period.startDate,
            lte: period.endDate,
          },
        },
        _count: { _all: true },
        orderBy: [{ patientId: 'asc' }, { status: 'asc' }],
      }),
    ]);

    // Los groupBy retornan ids; estas consultas pequenas enriquecen la salida
    // con nombres legibles sin cargar usuarios, medicamentos o pacientes enteros.
    const roleNames = await this.prisma.role.findMany({
      where: {
        id: {
          in: usersByRole.map((item) => item.roleId),
        },
      },
      select: {
        id: true,
        name: true,
      },
    });
    const roleNameById = new Map(roleNames.map((role) => [role.id, role.name]));

    const medicationNames = await this.prisma.medication.findMany({
      where: {
        id: {
          in: mostPrescribedRows.map((item) => item.medicationId),
        },
      },
      select: {
        id: true,
        name: true,
      },
    });
    const medicationNameById = new Map(
      medicationNames.map((medication) => [medication.id, medication.name]),
    );

    // La baja adherencia se calcula con conteos agregados por paciente y estado,
    // evitando traer todas las tomas del periodo a memoria.
    const patientsWithLowAdherence =
      await this.buildPatientsWithLowAdherence(lowAdherenceRows);

    const prescriptionItemsTotal = prescriptionItemsAggregate._count._all;

    return new AdminDashboardEntity(
      period,
      {
        total: totalUsers,
        active: activeUsers,
        inactive: inactiveUsers,
        patients: totalPatients,
        doctors: totalDoctors,
        caregivers: totalCaregivers,
        byRole: usersByRole.map((item) => ({
          role: roleNameById.get(item.roleId) ?? `ROLE_${item.roleId}`,
          total: this.countAll(item),
        })),
        recentlyRegistered: recentlyRegisteredUsers,
      },
      {
        total: totalPatients,
        withActivePrescriptions: patientsWithActivePrescriptionRows.length,
      },
      {
        total: totalPrescriptions,
        active: activePrescriptions,
        expired: expiredPrescriptions,
        averageMedicationsPerPrescription: this.dashboardService.round(
          totalPrescriptions > 0
            ? prescriptionItemsTotal / totalPrescriptions
            : 0,
        ),
        mostPrescribedMedications: mostPrescribedRows.map((item) => ({
          medicationId: item.medicationId,
          medicationName:
            medicationNameById.get(item.medicationId) ??
            `Medicamento ${item.medicationId}`,
          total: this.countAll(item),
        })),
      },
      {
        total: totalIntakes,
        completed: completedIntakes,
        pending: pendingIntakes,
        missed: missedIntakes,
        delayed: delayedIntakes,
        adherencePercentage: this.dashboardService.calculatePercentage(
          completedIntakes,
          totalIntakes,
        ),
        patientsWithLowAdherence,
      },
      {
        total: remindersTotal,
        active: remindersActive,
        inactive: remindersInactive,
      },
      {
        total: notificationsTotal,
        pending: notificationsPending,
        sent: notificationsSent,
        read: notificationsRead,
        unread: notificationsUnread,
        readPercentage: this.dashboardService.calculatePercentage(
          notificationsRead,
          notificationsTotal,
        ),
      },
      {
        total: medicalMeasurementsTotal,
        recentlyRegistered: medicalMeasurementsRecent,
        byType: measurementsByTypeRows.map((item) => ({
          type: item.measurementType,
          total: this.countAll(item),
        })),
        patientsRecentlyMeasured: patientsRecentlyMeasuredRows.length,
      },
      {
        total: filesTotal,
        recentlyUploaded: filesRecent,
      },
      {
        total: auditTotal,
        recentActivities: recentAuditRows,
        byModule: auditByModuleRows.map((item) => ({
          module: item.module,
          total: this.countAll(item),
        })),
      },
      {
        adherenceEvolution: this.dashboardService.createDailyIntakeSeries(
          period.startDate,
          period.endDate,
          intakeEvolutionRows,
        ),
        userRegistrations: this.dashboardService.createDailyTotalSeries(
          period.startDate,
          period.endDate,
          userRegistrationRows.map((item) => item.createdAt),
        ),
      },
    );
  }
  /**
   * Obtiene patient metrics.
   * @param userId Valor de user id requerido por la operacion.
   * @param period Valor de period requerido por la operacion.
   * @returns Promesa que resuelve con el resultado de la operación.
   * @throws {PatientProfileNotFoundException} Cuando los datos o el estado incumplen la regla de negocio validada.
   */
  async getPatientMetrics(
    userId: number,
    period: DashboardPeriodRange,
  ): Promise<PatientDashboardEntity> {
    // El paciente se resuelve exclusivamente desde el userId autenticado. No se
    // acepta patientId de entrada, lo que bloquea consultas cruzadas por URL.
    const patient = await this.prisma.patient.findUnique({
      where: { userId },
      select: {
        id: true,
        fullName: true,
      },
    });

    if (!patient) {
      throw new PatientProfileNotFoundException(userId);
    }

    const patientId = patient.id;
    const now = new Date();
    // Filtros base reutilizados para mantener todas las consultas del paciente
    // dentro del mismo alcance de seguridad.
    const activePrescriptionWhere = {
      patientId,
      ...this.activePrescriptionWhere(now),
    };
    const currentMedicationWhere = {
      isActive: true,
      OR: [{ endDate: null }, { endDate: { gte: now } }],
      prescription: activePrescriptionWhere,
    };
    const notificationsWhere = { userId };
    const last7Start = this.daysAgoStart(7);
    const last30Start = this.daysAgoStart(30);

    // Recolecta resumen, adherencia, listas acotadas y datos de graficas en una
    // sola transaccion. Las listas usan take para proteger rendimiento.
    const [
      activePrescriptions,
      currentMedicationsTotal,
      activeReminders,
      medicalMeasurementsTotal,
      unreadNotifications,
      scheduledIntakes,
      completedIntakes,
      pendingIntakes,
      missedIntakes,
      scheduledLast7,
      completedLast7,
      scheduledLast30,
      completedLast30,
      nextIntakeRows,
      currentMedicationRows,
      recentMeasurementRows,
      remindersTotal,
      remindersActive,
      remindersInactive,
      upcomingReminderRows,
      notificationsTotal,
      notificationsPending,
      recentNotificationRows,
      intakeEvolutionRows,
      measurementEvolutionRows,
    ] = await this.prisma.$transaction([
      this.prisma.prescription.count({ where: activePrescriptionWhere }),
      this.prisma.prescriptionItem.count({ where: currentMedicationWhere }),
      this.prisma.reminder.count({
        where: {
          patientId,
          isActive: true,
        },
      }),
      this.prisma.medicalMeasurement.count({ where: { patientId } }),
      this.prisma.notification.count({
        where: {
          ...notificationsWhere,
          readAt: null,
        },
      }),
      this.prisma.intake.count({
        where: {
          patientId,
          scheduledAt: {
            gte: period.startDate,
            lte: period.endDate,
          },
        },
      }),
      this.prisma.intake.count({
        where: {
          patientId,
          status: IntakeStatus.TOMADA,
          scheduledAt: {
            gte: period.startDate,
            lte: period.endDate,
          },
        },
      }),
      this.prisma.intake.count({
        where: {
          patientId,
          status: IntakeStatus.PENDIENTE,
          scheduledAt: {
            gte: period.startDate,
            lte: period.endDate,
          },
        },
      }),
      this.prisma.intake.count({
        where: {
          patientId,
          status: IntakeStatus.OMITIDA,
          scheduledAt: {
            gte: period.startDate,
            lte: period.endDate,
          },
        },
      }),
      this.prisma.intake.count({
        where: {
          patientId,
          scheduledAt: {
            gte: last7Start,
            lte: now,
          },
        },
      }),
      this.prisma.intake.count({
        where: {
          patientId,
          status: IntakeStatus.TOMADA,
          scheduledAt: {
            gte: last7Start,
            lte: now,
          },
        },
      }),
      this.prisma.intake.count({
        where: {
          patientId,
          scheduledAt: {
            gte: last30Start,
            lte: now,
          },
        },
      }),
      this.prisma.intake.count({
        where: {
          patientId,
          status: IntakeStatus.TOMADA,
          scheduledAt: {
            gte: last30Start,
            lte: now,
          },
        },
      }),
      this.prisma.intake.findMany({
        where: {
          patientId,
          status: IntakeStatus.PENDIENTE,
          scheduledAt: {
            gte: now,
          },
        },
        select: {
          id: true,
          scheduledAt: true,
          status: true,
          prescriptionItem: {
            select: {
              dose: true,
              medication: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: { scheduledAt: 'asc' },
        take: 5,
      }),
      this.prisma.prescriptionItem.findMany({
        where: currentMedicationWhere,
        select: {
          dose: true,
          frequency: true,
          startDate: true,
          endDate: true,
          medication: {
            select: {
              name: true,
              presentation: true,
              concentration: true,
            },
          },
          prescription: {
            select: {
              status: true,
            },
          },
        },
        orderBy: { startDate: 'desc' },
        take: 20,
      }),
      this.prisma.medicalMeasurement.findMany({
        where: { patientId },
        select: {
          id: true,
          measurementType: true,
          value: true,
          secondValue: true,
          unit: true,
          measuredAt: true,
        },
        orderBy: { measuredAt: 'desc' },
        take: 5,
      }),
      this.prisma.reminder.count({ where: { patientId } }),
      this.prisma.reminder.count({
        where: {
          patientId,
          isActive: true,
        },
      }),
      this.prisma.reminder.count({
        where: {
          patientId,
          isActive: false,
        },
      }),
      this.prisma.reminder.findMany({
        where: {
          patientId,
          isActive: true,
        },
        select: {
          id: true,
          scheduledTime: true,
          daysOfWeek: true,
          isActive: true,
        },
        orderBy: { scheduledTime: 'asc' },
        take: 5,
      }),
      this.prisma.notification.count({ where: notificationsWhere }),
      this.prisma.notification.count({
        where: {
          ...notificationsWhere,
          status: NotificationStatus.PENDIENTE,
        },
      }),
      this.prisma.notification.findMany({
        where: notificationsWhere,
        select: {
          id: true,
          title: true,
          message: true,
          status: true,
          createdAt: true,
          readAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      this.prisma.intake.findMany({
        where: {
          patientId,
          scheduledAt: {
            gte: period.startDate,
            lte: period.endDate,
          },
        },
        select: {
          scheduledAt: true,
          status: true,
        },
      }),
      this.prisma.medicalMeasurement.findMany({
        where: {
          patientId,
          measuredAt: {
            gte: period.startDate,
            lte: period.endDate,
          },
        },
        select: {
          measurementType: true,
          value: true,
          secondValue: true,
          unit: true,
          measuredAt: true,
        },
        orderBy: { measuredAt: 'asc' },
      }),
    ]);

    // Convierte Decimal de Prisma a number para entregar una respuesta JSON
    // simple y consistente con los DTOs documentados.
    return new PatientDashboardEntity(
      period,
      {
        id: patient.id,
        name: patient.fullName,
      },
      {
        activePrescriptions,
        currentMedications: currentMedicationsTotal,
        activeReminders,
        medicalMeasurements: medicalMeasurementsTotal,
        unreadNotifications,
        nextIntakeAt: nextIntakeRows[0]?.scheduledAt ?? null,
        lastMeasurementAt: recentMeasurementRows[0]?.measuredAt ?? null,
      },
      {
        scheduled: scheduledIntakes,
        completed: completedIntakes,
        pending: pendingIntakes,
        missed: missedIntakes,
        percentage: this.dashboardService.calculatePercentage(
          completedIntakes,
          scheduledIntakes,
        ),
        last7DaysPercentage: this.dashboardService.calculatePercentage(
          completedLast7,
          scheduledLast7,
        ),
        last30DaysPercentage: this.dashboardService.calculatePercentage(
          completedLast30,
          scheduledLast30,
        ),
      },
      nextIntakeRows.map((item) => ({
        intakeId: item.id,
        medicationName: item.prescriptionItem.medication.name,
        dosage: item.prescriptionItem.dose,
        scheduledAt: item.scheduledAt,
        status: item.status,
      })),
      currentMedicationRows.map((item) => ({
        medicationName: item.medication.name,
        presentation: item.medication.presentation,
        concentration: item.medication.concentration,
        dose: item.dose,
        frequency: item.frequency,
        startDate: item.startDate,
        endDate: item.endDate,
        prescriptionStatus: item.prescription.status,
      })),
      recentMeasurementRows.map((item) => ({
        id: item.id,
        measurementType: item.measurementType,
        value: Number(item.value),
        secondValue:
          item.secondValue === null || item.secondValue === undefined
            ? null
            : Number(item.secondValue),
        unit: item.unit,
        measuredAt: item.measuredAt,
      })),
      {
        total: remindersTotal,
        active: remindersActive,
        inactive: remindersInactive,
        upcoming: upcomingReminderRows,
      },
      {
        total: notificationsTotal,
        pending: notificationsPending,
        unread: unreadNotifications,
        recent: recentNotificationRows.map((item) => ({
          id: item.id,
          title: item.title,
          message: item.message,
          status: item.status,
          createdAt: item.createdAt,
          readAt: item.readAt,
        })),
        latestNotificationAt: recentNotificationRows[0]?.createdAt ?? null,
      },
      {
        intakeEvolution: this.dashboardService.createDailyIntakeSeries(
          period.startDate,
          period.endDate,
          intakeEvolutionRows,
        ),
        measurementsEvolution: measurementEvolutionRows.map((item) => ({
          date: this.dashboardService.toDateKey(item.measuredAt),
          measurementType: item.measurementType,
          value: Number(item.value),
          secondValue:
            item.secondValue === null || item.secondValue === undefined
              ? null
              : Number(item.secondValue),
          unit: item.unit,
        })),
      },
      [],
    );
  }
  /**
   * Ejecuta la operación active prescription where.
   * @param now Valor de now requerido por la operacion.
   * @returns Resultado producido por la operación.
   */
  private activePrescriptionWhere(now: Date) {
    // Regla compartida para definir tratamientos activos.
    return {
      status: PrescriptionStatus.ACTIVO,
      OR: [{ endDate: null }, { endDate: { gte: now } }],
    };
  }
  /**
   * Ejecuta la operación days ago start.
   * @param days Valor de days requerido por la operacion.
   * @returns Resultado producido por la operación.
   */
  private daysAgoStart(days: number): Date {
    // Calcula el inicio UTC inclusivo de ventanas moviles como 7 y 30 dias.
    const date = new Date();
    date.setUTCDate(date.getUTCDate() - (days - 1));
    date.setUTCHours(0, 0, 0, 0);

    return date;
  }
  /**
   * Ejecuta la operación build patients with low adherence.
   * @param rows Valor de rows requerido por la operacion.
   * @returns Promesa que resuelve con el resultado de la operación.
   */
  private async buildPatientsWithLowAdherence(
    rows: Array<{
      patientId: number;
      status: IntakeStatus;
      _count?: true | { _all?: number };
    }>,
  ) {
    // Acumula tomas programadas y completadas por paciente desde el groupBy.
    const byPatient = new Map<
      number,
      {
        scheduled: number;
        completed: number;
      }
    >();

    for (const row of rows) {
      const current = byPatient.get(row.patientId) ?? {
        scheduled: 0,
        completed: 0,
      };

      const total = this.countAll(row);

      current.scheduled += total;

      if (row.status === IntakeStatus.TOMADA) {
        current.completed += total;
      }

      byPatient.set(row.patientId, current);
    }

    // Ordena de menor a mayor adherencia y limita el resultado administrativo.
    const lowAdherence = [...byPatient.entries()]
      .map(([patientId, totals]) => ({
        patientId,
        adherencePercentage: this.dashboardService.calculatePercentage(
          totals.completed,
          totals.scheduled,
        ),
      }))
      .filter((item) => item.adherencePercentage < 70)
      .sort((a, b) => a.adherencePercentage - b.adherencePercentage)
      .slice(0, 5);

    const patients = await this.prisma.patient.findMany({
      where: {
        id: {
          in: lowAdherence.map((item) => item.patientId),
        },
      },
      select: {
        id: true,
        fullName: true,
      },
    });
    const patientNameById = new Map(
      patients.map((patient) => [patient.id, patient.fullName]),
    );

    return lowAdherence.map((item) => ({
      patientId: item.patientId,
      patientName: patientNameById.get(item.patientId) ?? 'Paciente sin nombre',
      adherencePercentage: item.adherencePercentage,
    }));
  }
  /**
   * Ejecuta la operación count all.
   * @param row Valor de row requerido por la operacion.
   * @returns Resultado producido por la operación.
   */
  private countAll(row: { _count?: true | { _all?: number } }): number {
    // Prisma tipa _count de groupBy como union amplia; este helper normaliza
    // el acceso a _all y mantiene el resto del codigo mas legible.
    if (typeof row._count === 'object') {
      return row._count._all ?? 0;
    }

    return 0;
  }
}
