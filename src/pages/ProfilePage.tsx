import { useState } from 'react';
import type { AppData } from '../types';
import { dateKey, profileStats, upcomingEvents } from '../lib/dates';
import { Icon } from '../components/Icon';
import { Avatar, EmptyState, EventRow, groupIcon, Modal, OrbitArt } from '../components/shared';

export function ProfilePage({ data, onEdit, onOpenEvent, onReset }: { data: AppData; onEdit: () => void; onOpenEvent: (id: string) => void; onReset: () => void }) {
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');
  const [resetOpen, setResetOpen] = useState(false);
  const today = dateKey(new Date());
  const personal = data.events.filter(event => event.attendeeIds.includes(data.profile.id));
  const upcoming = upcomingEvents(personal, today);
  const past = personal.filter(event => event.endDate < today).sort((a, b) => b.startDate.localeCompare(a.startDate));
  const stats = profileStats(data.events, data.profile.id, today);
  const shown = tab === 'upcoming' ? upcoming : past;
  return <>
    <div className="page-heading"><div><p className="eyebrow">THE PERSON BEHIND THE PLANS</p><h1>A little about you<span className="accent">.</span></h1><p>Your circles, your adventures, your good memories.</p></div><button className="button secondary" onClick={onEdit}><Icon name="edit" size={17} />Edit profile</button></div>
    <section className="panel profile-card"><div className="profile-cover"><span className="profile-cover-label">MAKE TIME FOR WHAT MATTERS.</span><OrbitArt /></div><div className="profile-info"><Avatar member={data.profile} profile={data.profile} large /><div className="profile-copy"><h2>{data.profile.name}</h2>{data.profile.location && <p className="profile-location"><Icon name="pin" size={15} />{data.profile.location}</p>}<p className="profile-bio">{data.profile.bio || 'Every good adventure starts with a little introduction.'}</p></div><span className="profile-member-badge"><Icon name="spark" size={16} />Memory maker</span></div></section>
    <div className="stats-grid"><div className="stat-card panel"><span className="stat-icon tone-lavender"><Icon name="calendar" size={23} /></span><div><strong>{stats.upcoming}</strong><span>Plans ahead</span></div><small>Things to look forward to</small></div><div className="stat-card panel"><span className="stat-icon tone-peach"><Icon name="heart" size={23} /></span><div><strong>{stats.past}</strong><span>Memories made</span></div><small>Past events you joined</small></div><div className="stat-card panel"><span className="stat-icon tone-sage"><Icon name="groups" size={23} /></span><div><strong>{data.groups.length}</strong><span>Your circles</span></div><small>Groups you’re part of</small></div></div>
    <div className="profile-layout"><section className="panel profile-events-panel"><div className="section-title"><h2>Your collection of good times</h2></div><div className="tab-row"><button aria-pressed={tab === 'upcoming'} onClick={() => setTab('upcoming')}>Coming up <span>{upcoming.length}</span></button><button aria-pressed={tab === 'past'} onClick={() => setTab('past')}>Past memories <span>{past.length}</span></button></div>{shown.length ? shown.map(event => <EventRow key={event.id} event={event} group={data.groups.find(group => group.id === event.groupId)!} onOpen={onOpenEvent} />) : <EmptyState title={tab === 'upcoming' ? 'Your calendar has room for good things.' : 'The good times are still ahead.'}>{tab === 'upcoming' ? 'Explore your groups and join an event to see it here.' : 'Your past events will become a little collection of memories here.'}</EmptyState>}</section>
      <aside className="panel profile-groups"><div className="section-title"><h2>Your people</h2><a href="#/groups" className="text-button" aria-label="View all groups"><Icon name="arrow" size={19} /></a></div>{data.groups.map(group => <a className="profile-group-row" key={group.id} href={`#/groups/${group.id}`}><span className={`profile-group-icon tone-${group.color}`}><Icon name={groupIcon[group.color]} size={22} /></span><span><strong>{group.name}</strong><small>{group.members.length} {group.members.length === 1 ? 'member' : 'members'}</small></span><Icon name="chevronRight" size={16} /></a>)}</aside>
    </div>
    <div className="local-data-note"><div><Icon name="heart" size={19} /><p><strong>Your own little planning space.</strong> Changes are saved in this browser. The starting profile and friends are fictional examples; there is no sign-in or shared syncing yet.</p></div><button className="text-button" onClick={() => setResetOpen(true)}>Reset sample data</button></div>
    {resetOpen && <Modal title="A fresh start?" eyebrow="RESET LOCAL DATA" onClose={() => setResetOpen(false)}><div className="reset-content"><p>This replaces your saved profile, groups, and events in this browser with fresh sample data. Your current changes will be removed.</p><div className="form-footer"><button className="button secondary" onClick={() => setResetOpen(false)}>Keep my plans</button><button className="button danger" onClick={() => { onReset(); setResetOpen(false); }}>Reset local data</button></div></div></Modal>}
  </>;
}
