import test from 'node:test';
import assert from 'node:assert/strict';
import { addDays, dateKey, isDateKey, monthDays, occursOn, parseDate, profileStats, shiftMonth, upcomingEvents } from '../src/lib/dates.ts';
import { createSampleData } from '../src/data/seed.ts';
import { isAppData, readLocalData, STORAGE_KEY, writeLocalData } from '../src/lib/storage.ts';

const sample = () => createSampleData(new Date(2026, 9, 31, 12));

test('calendar includes full Monday-to-Sunday weeks and the leap day', () => {
  const days = monthDays(new Date(2024, 1, 1, 12));
  assert.equal(days[0].getDay(), 1);
  assert.equal(days.at(-1).getDay(), 0);
  assert.equal(days.length % 7, 0);
  assert.equal(days.filter(day => day.getMonth() === 1).length, 29);
  assert.ok(days.some(day => dateKey(day) === '2024-02-29'));
});

test('date arithmetic keeps local dates across month, year, and DST boundaries', () => {
  assert.equal(dateKey(addDays(parseDate('2026-12-31'), 1)), '2027-01-01');
  assert.equal(dateKey(addDays(parseDate('2026-03-28'), 1)), '2026-03-29');
  assert.equal(dateKey(shiftMonth(parseDate('2026-01-31'), 1)), '2026-02-01');
  assert.equal(dateKey(shiftMonth(parseDate('2026-12-01'), 1)), '2027-01-01');
});

test('invalid dates and impossible leap days are rejected', () => {
  for (const value of ['2026-02-29', '2026-04-31', '2026-13-01', '26-01-01', '', null]) assert.equal(isDateKey(value), false);
  assert.equal(isDateKey('2024-02-29'), true);
});

test('a multi-day trip appears on each day, including both endpoints', () => {
  const event = sample().events[0];
  assert.equal(occursOn(event, event.startDate), true);
  assert.equal(occursOn(event, event.endDate), true);
  assert.equal(occursOn(event, dateKey(addDays(parseDate(event.endDate), 1))), false);
  assert.equal(occursOn(event, dateKey(addDays(parseDate(event.startDate), -1))), false);
});

test('ongoing trips remain upcoming even if they started in the previous month', () => {
  const event = { ...sample().events[0], startDate: '2026-10-30', endDate: '2026-11-02' };
  assert.equal(upcomingEvents([event], '2026-11-01').length, 1);
  assert.equal(upcomingEvents([event], '2026-11-03').length, 0);
});

test('profile statistics count only events the person joined', () => {
  const data = sample();
  const stats = profileStats(data.events, 'you', '2026-10-31');
  assert.deepEqual(stats, { upcoming: 5, past: 3, trips: 1 });
  const trip = { ...data.events[0], startDate: '2026-10-29', endDate: '2026-11-02' };
  assert.deepEqual(profileStats([trip], 'you', '2026-10-31'), { upcoming: 1, past: 0, trips: 0 });
  assert.deepEqual(profileStats(data.events, 'not-a-member', '2026-10-31'), { upcoming: 0, past: 0, trips: 0 });
});

test('new sample data is valid across different times of the month', () => {
  for (const day of [1, 15, 23, 24, 31]) assert.equal(isAppData(createSampleData(new Date(2026, 9, day, 12))), true);
});

test('saved data round-trips without losing profile changes or multi-day events', () => {
  const values = new Map();
  const storage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
  const data = sample();
  data.profile.name = 'A different name';
  assert.equal(writeLocalData(storage, data), true);
  assert.deepEqual(readLocalData(storage), { data, warning: null, canSave: true });
  assert.ok(values.has(STORAGE_KEY));
});

test('corrupt saved data is preserved and automatic saving is disabled', () => {
  const raw = '{broken-json';
  const result = readLocalData({ getItem: () => raw });
  assert.equal(result.data, null);
  assert.equal(result.canSave, false);
  assert.ok(result.warning);
});

test('invalid foreign keys, date ranges, duplicates, and attendees are rejected', () => {
  const mutations = [
    data => { data.events[0].groupId = 'missing'; },
    data => { data.events[0].endDate = '2020-01-01'; },
    data => { data.events[0].time = '25:99'; },
    data => { data.events.push(data.events[0]); },
    data => { data.events[0].attendeeIds = ['unknown']; },
    data => { data.groups[0].members = []; },
    data => { data.profile.name = ''; },
    data => { data.version = 2; },
  ];
  for (const mutate of mutations) { const data = sample(); mutate(data); assert.equal(isAppData(data), false); }
});

test('storage failures are reported without crashing the app', () => {
  assert.equal(writeLocalData({ setItem: () => { throw new Error('Quota exceeded'); } }, sample()), false);
  const result = readLocalData({ getItem: () => { throw new Error('Storage disabled'); } });
  assert.equal(result.canSave, false);
  assert.equal(result.data, null);
});
