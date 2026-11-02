import type { AppData, PlanEvent } from '../types.ts';
import { addDays, dateKey } from '../lib/dates.ts';

// Fictional sample data is generated once, then persisted with the user's local changes.
export function createSampleData(now = new Date()): AppData {
  const anchor = addDays(now, 2);
  const at = (offset: number) => dateKey(addDays(anchor, offset));
  const friends = [
    { id: 'you', name: 'Alex Morgan' }, { id: 'mia', name: 'Mia Chen' },
    { id: 'jamie', name: 'Jamie Park' }, { id: 'sam', name: 'Sam Taylor' },
    { id: 'ella', name: 'Ella Brooks' }, { id: 'leo', name: 'Leo James' },
  ];
  const events: PlanEvent[] = [
    { id: 'coast', groupId: 'weekenders', title: 'A weekend by the coast', category: 'Trip', status: 'planning', startDate: at(3), endDate: at(5), time: '09:00', location: 'Brighton', notes: 'Sea air, slow mornings, and absolutely no spreadsheets. Let’s pick a little place near the beach and figure out the rest together.', attendeeIds: ['you', 'mia', 'jamie', 'sam'] },
    { id: 'coffee', groupId: 'day-ones', title: 'Coffee & catch-ups', category: 'Food', status: 'confirmed', startDate: at(0), endDate: at(0), time: '10:30', location: 'The Corner Café', notes: 'Our usual table. Bring your stories from the week.', attendeeIds: ['you', 'mia', 'ella'] },
    { id: 'live', groupId: 'front-row', title: 'Live music, good company', category: 'Music', status: 'confirmed', startDate: at(8), endDate: at(8), time: '19:30', location: 'The Roundhouse', notes: 'Meet by the entrance half an hour before the show. Earplugs and excellent dance moves encouraged.', attendeeIds: ['you', 'sam', 'leo'] },
    { id: 'trail', groupId: 'outside', title: 'Take the scenic route', category: 'Outdoors', status: 'planning', startDate: at(11), endDate: at(11), time: '08:00', location: 'Seven Sisters', notes: 'An easy coastal walk with a picnic stop. We’ll confirm the route once we’ve checked the weather.', attendeeIds: ['you', 'jamie', 'ella'] },
    { id: 'pasta', groupId: 'day-ones', title: 'The homemade pasta club', category: 'Food', status: 'planning', startDate: at(15), endDate: at(15), time: '18:00', location: 'Mia’s kitchen', notes: 'Everyone brings one ingredient. Nobody has to be good at making pasta.', attendeeIds: ['mia', 'ella'] },
    { id: 'games', groupId: 'day-ones', title: 'One more game', category: 'Hangout', status: 'confirmed', startDate: at(20), endDate: at(20), time: '19:00', location: 'Jamie’s place', notes: 'Board games, snacks, and friendly competition.', attendeeIds: ['you', 'mia', 'jamie', 'ella'] },
    { id: 'past-trip', groupId: 'weekenders', title: 'Our little cabin escape', category: 'Trip', status: 'confirmed', startDate: dateKey(addDays(now, -24)), endDate: dateKey(addDays(now, -22)), time: '09:00', location: 'Cotswolds', notes: 'A weekend worth remembering.', attendeeIds: ['you', 'mia', 'jamie', 'sam'] },
    { id: 'past-food', groupId: 'day-ones', title: 'Sunday at the market', category: 'Food', status: 'confirmed', startDate: dateKey(addDays(now, -7)), endDate: dateKey(addDays(now, -7)), time: '11:00', location: 'Borough Market', notes: 'The best kind of slow Sunday.', attendeeIds: ['you', 'mia', 'ella'] },
    { id: 'past-music', groupId: 'front-row', title: 'Jazz after hours', category: 'Music', status: 'confirmed', startDate: dateKey(addDays(now, -13)), endDate: dateKey(addDays(now, -13)), time: '20:00', location: 'The Jazz Café', notes: 'Good music, better company.', attendeeIds: ['you', 'sam', 'leo'] },
  ];
  return {
    version: 1,
    profile: { id: 'you', name: 'Alex Morgan', location: 'London, UK', bio: 'Collecting little adventures with my favourite people. Usually the one suggesting a weekend away.' },
    groups: [
      { id: 'weekenders', name: 'The Weekenders', description: 'Out-of-office energy. Little escapes, big memories.', color: 'lavender', members: friends.slice(0, 4) },
      { id: 'day-ones', name: 'The Day Ones', description: 'The usual suspects, making the everyday a little better.', color: 'peach', members: [friends[0], friends[1], friends[2], friends[4]] },
      { id: 'front-row', name: 'Front Row Friends', description: 'For the songs we’ll be talking about all week.', color: 'blue', members: [friends[0], friends[3], friends[5]] },
      { id: 'outside', name: 'A Little Outside', description: 'Fresh air, long walks, and a well-earned picnic.', color: 'sage', members: [friends[0], friends[2], friends[4]] },
    ],
    events,
  };
}
