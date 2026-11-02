export const COLORS = ['lavender', 'peach', 'sage', 'blue'] as const;
export type GroupColor = typeof COLORS[number];
export const CATEGORIES = ['Hangout', 'Trip', 'Music', 'Food', 'Outdoors'] as const;
export type Category = typeof CATEGORIES[number];
export type EventStatus = 'planning' | 'confirmed';

export interface Member {
  id: string;
  name: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  color: GroupColor;
  members: Member[];
}

export interface PlanEvent {
  id: string;
  groupId: string;
  title: string;
  category: Category;
  status: EventStatus;
  startDate: string;
  endDate: string;
  time: string;
  location: string;
  notes: string;
  attendeeIds: string[];
}

export interface Profile {
  id: string;
  name: string;
  location: string;
  bio: string;
}

export interface AppData {
  version: 1;
  profile: Profile;
  groups: Group[];
  events: PlanEvent[];
}

export type EventInput = Omit<PlanEvent, 'id' | 'attendeeIds'>;
