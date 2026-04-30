/* global React */
// --- Shared UI: Icon, Modal, Toast, Button ---

const { useState, useEffect, useMemo, useRef, useCallback } = React;

// Minimal stroke-icon set (Lucide-ish, hand-tuned)
function Icon({ name, size = 18, stroke = 1.75, className = '' }) {
  const props = {
    width: size, height: size, viewBox: '0 0 24 24',
    fill: 'none', stroke: 'currentColor',
    strokeWidth: stroke, strokeLinecap: 'round', strokeLinejoin: 'round',
    className,
  };
  switch (name) {
    case 'home': return (
      <svg {...props}><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5"/></svg>
    );
    case 'calendar': return (
      <svg {...props}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18"/><path d="M8 3v4M16 3v4"/></svg>
    );
    case 'car': return (
      <svg {...props}><path d="M5 17h14M5 17v2a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-5l2-5a2 2 0 0 1 1.8-1.2h12.4A2 2 0 0 1 20 9l2 5v5a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-2"/><circle cx="7.5" cy="14.5" r="1.5"/><circle cx="16.5" cy="14.5" r="1.5"/></svg>
    );
    case 'clock': return (
      <svg {...props}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
    );
    case 'receipt': return (
      <svg {...props}><path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3z"/><path d="M9 8h6M9 12h6M9 16h4"/></svg>
    );
    case 'star': return (
      <svg {...props}><path d="m12 3 2.8 5.8 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.3l1.1-6.2L3 9.7l6.2-.9L12 3z"/></svg>
    );
    case 'medal': return (
      <svg {...props}><path d="M7 3h10l-2.5 6h-5L7 3z"/><circle cx="12" cy="15" r="6"/><path d="M10 13.5 12 16l4-4"/></svg>
    );
    case 'wrench': return (
      <svg {...props}><path d="M14.7 6.3a4 4 0 0 0 5 5L21 13l-8 8-8-8 1.7-1.3a4 4 0 0 0 5-5z"/></svg>
    );
    case 'layers': return (
      <svg {...props}><path d="m12 3 9 5-9 5-9-5 9-5z"/><path d="m3 13 9 5 9-5"/></svg>
    );
    case 'plus': return (
      <svg {...props}><path d="M12 5v14M5 12h14"/></svg>
    );
    case 'arrow-left': return (
      <svg {...props}><path d="M15 6l-6 6 6 6"/></svg>
    );
    case 'arrow-right': return (
      <svg {...props}><path d="M9 6l6 6-6 6"/></svg>
    );
    case 'chevron-left': return (
      <svg {...props}><path d="M15 6l-6 6 6 6"/></svg>
    );
    case 'chevron-right': return (
      <svg {...props}><path d="M9 6l6 6-6 6"/></svg>
    );
    case 'x': return (
      <svg {...props}><path d="M18 6 6 18M6 6l12 12"/></svg>
    );
    case 'sun': return (
      <svg {...props}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
    );
    case 'moon': return (
      <svg {...props}><path d="M20 14.5A8 8 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z"/></svg>
    );
    case 'bell': return (
      <svg {...props}><path d="M6 8a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6z"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>
    );
    case 'check': return (
      <svg {...props}><path d="m5 12 5 5 9-11"/></svg>
    );
    case 'edit': return (
      <svg {...props}><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
    );
    case 'trash': return (
      <svg {...props}><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
    );
    case 'pin': return (
      <svg {...props}><path d="M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>
    );
    case 'phone': return (
      <svg {...props}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8 9.6a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2z"/></svg>
    );
    case 'mail': return (
      <svg {...props}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 7 9-7"/></svg>
    );
    case 'user': return (
      <svg {...props}><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>
    );
    case 'filter': return (
      <svg {...props}><path d="M3 5h18l-7 8v6l-4-2v-4L3 5z"/></svg>
    );
    case 'spark': return (
      <svg {...props}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/></svg>
    );
    default: return <svg {...props}/>;
  }
}

function Button({ kind='default', size, icon, children, ...rest }) {
  const cls = ['btn'];
  if (kind === 'primary') cls.push('btn-primary');
  if (kind === 'ghost') cls.push('btn-ghost');
  if (kind === 'danger') cls.push('btn-danger');
  if (size === 'lg') cls.push('btn-lg');
  if (size === 'sm') cls.push('btn-sm');
  return (
    <button className={cls.join(' ')} {...rest}>
      {icon && <Icon name={icon} size={size === 'sm' ? 14 : 16} />}
      {children}
    </button>
  );
}

function Modal({ open, onClose, title, subtitle, children, footer, width }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" style={width ? { width } : undefined} onClick={e => e.stopPropagation()}>
        {title && <h3>{title}</h3>}
        {subtitle && <p className="muted">{subtitle}</p>}
        {children}
        {footer && <div className="row" style={{ justifyContent: 'flex-end', marginTop: 20, gap: 8 }}>{footer}</div>}
      </div>
    </div>
  );
}

function Toasts({ items, onDismiss }) {
  useEffect(() => {
    if (!items.length) return;
    const t = setTimeout(() => onDismiss(items[0].id), 2800);
    return () => clearTimeout(t);
  }, [items, onDismiss]);
  return (
    <div className="toast-wrap">
      {items.map(t => (
        <div key={t.id} className="toast">
          <Icon name={t.icon || 'check'} size={14} />
          {t.msg}
        </div>
      ))}
    </div>
  );
}

// Month helpers
function monthMatrix(year, month) {
  // month 0-indexed
  const first = new Date(year, month, 1);
  const startDow = (first.getDay() + 6) % 7; // make Monday=0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevDays = new Date(year, month, 0).getDate();
  const cells = [];
  for (let i = 0; i < startDow; i++) {
    cells.push({ day: prevDays - startDow + 1 + i, inMonth: false, date: new Date(year, month - 1, prevDays - startDow + 1 + i) });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, inMonth: true, date: new Date(year, month, d) });
  }
  while (cells.length < 42) {
    const last = cells[cells.length - 1].date;
    const nd = new Date(last); nd.setDate(nd.getDate() + 1);
    cells.push({ day: nd.getDate(), inMonth: false, date: nd });
  }
  return cells;
}
function isoDate(d) {
  return d.toISOString().slice(0,10);
}

Object.assign(window, { Icon, Button, Modal, Toasts, monthMatrix, isoDate });
