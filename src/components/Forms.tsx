import { useState, type FormEvent } from 'react';
import { CATEGORIES, COLORS, type EventInput, type Group, type GroupColor, type PlanEvent, type Profile } from '../types';
import { dateKey } from '../lib/dates';
import { Icon } from './Icon';
import { Modal } from './shared';

export function EventForm({ groups, event, initialGroupId, initialDate, onSave, onClose }: {
  groups: Group[]; event?: PlanEvent; initialGroupId?: string; initialDate?: string;
  onSave: (input: EventInput, id?: string) => void; onClose: () => void;
}) {
  const day = initialDate ?? dateKey(new Date());
  const [input, setInput] = useState<EventInput>(event ? { ...event } : {
    groupId: initialGroupId ?? groups[0]?.id ?? '', title: '', category: 'Hangout', status: 'planning',
    startDate: day, endDate: day, time: '', location: '', notes: '',
  });
  const [error, setError] = useState('');
  const set = <K extends keyof EventInput>(key: K, value: EventInput[K]) => setInput(previous => ({ ...previous, [key]: value }));
  function submit(e: FormEvent) {
    e.preventDefault();
    if (!input.title.trim()) { setError('Give your plan a name.'); return; }
    if (!groups.some(group => group.id === input.groupId)) { setError('Choose a group for this plan.'); return; }
    if (input.endDate < input.startDate) { setError('The end date must be on or after the start date.'); return; }
    onSave({ ...input, title: input.title.trim(), location: input.location.trim(), notes: input.notes.trim() }, event?.id);
  }
  return <Modal title={event ? 'A little change of plans.' : 'Good times start with a plan.'} eyebrow={event ? 'EDIT EVENT' : 'MAKE SOMETHING HAPPEN'} onClose={onClose} wide>
    <form onSubmit={submit} className="form">
      <label>Event name<input autoFocus required maxLength={100} placeholder="What are we getting up to?" value={input.title} onChange={e => set('title', e.target.value)} /></label>
      <div className="form-grid"><label>Group<select required value={input.groupId} onChange={e => set('groupId', e.target.value)}>{groups.map(group => <option key={group.id} value={group.id}>{group.name}</option>)}</select></label><label>Type of plan<select value={input.category} onChange={e => set('category', e.target.value as EventInput['category'])}>{CATEGORIES.map(category => <option key={category}>{category}</option>)}</select></label></div>
      <div className="form-grid"><label>Starts on<input type="date" required min="1900-01-01" max="9999-12-31" value={input.startDate} onChange={e => { const value = e.target.value; setInput(previous => ({ ...previous, startDate: value, endDate: previous.endDate < value ? value : previous.endDate })); }} /></label><label>Ends on<input type="date" required min={input.startDate} max="9999-12-31" value={input.endDate} onChange={e => set('endDate', e.target.value)} /></label></div>
      <div className="form-grid"><label>Time <span className="optional">optional</span><input type="time" value={input.time} onChange={e => set('time', e.target.value)} /></label><label>Status<select value={input.status} onChange={e => set('status', e.target.value as EventInput['status'])}><option value="planning">In planning</option><option value="confirmed">Confirmed</option></select></label></div>
      <label>Location <span className="optional">optional</span><input maxLength={150} placeholder="Somewhere worth going" value={input.location} onChange={e => set('location', e.target.value)} /></label>
      <label>The little details <span className="optional">optional</span><textarea rows={3} maxLength={2000} placeholder="Ideas, things to bring, or anything the group should know…" value={input.notes} onChange={e => set('notes', e.target.value)} /></label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="form-footer"><button type="button" className="button secondary" onClick={onClose}>Cancel</button><button className="button primary" type="submit"><Icon name={event ? 'check' : 'plus'} size={18} />{event ? 'Save changes' : 'Create event'}</button></div>
    </form>
  </Modal>;
}

export function GroupForm({ onSave, onClose }: { onSave: (name: string, description: string, color: GroupColor) => void; onClose: () => void }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState<GroupColor>('lavender');
  const [error, setError] = useState('');
  return <Modal title="Find your kind of people." eyebrow="NEW GROUP" onClose={onClose}><form className="form" onSubmit={e => { e.preventDefault(); if (!name.trim()) { setError('Give your group a name.'); return; } onSave(name.trim(), description.trim(), color); }}>
    <label>Group name<input autoFocus required maxLength={60} value={name} onChange={e => setName(e.target.value)} placeholder="The next great group chat" /></label>
    <label>A few words about your group<textarea rows={3} maxLength={300} value={description} onChange={e => setDescription(e.target.value)} placeholder="What brings you together?" /></label>
    <fieldset className="color-field"><legend>Pick a colour</legend><div className="color-options">{COLORS.map(item => <button key={item} type="button" className={`color-option tone-${item}`} aria-label={item} aria-pressed={color === item} onClick={() => setColor(item)}>{color === item && <Icon name="check" />}</button>)}</div></fieldset>
    <p className="form-hint">You’ll be the first member. Inviting friends will come in a future version.</p>
    {error && <p className="form-error" role="alert">{error}</p>}
    <div className="form-footer"><button className="button secondary" type="button" onClick={onClose}>Cancel</button><button className="button primary" type="submit"><Icon name="plus" size={18} />Create group</button></div>
  </form></Modal>;
}

export function ProfileForm({ profile, onSave, onClose }: { profile: Profile; onSave: (profile: Profile) => void; onClose: () => void }) {
  const [input, setInput] = useState(profile);
  const [error, setError] = useState('');
  return <Modal title="A little about you." eyebrow="EDIT PROFILE" onClose={onClose}><form className="form" onSubmit={e => { e.preventDefault(); if (!input.name.trim()) { setError('Please enter your name.'); return; } onSave({ ...input, name: input.name.trim(), location: input.location.trim(), bio: input.bio.trim() }); }}>
    <label>Your name<input autoFocus required maxLength={70} value={input.name} onChange={e => setInput({ ...input, name: e.target.value })} /></label>
    <label>Based in<input maxLength={100} placeholder="Your city" value={input.location} onChange={e => setInput({ ...input, location: e.target.value })} /></label>
    <label>A little introduction<textarea rows={4} maxLength={350} value={input.bio} onChange={e => setInput({ ...input, bio: e.target.value })} /></label>
    {error && <p className="form-error" role="alert">{error}</p>}
    <div className="form-footer"><button className="button secondary" type="button" onClick={onClose}>Cancel</button><button className="button primary" type="submit">Save profile</button></div>
  </form></Modal>;
}
