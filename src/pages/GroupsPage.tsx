import { useState } from 'react';
import type { AppData } from '../types';
import { dateKey, upcomingEvents } from '../lib/dates';
import { Icon } from '../components/Icon';
import { Avatar, AvatarStack, EmptyState, EventRow, groupIcon, OrbitArt } from '../components/shared';

export function GroupsPage({ data, onNewGroup }: { data: AppData; onNewGroup: () => void }) {
  return <>
    <div className="page-heading"><div><p className="eyebrow">DIFFERENT PEOPLE. SAME GOOD ENERGY.</p><h1>Your kind of people<span className="accent">.</span></h1><p>A home for every circle, and every plan you share.</p></div><button className="button primary" onClick={onNewGroup}><Icon name="plus" size={19} />New group</button></div>
    <div className="section-title groups-section-title"><h2>Your groups <span className="count">{data.groups.length}</span></h2><span className="muted">Better things happen together.</span></div>
    <div className="groups-grid">{data.groups.map(group => {
      const upcoming = upcomingEvents(data.events.filter(event => event.groupId === group.id));
      return <a key={group.id} href={`#/groups/${group.id}`} className="group-card panel"><div className={`group-card-cover tone-${group.color}`}><span className="group-card-icon"><Icon name={groupIcon[group.color]} size={36} /></span><OrbitArt color={group.color} /><span className="group-cover-label">YOUR PEOPLE, YOUR PLANS</span></div><div className="group-card-body"><div className="group-name-line"><h2>{group.name}</h2><Icon name="arrow" size={20} /></div><p>{group.description || 'A fresh start for your next shared adventure.'}</p><div className="group-card-members"><AvatarStack members={group.members} profile={data.profile} /><span>{group.members.length} {group.members.length === 1 ? 'member' : 'members'}</span></div><div className="group-card-footer"><span><Icon name="calendar" size={16} />{upcoming.length} upcoming {upcoming.length === 1 ? 'event' : 'events'}</span><span>{upcoming.filter(event => event.status === 'planning').length} in planning</span></div></div></a>;
    })}<button className="new-group-card" onClick={onNewGroup}><span className="new-group-plus"><Icon name="plus" size={29} /></span><h2>Room for one more?</h2><p>Bring another circle together.</p><span className="text-button">Create a group <Icon name="arrow" size={16} /></span></button></div>
  </>;
}

export function GroupPage({ data, groupId, onNewEvent, onOpenEvent }: { data: AppData; groupId: string; onNewEvent: (groupId: string) => void; onOpenEvent: (id: string) => void }) {
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');
  const group = data.groups.find(item => item.id === groupId);
  if (!group) return <EmptyState icon="groups" title="This group isn’t here.">It may have been removed. <a href="#/groups" className="text-link">Back to your groups</a></EmptyState>;
  const today = dateKey(new Date());
  const allEvents = data.events.filter(event => event.groupId === groupId);
  const upcoming = upcomingEvents(allEvents, today);
  const past = allEvents.filter(event => event.endDate < today).sort((a, b) => b.startDate.localeCompare(a.startDate));
  const shown = tab === 'upcoming' ? upcoming : past;
  return <>
    <a href="#/groups" className="back-link"><Icon name="back" size={17} />All groups</a>
    <section className={`group-hero tone-${group.color}`}><div className="group-hero-copy"><span className="group-hero-icon"><Icon name={groupIcon[group.color]} size={32} /></span><p className="eyebrow">THE PEOPLE BEHIND THE PLANS</p><h1>{group.name}</h1><p>{group.description || 'A fresh start for your next shared adventure.'}</p><AvatarStack members={group.members} profile={data.profile} limit={6} /></div><OrbitArt color={group.color} /></section>
    <div className="group-detail-layout"><section className="panel group-events-panel"><div className="section-title"><div><h2>Good times in the making</h2><p className="section-subtitle">Give the group something to look forward to.</p></div><button className="button primary" onClick={() => onNewEvent(group.id)}><Icon name="plus" size={18} />New event</button></div><div className="tab-row"><button aria-pressed={tab === 'upcoming'} onClick={() => setTab('upcoming')}>Upcoming <span>{upcoming.length}</span></button><button aria-pressed={tab === 'past'} onClick={() => setTab('past')}>Past memories <span>{past.length}</span></button></div><div className="group-event-list">{shown.length ? shown.map(event => <EventRow key={event.id} event={event} group={group} onOpen={onOpenEvent} />) : <EmptyState icon={tab === 'past' ? 'heart' : 'calendar'} title={tab === 'past' ? 'Your story is just beginning.' : 'Your next memory starts here.'} action={tab === 'upcoming' && <button className="button primary" onClick={() => onNewEvent(group.id)}><Icon name="plus" size={17} />Create the first event</button>}>{tab === 'past' ? 'Once your events have passed, you’ll find them here.' : 'A coffee, a concert, a whole weekend away. What’s the plan?'}</EmptyState>}</div></section>
      <aside className="group-detail-aside"><section className="panel members-panel"><div className="section-title"><h2>The good company</h2><span className="count">{group.members.length}</span></div><div className="member-list">{group.members.map((member, i) => <div className="member-row" key={member.id}><Avatar member={member} profile={data.profile} index={i} /><span>{member.id === data.profile.id ? data.profile.name : member.name}{member.id === data.profile.id && <small>That’s you</small>}</span></div>)}</div></section><div className="group-summary"><Icon name="spark" size={23} /><strong>{upcoming.filter(event => event.status === 'planning').length} ideas taking shape</strong><p>A good plan doesn’t have to be perfect. It just needs your people.</p></div></aside>
    </div>
  </>;
}
