
/* global React, Icon, Button, t */
const { useState: useStateSvc } = React;

function ServicesView({ setRoute, lang }) {
  const [cat, setCat] = useStateSvc('all');
  const cats = ['all', ...Array.from(new Set(SERVICES.map(s => s.category)))];
  const items = SERVICES.filter(s => cat === 'all' || s.category === cat);

  return (
    <div className="view">
      <div className="mb-4">
        <div className="sub mono" style={{ letterSpacing: '.1em', textTransform: 'uppercase', fontSize: 11 }}>{t(lang,'svc.catalogue')}</div>
        <h1 style={{ fontSize: 28, margin: '6px 0 0', fontWeight: 600, letterSpacing: '-.015em' }}>{t(lang,'svc.title')}</h1>
        <p className="sub mt-2" style={{ maxWidth: 620 }}>{t(lang,'svc.intro')}</p>
      </div>

      <div className="row gap-8 mb-4" style={{ flexWrap: 'wrap' }}>
        {cats.map(c => (
          <button key={c} onClick={() => setCat(c)} className="btn btn-sm"
            style={{
              background: cat === c ? 'var(--ink)' : 'var(--surface)',
              color: cat === c ? 'var(--bg)' : 'var(--ink-2)',
              borderColor: cat === c ? 'var(--ink)' : 'var(--border)',
            }}>
            {c === 'all' ? t(lang,'svc.all') : c}
          </button>
        ))}
      </div>

      <div className="svc-grid">
        {items.map(s => (
          <div key={s.id} className="svc">
            <div className="svc-hero">
              <div className="svc-hero-tag"><span className="pill pill-primary">{s.tag}</span></div>
              {s.featured && <div style={{ position: 'absolute', top: 12, right: 12 }}><span className="pill pill-accent">{t(lang,'svc.featured')}</span></div>}
              <div className="row" style={{ gap: 14, alignItems: 'center' }}>
                <div className="wheel" style={{ '--wsize': '100px' }}/>
                <div className="col" style={{ gap: 4, textAlign: 'left' }}>
                  <div className="mono" style={{ fontSize: 9, opacity: .6 }}>[ photography placeholder ]</div>
                  <div className="mono" style={{ fontSize: 9, opacity: .6 }}>{s.category.toLowerCase()}</div>
                </div>
              </div>
            </div>
            <div className="svc-body">
              <div className="svc-title">{s.title}</div>
              <div className="sub" style={{ fontSize: 12.5 }}>{s.subtitle}</div>
              <div className="svc-desc">{s.desc}</div>
              <div className="row gap-8" style={{ flexWrap: 'wrap', marginTop: 4 }}>
                <span className="pill"><Icon name="clock" size={11}/> {s.duration} {t(lang,'c.min')}</span>
                <span className="pill">{s.unit}</span>
              </div>
              <div className="svc-foot">
                <div className="svc-price"><small>{t(lang,'c.from')}</small> {fmtMoney(s.price)}</div>
                <Button kind="primary" size="sm" icon="calendar" onClick={() => setRoute('booking', { serviceId: s.id })}>{t(lang,'svc.book')}</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { ServicesView });
