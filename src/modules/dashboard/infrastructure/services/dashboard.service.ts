import { Injectable } from '@nestjs/common';

import {
  DashboardFilterDto,
  DashboardPeriod,
} from '../../application/dtos/dashboard-filter.dto';
import { DashboardPeriodRange } from '../../domain/entities/admin-dashboard.entity';
import { DashboardAlertEntity } from '../../domain/entities/dashboard-alert.entity';
import { PatientDashboardEntity } from '../../domain/entities/patient-dashboard.entity';
import { DashboardServiceInterface } from '../../domain/interfaces/dashboard-service.interface';

@Injectable()
// Servicio de reglas puras del Dashboard. Centraliza calculos reutilizables
// para que controller y repositorio no dupliquen logica de fechas o porcentajes.
export class DashboardService implements DashboardServiceInterface {
  resolvePeriod(period?: DashboardFilterDto['period']): DashboardPeriodRange {
    // Normaliza el rango a dias completos en UTC para que las graficas incluyan
    // el primer y ultimo dia del periodo seleccionado.
    const value = period ?? DashboardPeriod.THIRTY_DAYS;
    const daysByPeriod: Record<DashboardPeriod, number> = {
      [DashboardPeriod.SEVEN_DAYS]: 7,
      [DashboardPeriod.THIRTY_DAYS]: 30,
      [DashboardPeriod.NINETY_DAYS]: 90,
    };

    const endDate = new Date();
    endDate.setUTCHours(23, 59, 59, 999);

    const startDate = new Date(endDate);
    startDate.setUTCDate(startDate.getUTCDate() - (daysByPeriod[value] - 1));
    startDate.setUTCHours(0, 0, 0, 0);

    return {
      value,
      startDate,
      endDate,
    };
  }

  calculatePercentage(part: number, total: number): number {
    // Evita divisiones entre cero en adherencia y lectura de notificaciones.
    if (total <= 0) {
      return 0;
    }

    return this.round((part / total) * 100);
  }

  round(value: number): number {
    return Math.round(value * 100) / 100;
  }

  createDailyIntakeSeries(
    startDate: Date,
    endDate: Date,
    rows: Array<{ scheduledAt: Date; status: string }>,
  ): Array<{ date: string; completed: number; missed: number }> {
    // Inicializa todos los dias con cero para que frontend no tenga que inferir
    // huecos cuando no hubo tomas en una fecha.
    const series = this.createDateKeys(startDate, endDate).map((date) => ({
      date,
      completed: 0,
      missed: 0,
    }));

    const byDate = new Map(series.map((item) => [item.date, item]));

    for (const row of rows) {
      const key = this.toDateKey(row.scheduledAt);
      const item = byDate.get(key);

      if (!item) {
        continue;
      }

      if (row.status === 'TOMADA') {
        item.completed += 1;
      }

      if (row.status === 'OMITIDA') {
        item.missed += 1;
      }
    }

    return series;
  }

  createDailyTotalSeries(
    startDate: Date,
    endDate: Date,
    rows: Date[],
  ): Array<{ date: string; total: number }> {
    // Serie generica para graficas diarias simples como registros de usuarios.
    const series = this.createDateKeys(startDate, endDate).map((date) => ({
      date,
      total: 0,
    }));

    const byDate = new Map(series.map((item) => [item.date, item]));

    for (const row of rows) {
      const item = byDate.get(this.toDateKey(row));

      if (item) {
        item.total += 1;
      }
    }

    return series;
  }

  toDateKey(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  buildPatientAlerts(dashboard: PatientDashboardEntity): DashboardAlertEntity[] {
    // Las alertas son informativas y evitan formular diagnosticos medicos.
    const alerts: DashboardAlertEntity[] = [];

    if (dashboard.nextIntakes.length > 0) {
      alerts.push(
        new DashboardAlertEntity(
          'UPCOMING_INTAKE',
          'INFO',
          'Toma programada proxima',
          `Tu proxima toma esta programada para ${dashboard.nextIntakes[0].scheduledAt.toISOString()}.`,
        ),
      );
    }

    if (dashboard.adherence.missed > 0) {
      alerts.push(
        new DashboardAlertEntity(
          'MISSED_INTAKES',
          'WARNING',
          'Tomas omitidas registradas',
          `Tienes ${dashboard.adherence.missed} toma(s) omitida(s) en el periodo seleccionado.`,
        ),
      );
    }

    if (
      dashboard.adherence.scheduled > 0 &&
      dashboard.adherence.last7DaysPercentage < 70
    ) {
      alerts.push(
        new DashboardAlertEntity(
          'LOW_ADHERENCE',
          'WARNING',
          'Adherencia por debajo del objetivo',
          `Tu adherencia de los ultimos 7 dias es del ${dashboard.adherence.last7DaysPercentage}%.`,
        ),
      );
    }

    const endingSoon = dashboard.currentMedications.some((item) => {
      if (!item.endDate) {
        return false;
      }

      const now = new Date();
      const sevenDaysFromNow = new Date(now);
      sevenDaysFromNow.setUTCDate(sevenDaysFromNow.getUTCDate() + 7);

      return item.endDate >= now && item.endDate <= sevenDaysFromNow;
    });

    if (endingSoon) {
      alerts.push(
        new DashboardAlertEntity(
          'PRESCRIPTION_ENDING_SOON',
          'INFO',
          'Receta proxima a finalizar',
          'Una de tus recetas activas finaliza dentro de los proximos 7 dias.',
        ),
      );
    }

    if (dashboard.recentMeasurements.length === 0) {
      alerts.push(
        new DashboardAlertEntity(
          'NO_RECENT_MEASUREMENTS',
          'INFO',
          'Sin mediciones recientes',
          'No hay mediciones medicas registradas en el periodo seleccionado.',
        ),
      );
    }

    if (dashboard.notifications.unread > 0) {
      alerts.push(
        new DashboardAlertEntity(
          'UNREAD_NOTIFICATIONS',
          'INFO',
          'Notificaciones pendientes de lectura',
          `Tienes ${dashboard.notifications.unread} notificacion(es) sin leer.`,
        ),
      );
    }

    return alerts;
  }

  private createDateKeys(startDate: Date, endDate: Date): string[] {
    // Genera claves ISO yyyy-mm-dd entre dos fechas inclusivas.
    const keys: string[] = [];
    const cursor = new Date(startDate);
    cursor.setUTCHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setUTCHours(0, 0, 0, 0);

    while (cursor <= end) {
      keys.push(this.toDateKey(cursor));
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }

    return keys;
  }
}
