import { useState } from 'react';
import type { Group, PlanEvent, Profile } from '../types';
import { dateKey, dateRange } from '../lib/dates';
import { Icon } from './Icon';
import { AvatarStack, categoryIcon, Modal, StatusBadge } from './shared';

export function EventDetails({ event, group, profile, onClose, onEdit, onDelete, onRsvp }: {
  event: PlanEvent; group: Group; profile: Profile; onClose: () => void; onEdit: () => void; onDelete: () => void; onRsvp: () => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const going = event.attendeeIds.includes(profile.id);
  const past = event.endDate < dateKey(new Date());
  const attendees = group.members.filter(member => event.attendeeIds.includes(member.id));
  return <Modal title={event.title} eyebrow={group.name} onClose={onClose}>
    <div className="event-details">
      <div className={`event-detail-cover tone-${group.color}`}><Icon name={categoryIcon[event.category]} size={52} /><span>{event.category}</span><StatusBadge status={event.status} /></div>
      <div className="detail-facts"><div><Icon name="calendar" /><span><small>When</small><strong>{dateRange(event)}</strong></span></div><div><Icon name="clock" /><span><small>Time</small><strong>{event.time || 'Let’s decide together'}</strong></span></div><div className="full-width"><Icon name="pin" /><span><small>Where</small><strong>{event.location || 'Location to be decided'}</strong></span></div></div>
      <div className="detail-notes"><h3>The plan</h3><p>{event.notes || 'The details are still taking shape. Edit this event to add a few ideas.'}</p></div>
      <div className="attendees"><div><h3>{past ? 'Who went' : 'Who’s going'} <span className="count">{attendees.length}</span></h3>{attendees.length ? <AvatarStack members={attendees} profile={profile} limit={6} /> : <p className="muted">Be the first to join this plan.</p>}</div>{!past && <button className={`button ${going ? 'joined' : 'primary'}`} onClick={onRsvp}><Icon name={going ? 'check' : 'plus'} size={17} />{going ? 'You’re going' : 'Count me in'}</button>}</div>
      {!past && going && <p className="form-hint">Click “You’re going” to change your RSVP.</p>}
      {confirmDelete ? <div className="delete-confirm" role="alert"><p>Delete this event? This removes it from the calendar and group.</p><div><button className="button secondary" onClick={() => setConfirmDelete(false)}>Keep event</button><button className="button danger" onClick={onDelete}>Delete event</button></div></div> : <div className="detail-actions"><button className="text-button danger-text" onClick={() => setConfirmDelete(true)}><Icon name="trash" size={17} />Delete event</button><button className="button secondary" onClick={onEdit}><Icon name="edit" size={17} />Edit event</button></div>}
    </div>
  </Modal>;
}
