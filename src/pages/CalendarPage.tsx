import { useMemo, useState } from 'react';
import type { AppData } from '../types';
import { dateKey, formatDate, monthDays, monthStart, occursOn, parseDate, shiftMonth, sortEvents, upcomingEvents } from '../lib/dates';
import { Icon } from '../components/Icon';
import { EmptyState, EventRow, OrbitArt } from '../components/shared';

export function CalendarPage({ data, onNewEvent, onOpenEvent }: { data: AppData; onNewEvent: (groupId?: string, day?: string) => void; onOpenEvent: (id: string) => void }) {
  const today = dateKey(new Date());
  const next = upcomingEvents(data.events, today)[0];
  const [month, setMonth] = useState(() => monthStart(parseDate(next?.startDate ?? today)));
  const [selectedDay, setSelectedDay] = useState(next?.startDate ?? today);
  const [groupFilter, setGroupFilter] = useState('all');
  const [view, setView] = useState<'month' | 'agenda'>('month');
  const filtered = useMemo(() => sortEvents(data.events.filter(event => groupFilter === 'all' || event.groupId === groupFilter)), [data.events, groupFilter]);
  const upcoming = upcomingEvents(filtered, today);
  const days = monthDays(month);
  const firstDay = dateKey(month);
  const lastDay = dateKey(new Date(month.getFullYear(), month.getMonth() + 1, 0, 12));
  const thisMonth = filtered.filter(event => event.startDate <= lastDay && event.endDate >= firstDay);
  const selectedEvents = filtered.filter(event => occursOn(event, selectedDay));
  const groupFor = (id: string) => data.groups.find(group => group.id === id)!;
  const newPlan = () => onNewEvent(groupFilter === 'all' ? undefined : groupFilter, selectedDay);

  return <>
    <div className="page-heading"><div><p className="eyebrow">LESS BACK-AND-FORTH. MORE BEING THERE.</p><h1>Your plans, together<span className="accent">.</span></h1><p>Make a little room for your favourite people.</p></div><button className="button primary" onClick={() => onNewEvent()}><Icon name="plus" size={19} />New event</button></div>
    <div className="calendar-intro"><div className="intro-message"><span className="mini-label"><Icon name="spark" size={15} />GOOD THINGS AHEAD</span><h2>From “we should”<br />to “see you there.”</h2><p>A shared calendar for the moments that matter.</p></div><OrbitArt /><div className="intro-stat"><strong>{upcoming.length.toString().padStart(2, '0')}</strong><span>plans to look<br />forward to</span></div></div>
    <div className="calendar-layout"><section className="calendar-panel panel" aria-label="Your calendar">
      <div className="calendar-toolbar"><div className="month-nav"><h2>{new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' }).format(month)}</h2><div><button className="icon-button" aria-label="Previous month" onClick={() => setMonth(shiftMonth(month, -1))}><Icon name="chevronLeft" size={18} /></button><button className="icon-button" aria-label="Next month" onClick={() => setMonth(shiftMonth(month, 1))}><Icon name="chevronRight" size={18} /></button></div><button className="today-button" onClick={() => { setMonth(monthStart(new Date())); setSelectedDay(today); }}>Today</button></div><div className="segmented" aria-label="Calendar view"><button aria-pressed={view === 'month'} onClick={() => setView('month')}><Icon name="grid" size={15} /><span>Month</span></button><button aria-pressed={view === 'agenda'} onClick={() => setView('agenda')}><Icon name="list" size={16} /><span>Agenda</span></button></div></div>
      <div className="group-filters" aria-label="Filter calendar by group"><button className={`filter-chip ${groupFilter === 'all' ? 'active' : ''}`} onClick={() => setGroupFilter('all')} aria-pressed={groupFilter === 'all'}>All groups<span>{data.groups.length}</span></button>{data.groups.map(group => <button key={group.id} className={`filter-chip ${groupFilter === group.id ? 'active' : ''}`} onClick={() => setGroupFilter(group.id)} aria-pressed={groupFilter === group.id}><span className={`color-dot ${group.color}`} />{group.name}</button>)}</div>
      {view === 'month' ? <div className="calendar-scroll"><div className="calendar-grid"><div className="weekday-row">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => <span key={day}>{day}</span>)}</div><div className="month-grid">{days.map(day => {
        const key = dateKey(day);
        const events = filtered.filter(event => occursOn(event, key));
        return <div key={key} className={`day-cell ${day.getMonth() !== month.getMonth() ? 'outside-month' : ''} ${key === selectedDay ? 'selected-day' : ''} ${key === today ? 'today-cell' : ''}`}>
          <button className="day-number" onClick={() => setSelectedDay(key)} aria-label={`${formatDate(key, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}, ${events.length} events`} aria-pressed={key === selectedDay}>{day.getDate()}</button>
          <div className="day-events">{events.slice(0, 3).map(event => <button className={`calendar-event tone-${groupFor(event.groupId).color} ${event.startDate !== key ? 'continued-event' : ''}`} key={event.id} onClick={() => onOpenEvent(event.id)} title={event.title}><span className={`color-dot ${groupFor(event.groupId).color}`} />{event.title}</button>)}{events.length > 3 && <button className="more-events" onClick={() => setSelectedDay(key)}>+{events.length - 3} more</button>}</div>
        </div>;
      })}</div></div></div> : <div className="agenda-list">{thisMonth.length ? thisMonth.map(event => <EventRow key={event.id} event={event} group={groupFor(event.groupId)} onOpen={onOpenEvent} />) : <EmptyState title="An open chapter.">No plans this month for the selected groups. There’s room for something good.</EmptyState>}</div>}
      <div className="calendar-footer"><span><span className="legend-today" />Today</span><span>{thisMonth.length} {thisMonth.length === 1 ? 'event' : 'events'} this month</span></div>
    </section><aside className="calendar-aside">
      <section className="panel upcoming-panel"><div className="section-title"><h2>On the horizon</h2><span className="count">{upcoming.length}</span></div><p className="section-subtitle">Your next reasons to get together.</p><div className="upcoming-list">{upcoming.length ? upcoming.slice(0, 3).map(event => <EventRow key={event.id} event={event} group={groupFor(event.groupId)} compact onOpen={onOpenEvent} />) : <EmptyState title="Something to look forward to">Create your next plan and give your group a date to save.</EmptyState>}</div></section>
      <section className="panel selected-day-panel"><div className="section-title"><h2>{formatDate(selectedDay, { weekday: 'short', day: 'numeric', month: 'short' })}</h2><button className="icon-button" aria-label="Create event on selected day" onClick={newPlan}><Icon name="plus" size={18} /></button></div>{selectedEvents.length ? selectedEvents.map(event => <button className="selected-plan" key={event.id} onClick={() => onOpenEvent(event.id)}><span className={`color-dot ${groupFor(event.groupId).color}`} /><span><strong>{event.title}</strong><small>{event.time || 'Time to be decided'}</small></span><Icon name="chevronRight" size={15} /></button>) : <div className="free-day"><Icon name="sun" size={25} /><p>A little breathing room.</p><button className="text-button" onClick={newPlan}>Make a plan <Icon name="arrow" size={15} /></button></div>}</section>
      <div className="aside-note"><Icon name="heart" size={18} /><p>The best part of any plan?<br /><strong>The people you share it with.</strong></p></div>
    </aside></div>
  </>;
}
