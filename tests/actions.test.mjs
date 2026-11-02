import test from 'node:test';
import assert from 'node:assert/strict';
import { createSampleData } from '../src/data/seed.ts';
import { addEvent, addGroup, removeEvent, toggleRsvp, updateEvent, updateProfile } from '../src/lib/actions.ts';
import { isAppData } from '../src/lib/storage.ts';
import { occursOn, profileStats, upcomingEvents } from '../src/lib/dates.ts';

const sample = () => createSampleData(new Date(2026, 9, 31, 12));
const input = () => ({ groupId: 'weekenders', title: '  A new adventure  ', category: 'Trip', status: 'planning', startDate: '2026-11-20', endDate: '2026-11-22', time: '09:30', location: '  By the sea  ', notes: 'A shared weekend.' });

test('creating a plan updates group, calendar, and personal statistics consistently', () => {
  const original = sample();
  const next = addEvent(original, input(), 'new-trip');
  const event = next.events.find(event => event.id === 'new-trip');
  assert.equal(original.events.length, 9);
  assert.equal(next.events.length, 10);
  assert.equal(event.title, 'A new adventure');
  assert.equal(event.location, 'By the sea');
  assert.deepEqual(event.attendeeIds, ['you']);
  assert.ok(occursOn(event, '2026-11-21'));
  assert.ok(upcomingEvents(next.events.filter(event => event.groupId === 'weekenders'), '2026-10-31').some(event => event.id === 'new-trip'));
  assert.equal(profileStats(next.events, 'you', '2026-10-31').upcoming, 6);
  assert.equal(isAppData(next), true);
});

test('moving a plan to a different group preserves only valid participants', () => {
  const original = sample();
  const next = updateEvent(original, 'coast', { ...input(), groupId: 'front-row', title: 'Changed plans', status: 'confirmed' });
  const event = next.events.find(event => event.id === 'coast');
  assert.deepEqual(event.attendeeIds, ['you', 'sam']);
  assert.equal(event.status, 'confirmed');
  assert.equal(event.title, 'Changed plans');
  assert.equal(original.events[0].groupId, 'weekenders');
  assert.equal(isAppData(next), true);
});

test('RSVP changes update personal counts without changing the group event', () => {
  const original = sample();
  const joined = toggleRsvp(original, 'pasta');
  assert.equal(profileStats(joined.events, 'you', '2026-10-31').upcoming, 6);
  assert.equal(joined.events.length, original.events.length);
  assert.equal(joined.events.find(event => event.id === 'pasta').attendeeIds.filter(id => id === 'you').length, 1);
  const left = toggleRsvp(joined, 'pasta');
  assert.deepEqual(left, original);
  assert.equal(isAppData(joined), true);
});

test('deleting a plan removes it from all derived views and keeps other data intact', () => {
  const original = sample();
  const next = removeEvent(original, 'coast');
  assert.equal(next.events.some(event => event.id === 'coast'), false);
  assert.equal(profileStats(next.events, 'you', '2026-10-31').upcoming, 4);
  assert.deepEqual(next.groups, original.groups);
  assert.equal(original.events.length, 9);
  assert.equal(isAppData(next), true);
});

test('a new group starts with the local user and can immediately receive an event', () => {
  const original = sample();
  const grouped = addGroup(original, '  Another circle  ', ' A new beginning. ', 'sage', 'new-group');
  const group = grouped.groups.at(-1);
  assert.equal(group.name, 'Another circle');
  assert.deepEqual(group.members, [{ id: 'you', name: original.profile.name }]);
  const planned = addEvent(grouped, { ...input(), groupId: group.id }, 'new-event');
  assert.equal(isAppData(planned), true);
  assert.equal(original.groups.length, 4);
});

test('profile changes propagate to group memberships and retain participation', () => {
  const original = sample();
  const next = updateProfile(original, { ...original.profile, name: '  New Name  ', location: ' Paris ', bio: ' Hello. ' });
  assert.equal(next.profile.name, 'New Name');
  for (const group of next.groups) assert.equal(group.members.find(member => member.id === 'you').name, 'New Name');
  assert.deepEqual(next.events, original.events);
  assert.equal(original.profile.name, 'Alex Morgan');
  assert.equal(isAppData(next), true);
});

test('invalid plans never enter the shared state', () => {
  const original = sample();
  for (const patch of [{ title: ' ' }, { groupId: 'missing' }, { endDate: '2026-11-19' }, { startDate: '2026-02-30' }, { time: '24:10' }]) {
    assert.throws(() => addEvent(original, { ...input(), ...patch }, 'invalid'));
  }
  assert.equal(original.events.length, 9);
  assert.throws(() => addEvent(original, input(), 'coast'));
  assert.throws(() => updateEvent(original, 'missing', input()));
});
