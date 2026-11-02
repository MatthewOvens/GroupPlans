import assert from 'node:assert/strict';
import { renderToString } from 'react-dom/server';
import { App } from '../src/App';
import { createSampleData } from '../src/data/seed';
import { CalendarPage } from '../src/pages/CalendarPage';
import { GroupPage, GroupsPage } from '../src/pages/GroupsPage';
import { ProfilePage } from '../src/pages/ProfilePage';
import { EventForm } from '../src/components/Forms';
import { EventDetails } from '../src/components/EventDetails';

const data = createSampleData();
const noop = () => {};
const pages = [
  ['Calendar', <CalendarPage data={data} onNewEvent={noop} onOpenEvent={noop} />, 'Your plans, together'],
  ['Groups', <GroupsPage data={data} onNewGroup={noop} />, 'The Weekenders'],
  ['Group detail', <GroupPage data={data} groupId="weekenders" onNewEvent={noop} onOpenEvent={noop} />, 'A weekend by the coast'],
  ['Missing group', <GroupPage data={data} groupId="missing" onNewEvent={noop} onOpenEvent={noop} />, 'This group isn’t here.'],
  ['Profile', <ProfilePage data={data} onEdit={noop} onOpenEvent={noop} onReset={noop} />, 'Alex Morgan'],
  ['Event creation', <EventForm groups={data.groups} initialGroupId="weekenders" onSave={noop} onClose={noop} />, 'Create event'],
  ['Event editing', <EventForm groups={data.groups} event={data.events[0]} onSave={noop} onClose={noop} />, 'Save changes'],
  ['Event details', <EventDetails event={data.events[0]} group={data.groups[0]} profile={data.profile} onClose={noop} onEdit={noop} onDelete={noop} onRsvp={noop} />, 'Who’s going'],
] as const;

let count = 0;
for (const [name, component, expected] of pages) {
  const html = renderToString(component);
  assert.ok(html.includes(expected), `${name} must render its main content`);
  assert.ok(!html.includes('https://'), `${name} must not load external assets`);
  console.log(`PASS ${name} renders with sample data`);
  count++;
}

const values = new Map<string, string>();
Object.defineProperty(globalThis, 'window', { configurable: true, value: { location: { hash: '#/calendar' }, localStorage: { getItem: (key: string) => values.get(key) ?? null } } });
for (const route of ['/calendar', '/groups', '/groups/weekenders', '/profile']) {
  window.location.hash = `#${route}`;
  assert.ok(renderToString(<App />).includes('main-content'));
  console.log(`PASS application shell renders ${route}`);
  count++;
}
console.log(`${count} render checks passed. These checks do not replace browser interaction or visual QA.`);
