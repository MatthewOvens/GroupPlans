import { useEffect, useState } from 'react';
import type { AppData, EventInput, GroupColor, Profile } from './types';
import { createSampleData } from './data/seed';
import { readLocalData, writeLocalData } from './lib/storage';
import { addEvent, addGroup, removeEvent, toggleRsvp, updateEvent, updateProfile } from './lib/actions';
import { Avatar, BrandMark } from './components/shared';
import { Icon } from './components/Icon';
import { EventForm, GroupForm, ProfileForm } from './components/Forms';
import { EventDetails } from './components/EventDetails';
import { CalendarPage } from './pages/CalendarPage';
import { GroupPage, GroupsPage } from './pages/GroupsPage';
import { ProfilePage } from './pages/ProfilePage';

function boot() {
  try { return readLocalData(window.localStorage); }
  catch { return { data: null, warning: 'Browser storage is unavailable. Your changes will last for this session only.', canSave: false }; }
}

export function App() {
  const [initial] = useState(boot);
  const [data, setData] = useState<AppData>(() => initial.data ?? createSampleData());
  const [storageWarning, setStorageWarning] = useState(initial.warning);
  const [canSave, setCanSave] = useState(initial.canSave);
  const [route, setRoute] = useState(() => window.location.hash.slice(1) || '/calendar');
  const [eventForm, setEventForm] = useState<{ id?: string; groupId?: string; date?: string } | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [newGroupOpen, setNewGroupOpen] = useState(false);
  const [profileFormOpen, setProfileFormOpen] = useState(false);
  const [toast, setToast] = useState('');
  const section = route.startsWith('/groups') ? 'groups' : route === '/profile' ? 'profile' : 'calendar';
  const groupId = route.startsWith('/groups/') ? route.slice('/groups/'.length) : null;
  const selectedEvent = data.events.find(event => event.id === selectedEventId);
  const selectedGroup = selectedEvent ? data.groups.find(group => group.id === selectedEvent.groupId) : undefined;

  useEffect(() => {
    const change = () => { setRoute(window.location.hash.slice(1) || '/calendar'); setSelectedEventId(null); setEventForm(null); window.scrollTo(0, 0); };
    window.addEventListener('hashchange', change);
    return () => window.removeEventListener('hashchange', change);
  }, []);
  useEffect(() => { document.title = `${groupId ? data.groups.find(group => group.id === groupId)?.name ?? 'Group' : section[0].toUpperCase() + section.slice(1)} · Group Plans`; }, [section, groupId, data.groups]);
  useEffect(() => {
    if (!canSave) return;
    try {
      if (!writeLocalData(window.localStorage, data)) { setStorageWarning('Your browser could not save these changes. Keep this tab open; the latest changes are only available in this session.'); setCanSave(false); }
    } catch { setStorageWarning('Browser storage is unavailable. Changes are only available in this session.'); setCanSave(false); }
  }, [data, canSave]);
  useEffect(() => { if (!toast) return; const timeout = window.setTimeout(() => setToast(''), 4200); return () => window.clearTimeout(timeout); }, [toast]);

  function openNewEvent(groupId?: string, date?: string) {
    if (!data.groups.length) { setNewGroupOpen(true); return; }
    setEventForm({ groupId, date });
  }
  function saveEvent(input: EventInput, id?: string) {
    const newId = id ?? crypto.randomUUID();
    setData(previous => id ? updateEvent(previous, id, input) : addEvent(previous, input, newId));
    setEventForm(null);
    setToast(id ? 'Event updated. Good plans can change.' : 'It’s a plan! Your event is on the calendar.');
  }
  function saveGroup(name: string, description: string, color: GroupColor) {
    const id = crypto.randomUUID();
    setData(previous => addGroup(previous, name, description, color, id));
    setNewGroupOpen(false);
    window.location.hash = `/groups/${id}`;
    setToast('Your new circle is ready. Make the first plan.');
  }
  function saveProfile(profile: Profile) {
    setData(previous => updateProfile(previous, profile));
    setProfileFormOpen(false); setToast('Profile updated. Looking good.');
  }
  function reset() {
    const fresh = createSampleData();
    setData(fresh); setStorageWarning(null); setCanSave(true);
    setToast('A fresh set of plans, just for you.');
  }

  return <div className="app-shell"><a href="#main-content" className="skip-link" onClick={event => { event.preventDefault(); document.getElementById('main-content')?.focus(); }}>Skip to content</a>
    <aside className="sidebar"><a className="brand" href="#/calendar" aria-label="Group Plans home"><BrandMark /><span>group<span className="brand-light">plans</span><span className="brand-period">.</span></span></a><div className="workspace-label">A LITTLE MORE TOGETHER</div><nav className="main-nav" aria-label="Main navigation">{([{ id: 'calendar', label: 'Calendar', icon: 'calendar' }, { id: 'groups', label: 'Groups', icon: 'groups' }, { id: 'profile', label: 'Profile', icon: 'user' }] as const).map(item => <a key={item.id} href={`#/${item.id}`} className={section === item.id ? 'active' : ''} aria-current={section === item.id ? 'page' : undefined}><Icon name={item.icon} size={21} /><span>{item.label}</span>{item.id === 'groups' && <span className="nav-count">{data.groups.length}</span>}{section === item.id && <span className="nav-active-dot" />}</a>)}</nav><div className="sidebar-groups"><div className="sidebar-section-title">YOUR CIRCLES<button className="icon-button" aria-label="Create a new group" onClick={() => setNewGroupOpen(true)}><Icon name="plus" size={16} /></button></div>{data.groups.map(group => <a href={`#/groups/${group.id}`} key={group.id} className={groupId === group.id ? 'current-group' : ''}><span className={`color-dot ${group.color}`} /><span>{group.name}</span></a>)}</div><div className="sidebar-bottom"><div className="sidebar-message"><span className="little-star">✳</span><p>Less “one day.”<br /><strong>More “remember when?”</strong></p><span>Make time for your people.</span></div><a href="#/profile" className="sidebar-profile"><Avatar member={data.profile} profile={data.profile} /><span><strong>{data.profile.name}</strong><small>Your personal space</small></span><Icon name="chevronRight" size={16} /></a></div></aside>
    <div className="main-shell"><header className="topbar"><div className="breadcrumb"><span>Your workspace</span><Icon name="chevronRight" size={13} /><strong>{section === 'calendar' ? 'Calendar' : section === 'profile' ? 'Profile' : 'Groups'}</strong>{groupId && <><Icon name="chevronRight" size={13} /><span>{data.groups.find(group => group.id === groupId)?.name ?? 'Group'}</span></>}</div><div className="topbar-right"><span className="today-label"><Icon name="sun" size={16} />{new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }).format(new Date())}</span><a href="#/profile" aria-label="Open your profile"><Avatar member={data.profile} profile={data.profile} /></a></div></header>
      <main className="main-content" id="main-content" tabIndex={-1}>{storageWarning && <div className="storage-warning" role="alert">{storageWarning}</div>}{section === 'calendar' ? <CalendarPage data={data} onNewEvent={openNewEvent} onOpenEvent={setSelectedEventId} /> : section === 'profile' ? <ProfilePage data={data} onEdit={() => setProfileFormOpen(true)} onOpenEvent={setSelectedEventId} onReset={reset} /> : groupId ? <GroupPage key={groupId} data={data} groupId={groupId} onNewEvent={openNewEvent} onOpenEvent={setSelectedEventId} /> : <GroupsPage data={data} onNewGroup={() => setNewGroupOpen(true)} />}
      <footer className="page-footer"><span>Good plans. Better company.</span><span>Made for the moments in between <Icon name="spark" size={13} /></span></footer></main>
    </div>
    {eventForm && <EventForm groups={data.groups} event={data.events.find(event => event.id === eventForm.id)} initialGroupId={eventForm.groupId} initialDate={eventForm.date} onSave={saveEvent} onClose={() => setEventForm(null)} />}
    {selectedEvent && selectedGroup && <EventDetails key={selectedEvent.id} event={selectedEvent} group={selectedGroup} profile={data.profile} onClose={() => setSelectedEventId(null)} onEdit={() => { setEventForm({ id: selectedEvent.id }); setSelectedEventId(null); }} onDelete={() => { setData(previous => removeEvent(previous, selectedEvent.id)); setSelectedEventId(null); setToast('Event removed. There’s room for something new.'); }} onRsvp={() => { const going = selectedEvent.attendeeIds.includes(data.profile.id); setData(previous => toggleRsvp(previous, selectedEvent.id)); setToast(going ? 'Your RSVP has been updated.' : 'You’re in! Something good to look forward to.'); }} />}
    {newGroupOpen && <GroupForm onSave={saveGroup} onClose={() => setNewGroupOpen(false)} />}
    {profileFormOpen && <ProfileForm profile={data.profile} onSave={saveProfile} onClose={() => setProfileFormOpen(false)} />}
    <div className={`toast ${toast ? 'visible' : ''}`} role="status" aria-live="polite">{toast && <><span><Icon name="check" size={17} /></span>{toast}<button aria-label="Dismiss notification" onClick={() => setToast('')}><Icon name="close" size={16} /></button></>}</div>
  </div>;
}
