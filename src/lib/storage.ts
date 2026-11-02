import { COLORS, CATEGORIES, type AppData } from '../types.ts';
import { isDateKey } from './dates.ts';

export const STORAGE_KEY = 'group-plans.local.v1';
const record = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value);
const string = (value: unknown): value is string => typeof value === 'string';

export function isAppData(value: unknown): value is AppData {
  if (!record(value) || value.version !== 1 || !record(value.profile) || !Array.isArray(value.groups) || !Array.isArray(value.events)) return false;
  const profile = value.profile;
  if (![profile.id, profile.name, profile.location, profile.bio].every(string) || !profile.id || !profile.name) return false;
  const ids = new Set<string>();
  for (const group of value.groups) {
    if (!record(group) || !string(group.id) || !group.id || ids.has(group.id) || !string(group.name) || !group.name.trim()
      || !string(group.description) || !COLORS.includes(group.color as typeof COLORS[number]) || !Array.isArray(group.members)
      || !group.members.every(member => record(member) && string(member.id) && string(member.name))) return false;
    ids.add(group.id);
    if (!group.members.some(member => member.id === profile.id)) return false;
  }
  const eventIds = new Set<string>();
  for (const event of value.events) {
    if (!record(event) || !string(event.id) || !event.id || eventIds.has(event.id) || !string(event.groupId) || !ids.has(event.groupId)
      || !string(event.title) || !event.title.trim() || !CATEGORIES.includes(event.category as typeof CATEGORIES[number])
      || !['planning', 'confirmed'].includes(event.status as string) || !isDateKey(event.startDate) || !isDateKey(event.endDate)
      || event.endDate < event.startDate || !string(event.time) || (event.time !== '' && !/^([01]\d|2[0-3]):[0-5]\d$/.test(event.time))
      || !string(event.location) || !string(event.notes) || !Array.isArray(event.attendeeIds) || !event.attendeeIds.every(string)) return false;
    const group = value.groups.find(group => group.id === event.groupId);
    if (!event.attendeeIds.every(id => group.members.some((member: { id: string }) => member.id === id))) return false;
    eventIds.add(event.id);
  }
  return true;
}

export function readLocalData(storage: Pick<Storage, 'getItem'>): { data: AppData | null; warning: string | null; canSave: boolean } {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return { data: null, warning: null, canSave: true };
    const value: unknown = JSON.parse(raw);
    if (!isAppData(value)) throw new Error('Invalid saved data');
    return { data: value, warning: null, canSave: true };
  } catch {
    // Preserve unreadable data rather than silently overwriting it. A reset is explicit.
    return { data: null, warning: 'Your saved plans could not be loaded. This session is temporary. You can reset local data from Profile.', canSave: false };
  }
}

export function writeLocalData(storage: Pick<Storage, 'setItem'>, data: AppData): boolean {
  try { storage.setItem(STORAGE_KEY, JSON.stringify(data)); return true; }
  catch { return false; }
}

// Future integration boundary: replace local persistence with an authenticated repository.
// No remote client, credentials, database, or synchronization is initialized here.
