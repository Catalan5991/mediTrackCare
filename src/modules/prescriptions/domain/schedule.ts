// Fechas civiles se conservan como YYYY-MM-DD; instantes de tomas usan UTC.
export function localDate(instant: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(instant);
  const part = (key: string) => parts.find((p) => p.type === key)!.value;
  return part('year') + '-' + part('month') + '-' + part('day');
}
export function addDays(date: string, count: number): string {
  return new Date(Date.parse(date + 'T00:00:00Z') + count * 86400000)
    .toISOString()
    .slice(0, 10);
}
export function localInstant(
  date: string,
  time: string,
  timeZone: string,
): Date | null {
  const target = Date.parse(date + 'T' + time + ':00Z');
  let candidate = target;
  const format = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  });
  for (let i = 0; i < 4; i++) {
    const parts = format.formatToParts(new Date(candidate));
    const val = (key: string) => parts.find((p) => p.type === key)!.value;
    const represented = Date.parse(
      val('year') +
        '-' +
        val('month') +
        '-' +
        val('day') +
        'T' +
        val('hour') +
        ':' +
        val('minute') +
        ':' +
        val('second') +
        'Z',
    );
    const delta = target - represented;
    if (delta === 0) return new Date(candidate);
    candidate += delta;
  }
  return null; // Hora inexistente durante un cambio de horario: no inventar un instante.
}
export type ScheduledItem = {
  id: number;
  isActive: boolean;
  retiredAt?: Date | null;
  effectiveFrom?: Date | null;
  startDate: Date;
  endDate: Date | null;
  scheduledTimes: string[];
  daysOfWeek: number[];
  timeZone: string;
  prescription: { startDate: Date; endDate: Date | null; status: string };
};
export function occurrences(
  item: ScheduledItem,
  from: string,
  to: string,
): Date[] {
  if (
    (!item.isActive || item.prescription.status !== 'ACTIVO') &&
    !item.retiredAt
  )
    return [];
  const start = item.startDate.toISOString().slice(0, 10);
  const ends = [item.endDate]
    .filter((d): d is Date => !!d)
    .map((d) => d.toISOString().slice(0, 10))
    .sort();
  const end = ends[0];
  const dates: Date[] = [];
  for (let day = from; day <= to; day = addDays(day, 1)) {
    if (day < start || (end && day > end)) continue;
    if (
      item.daysOfWeek.length &&
      !item.daysOfWeek.includes(new Date(day + 'T00:00:00Z').getUTCDay())
    )
      continue;
    for (const time of new Set(item.scheduledTimes)) {
      const value = localInstant(day, time, item.timeZone);
      if (
        value &&
        (!item.retiredAt || value < item.retiredAt) &&
        (!item.effectiveFrom || value >= item.effectiveFrom)
      )
        dates.push(value);
    }
  }
  return dates.sort((a, b) => a.getTime() - b.getTime());
}
export function occurrenceKey(itemId: number, instant: Date) {
  return itemId + ':' + instant.toISOString();
}
