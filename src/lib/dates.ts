import type { PlanEvent } from '../types.ts';

// Calendar dates are local dates, not UTC instants. Parsing at noon avoids DST edges.
export function parseDate(value: string): Date {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day, 12);
}

export function dateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function isDateKey(value: unknown): value is string {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
    && Number(value.slice(0, 4)) >= 1900 && dateKey(parseDate(value)) === value;
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days, 12);
}

export function monthStart(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1, 12);
}

export function shiftMonth(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1, 12);
}

export function monthDays(month: Date): Date[] {
  const first = monthStart(month);
  const mondayOffset = (first.getDay() + 6) % 7;
  const total = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells = Math.ceil((mondayOffset + total) / 7) * 7;
  return Array.from({ length: cells }, (_, index) => addDays(first, index - mondayOffset));
}

export function occursOn(event: PlanEvent, day: string): boolean {
  return event.startDate <= day && event.endDate >= day;
}

export function sortEvents(events: PlanEvent[]): PlanEvent[] {
  return [...events].sort((a, b) => `${a.startDate} ${a.time}`.localeCompare(`${b.startDate} ${b.time}`));
}

export function upcomingEvents(events: PlanEvent[], today = dateKey(new Date())): PlanEvent[] {
  return sortEvents(events.filter(event => event.endDate >= today));
}

export function formatDate(value: string, options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }): string {
  return new Intl.DateTimeFormat('en-GB', options).format(parseDate(value));
}

export function dateRange(event: Pick<PlanEvent, 'startDate' | 'endDate'>): string {
  if (event.startDate === event.endDate) return formatDate(event.startDate);
  return `${formatDate(event.startDate)} – ${formatDate(event.endDate)}`;
}

export function profileStats(events: PlanEvent[], profileId: string, today = dateKey(new Date())) {
  const personal = events.filter(event => event.attendeeIds.includes(profileId));
  return {
    upcoming: personal.filter(event => event.endDate >= today).length,
    past: personal.filter(event => event.endDate < today).length,
    trips: personal.filter(event => event.category === 'Trip' && event.endDate < today).length,
  };
}
