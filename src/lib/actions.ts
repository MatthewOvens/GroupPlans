import { CATEGORIES, COLORS, type AppData, type EventInput, type GroupColor, type Profile } from '../types.ts';
import { isDateKey } from './dates.ts';

function checkedEvent(data: AppData, input: EventInput): EventInput {
  if (!data.groups.some(group => group.id === input.groupId)) throw new Error('Choose an existing group.');
  if (!input.title.trim() || input.title.length > 100) throw new Error('Enter an event name of up to 100 characters.');
  if (!isDateKey(input.startDate) || !isDateKey(input.endDate) || input.endDate < input.startDate) throw new Error('Choose a valid date range.');
  if (input.time && !/^([01]\d|2[0-3]):[0-5]\d$/.test(input.time)) throw new Error('Choose a valid time.');
  if (!CATEGORIES.includes(input.category) || !['planning', 'confirmed'].includes(input.status)) throw new Error('Choose a valid category and status.');
  return { groupId: input.groupId, title: input.title.trim(), category: input.category, status: input.status, startDate: input.startDate, endDate: input.endDate, time: input.time, location: input.location.trim(), notes: input.notes.trim() };
}

export function addEvent(data: AppData, input: EventInput, id: string = crypto.randomUUID()): AppData {
  if (data.events.some(event => event.id === id)) throw new Error('This event already exists.');
  return { ...data, events: [...data.events, { ...checkedEvent(data, input), id, attendeeIds: [data.profile.id] }] };
}

export function updateEvent(data: AppData, id: string, input: EventInput): AppData {
  if (!data.events.some(event => event.id === id)) throw new Error('This event could not be found.');
  const checked = checkedEvent(data, input);
  const members = data.groups.find(group => group.id === checked.groupId)!.members;
  return { ...data, events: data.events.map(event => event.id === id ? { ...event, ...checked, attendeeIds: event.attendeeIds.filter(attendee => members.some(member => member.id === attendee)) } : event) };
}

export function removeEvent(data: AppData, id: string): AppData {
  return { ...data, events: data.events.filter(event => event.id !== id) };
}

export function toggleRsvp(data: AppData, id: string): AppData {
  return { ...data, events: data.events.map(event => event.id === id ? { ...event, attendeeIds: event.attendeeIds.includes(data.profile.id) ? event.attendeeIds.filter(attendee => attendee !== data.profile.id) : [...event.attendeeIds, data.profile.id] } : event) };
}

export function addGroup(data: AppData, name: string, description: string, color: GroupColor, id: string = crypto.randomUUID()): AppData {
  if (!name.trim() || name.length > 60 || !COLORS.includes(color)) throw new Error('Choose a group name and colour.');
  if (data.groups.some(group => group.id === id)) throw new Error('This group already exists.');
  return { ...data, groups: [...data.groups, { id, name: name.trim(), description: description.trim(), color, members: [{ id: data.profile.id, name: data.profile.name }] }] };
}

export function updateProfile(data: AppData, profile: Profile): AppData {
  if (profile.id !== data.profile.id || !profile.name.trim()) throw new Error('Enter a valid profile name.');
  const checked = { ...profile, name: profile.name.trim(), location: profile.location.trim(), bio: profile.bio.trim() };
  return { ...data, profile: checked, groups: data.groups.map(group => ({ ...group, members: group.members.map(member => member.id === profile.id ? { ...member, name: checked.name } : member) })) };
}
