import { useEffect, useRef, type ReactNode } from 'react';
import type { Group, Member, PlanEvent, Profile } from '../types';
import { dateRange, formatDate } from '../lib/dates';
import { Icon, type IconName } from './Icon';

export const groupIcon: Record<Group['color'], IconName> = { lavender: 'sun', peach: 'coffee', blue: 'music', sage: 'mountain' };
export const categoryIcon: Record<PlanEvent['category'], IconName> = { Trip: 'suitcase', Music: 'music', Food: 'coffee', Outdoors: 'mountain', Hangout: 'spark' };
export const initials = (name: string) => name.trim().split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase();

export function BrandMark({ small = false }: { small?: boolean }) {
  return <span className={`brand-mark ${small ? 'small' : ''}`} aria-hidden="true"><svg viewBox="0 0 48 48"><ellipse cx="24" cy="24" rx="19" ry="8" transform="rotate(-42 24 24)" /><ellipse cx="24" cy="24" rx="19" ry="8" transform="rotate(42 24 24)" /><circle cx="24" cy="24" r="4" /></svg></span>;
}

export function Avatar({ member, profile, index = 0, large = false }: { member: Member; profile?: Profile; index?: number; large?: boolean }) {
  const name = member.id === profile?.id ? profile.name : member.name;
  return <span className={`avatar avatar-${index % 5} ${large ? 'avatar-large' : ''}`} title={name} aria-label={name}>{initials(name)}</span>;
}

export function AvatarStack({ members, profile, limit = 4 }: { members: Member[]; profile: Profile; limit?: number }) {
  return <div className="avatar-stack">{members.slice(0, limit).map((member, i) => <Avatar key={member.id} member={member} profile={profile} index={i} />)}{members.length > limit && <span className="avatar avatar-extra">+{members.length - limit}</span>}</div>;
}

export function StatusBadge({ status }: { status: PlanEvent['status'] }) {
  return <span className={`status-badge ${status}`}><span />{status === 'confirmed' ? 'Confirmed' : 'In planning'}</span>;
}

export function EmptyState({ icon = 'calendar', title, children, action }: { icon?: IconName; title: string; children: ReactNode; action?: ReactNode }) {
  return <div className="empty-state"><span className="empty-icon"><Icon name={icon} size={26} /></span><h3>{title}</h3><p>{children}</p>{action}</div>;
}

export function EventRow({ event, group, onOpen, compact = false }: { event: PlanEvent; group: Group; onOpen: (id: string) => void; compact?: boolean }) {
  return <button className={`event-row ${compact ? 'compact' : ''}`} onClick={() => onOpen(event.id)}>
    <span className={`date-tile tone-${group.color}`}><strong>{formatDate(event.startDate, { day: '2-digit' })}</strong><span>{formatDate(event.startDate, { month: 'short' })}</span></span>
    <span className="event-row-copy"><span className="event-row-title">{event.title}</span><span className="event-row-meta"><span className={`color-dot ${group.color}`} />{group.name}</span><span className="event-row-place">{compact ? `${dateRange(event)}${event.time ? ` · ${event.time}` : ''}` : `${event.location || 'Location to be decided'}${event.time ? ` · ${event.time}` : ''}`}</span></span>
    {!compact && <StatusBadge status={event.status} />}<Icon name="chevronRight" size={17} />
  </button>;
}

export function Modal({ title, eyebrow, children, onClose, wide = false }: { title: string; eyebrow?: string; children: ReactNode; onClose: () => void; wide?: boolean }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    dialog.current?.showModal();
    return () => { dialog.current?.close(); previous?.focus(); };
  }, []);
  return <dialog ref={dialog} className={`modal ${wide ? 'modal-wide' : ''}`} aria-labelledby="modal-title" onCancel={onClose} onClick={event => {
    if (event.target === event.currentTarget) {
      const rect = event.currentTarget.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose();
    }
  }}><div className="modal-header"><div>{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h2 id="modal-title">{title}</h2></div><button className="icon-button" aria-label="Close dialog" onClick={onClose}><Icon name="close" /></button></div>{children}</dialog>;
}

export function OrbitArt({ color = 'lavender' }: { color?: Group['color'] }) {
  return <svg className={`orbit-art art-${color}`} viewBox="0 0 360 170" fill="none" aria-hidden="true"><circle className="art-disc" cx="250" cy="85" r="70" /><ellipse cx="250" cy="85" rx="105" ry="28" transform="rotate(-28 250 85)" /><ellipse cx="250" cy="85" rx="105" ry="28" transform="rotate(32 250 85)" /><path d="M91 28v18M82 37h18M322 133v16M314 141h16" /><circle cx="137" cy="124" r="5" /><circle className="art-point" cx="302" cy="46" r="9" /><path d="M40 116c23-21 43-19 65-2" strokeDasharray="4 5" /></svg>;
}
