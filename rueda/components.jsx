/* global React, window */
const ICONS = {
  home:'M3 12l9-9 9 9M5 10v10h5v-6h4v6h5V10',
  calendar:'M3 5h18v16H3zM3 9h18M8 3v4M16 3v4',
  layers:'M12 2l9 5-9 5-9-5 9-5zM3 12l9 5 9-5M3 17l9 5 9-5',
  car:'M5 17h14M5 17v-4l2-5h10l2 5v4M5 17v3M19 17v3M7 13h10',
  receipt:'M5 3h14v18l-3-2-3 2-3-2-3 2-2-2zM8 7h8M8 11h8M8 15h5',
  medal:'M12 15a5 5 0 100-10 5 5 0 000 10zM7 13l-2 8 4-2 3 2 3-2 4 2-2-8',
  bell:'M6 17h12l-2-2v-5a4 4 0 00-8 0v5l-2 2zM10 21h4',
  sun:'M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41M16 12a4 4 0 11-8 0 4 4 0 018 0z',
  moon:'M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z',
  plus:'M12 5v14M5 12h14',
  x:'M18 6L6 18M6 6l12 12',
  check:'M5 12l5 5L20 7',
  edit:'M12 20h9M16.5 3.5a2.12 2.12 0 113 3L7 19l-4 1 1-4 12.5-12.5z',
  trash:'M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6',
  clock:'M12 6v6l4 2M12 22a10 10 0 110-20 10 10 0 010 20z',
  wrench:'M14 7a5 5 0 116 6l-9 9-4-4 9-9-2-2z',
  star:'M12 2l3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z',
  chevL:'M15 18l-6-6 6-6',
  chevR:'M9 18l6-6-6-6',
  chevD:'m6 9 6 6 6-6',
  arrowL:'M19 12H5M12 19l-7-7 7-7',
  arrowR:'M5 12h14M12 5l7 7-7 7',
  pin:'M12 21s-7-7.5-7-12a7 7 0 1114 0c0 4.5-7 12-7 12zM12 11a2 2 0 100-4 2 2 0 000 4z',
  mail:'M3 5h18v14H3zM3 5l9 8 9-8',
  phone:'M5 4h4l2 5-3 2a12 12 0 006 6l2-3 5 2v4a2 2 0 01-2 2A18 18 0 013 6a2 2 0 012-2z',
  spark:'M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8',
  globe:'M12 22a10 10 0 100-20 10 10 0 000 20zM2 12h20M12 2a14 14 0 010 20M12 2a14 14 0 000 20',
  menu:'M3 6h18M3 12h18M3 18h18',
};
function Icon({ name, size = 16, stroke = 1.75 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={{ flex: 'none' }}>
      <path d={ICONS[name] || ''}/>
    </svg>
  );
}

function Button({ kind, icon, iconRight, size, children, ...rest }) {
  return (
    <button className={['btn', kind || '', size || ''].filter(Boolean).join(' ')} {...rest}>
      {icon && <Icon name={icon} size={size === 'sm' ? 13 : 15}/>}
      {children}
      {iconRight && <Icon name={iconRight} size={size === 'sm' ? 13 : 15}/>}
    </button>
  );
}

function Modal({ open, onClose, title, subtitle, children, footer }) {
  if (!open) return null;
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <div className="strong" style={{ fontSize: 17 }}>{title}</div>
          {subtitle && <div className="sub mt-1" style={{ fontSize: 12.5 }}>{subtitle}</div>}
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  );
}

function Toasts({ items, onDismiss }) {
  React.useEffect(() => {
    const ts = items.map(t => setTimeout(() => onDismiss(t.id), 3200));
    return () => ts.forEach(clearTimeout);
  }, [items, onDismiss]);
  return (
    <div className="toast-stack">
      {items.map(t => (
        <div key={t.id} className="toast">
          <Icon name={t.icon || 'check'} size={14}/>
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { Icon, Button, Modal, Toasts });
