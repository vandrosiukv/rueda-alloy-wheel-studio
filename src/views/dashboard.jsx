
/* global React, t */
const { useState: useStateDash, useMemo: useMemoDash } = React;

function DashboardView({ state, setRoute, setState, lang }) {
  const spend = totalSpend(state.history);
  const tier = currentTier(spend);
  const next = nextTier(spend);
  const progress = next ? Math.min(1, (spend - tier.minSpend) / (next.minSpend - tier.minSpend)) : 1;
  const upcoming = state.bookings
    .filter(b => b.date >= todayStr())
    .sort((a,b) => a.date.localeCompare(b.date));
  const lastVisit = state.history[0];

  return (
    <div className="view">
      <div className="row mb-4" style={{ alignItems: 'flex-end', marginBottom: 22 }}>
        <div>
          <div className="sub mono" style={{ letterSpacing: '.1em', textTransform: 'uppercase', fontSize: 11 }}>{t(lang,'dash.greeting')}</div>
          <h1 style={{ fontSize: 34, margin: '6px 0 4px', letterSpacing: '-.02em', fontWeight: 600 }}>
            {state.user.name.split(' ')[0]} —
            <span className="muted" style={{ fontWeight: 400 }}> {t(lang,'dash.ready')}</span>
          </h1>
        </div>
      </div>

      <div className="grid grid-4 mb-4">
        <div className="kpi">
          <div className="kpi-label">{t(lang,'dash.lifetimeSpend')}</div>
          <div className="kpi-value mono tabular">{fmtMoney(spend)}</div>
          <div className="kpi-foot">{state.history.length} {t(lang,'dash.completedVisits')}</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">{t(lang,'dash.activeVehicles')}</div>
          <div className="kpi-value mono tabular">{state.vehicles.length}</div>
          <div className="kpi-foot">{state.vehicles.find(v => v.primary)?.plate} · {t(lang,'dash.primary')}</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">{t(lang,'dash.upcoming')}</div>
          <div className="kpi-value mono tabular">{upcoming.length}</div>
          <div className="kpi-foot">{t(lang,'dash.next')} {upcoming[0] ? fmtDate(upcoming[0].date, {}, lang) : '—'}</div>
        </div>
        <div className="kpi kpi-accent">
          <div className="kpi-label">{t(lang,'dash.loyaltyTier')}</div>
          <div className="kpi-value">{tier.name}</div>
          <div className="kpi-foot">{tier.discount}% {t(lang,'c.off')} · {next ? `${fmtMoney(next.minSpend - spend)} to ${next.name}` : t(lang,'dash.topTier')}</div>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1.55fr 1fr' }}>
        <div className="col">
          <div className="card card-lg">
            <div className="card-title">
              {t(lang,'dash.upcomingAppointments')}
              <Button kind="primary" size="sm" icon="plus" onClick={() => setRoute('booking')}>{t(lang,'c.newBooking')}</Button>
            </div>
            {upcoming.length === 0 ? (
              <div className="sub">{t(lang,'dash.noUpcoming')}</div>
            ) : (
              <div className="col">
                {upcoming.map(b => <UpcomingBooking key={b.id} b={b} state={state} setState={setState} setRoute={setRoute} lang={lang}/>)}
              </div>
            )}
          </div>

          <div className="card card-lg">
            <div className="card-title">
              {t(lang,'dash.recentVisits')}
              <button className="btn btn-ghost btn-sm" onClick={() => setRoute('history')}>{t(lang,'dash.viewAll')}</button>
            </div>
            <table className="tbl">
              <thead>
                <tr>
                  <th>{t(lang,'tbl.date')}</th>
                  <th>{t(lang,'tbl.services')}</th>
                  <th>{t(lang,'tbl.vehicle')}</th>
                  <th style={{ textAlign: 'right' }}>{t(lang,'tbl.total')}</th>
                </tr>
              </thead>
              <tbody>
                {state.history.slice(0, 4).map(h => {
                  const v = vehicleById(state, h.vehicleId);
                  return (
                    <tr key={h.id}>
                      <td className="mono">{fmtDate(h.date, { weekday: false, year: true }, lang)}</td>
                      <td>{h.serviceIds.map(id => serviceById(id)?.title).join(' · ')}</td>
                      <td className="mono sub">{v?.plate}</td>
                      <td className="mono tabular" style={{ textAlign: 'right', fontWeight: 600 }}>{fmtMoney(h.total)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="col">
          <div className="card card-lg">
            <div className="card-title">
              {t(lang,'dash.yourGarage')}
              <span className="eyebrow">{state.vehicles.length} {t(lang,'dash.vehicles')}</span>
            </div>
            <div className="col">
              {state.vehicles.map(v => (
                <div key={v.id} className="row" style={{ gap: 14, padding: '10px 0' }}>
                  <div className="wheel" style={{ '--wsize': '56px' }}/>
                  <div style={{ flex: 1 }}>
                    <div className="strong">{v.make} {v.model} <span className="sub" style={{ fontWeight: 400 }}>· {v.year}</span></div>
                    <div className="sub mono" style={{ fontSize: 12 }}>{v.plate} · {v.wheelSize} {t(lang,'c.wheels')}</div>
                  </div>
                  {v.primary && <span className="pill pill-primary">{t(lang,'c.primary')}</span>}
                </div>
              ))}
              <div className="divider"/>
              <Button icon="plus" kind="ghost" onClick={() => setRoute('garage')}>{t(lang,'dash.manageVehicles')}</Button>
            </div>
          </div>

          <div className="card card-lg">
            <div className="card-title">
              {t(lang,'dash.loyaltyProgress')}
              <span className="pill pill-accent">{tier.name} · {tier.discount}%</span>
            </div>
            <div className="mono tabular" style={{ fontSize: 13, color: 'var(--muted)' }}>
              {fmtMoney(spend)}{next && ` / ${fmtMoney(next.minSpend)}`}
            </div>
            <div className="loy-bar mt-2" style={{ background: 'var(--surface-2)' }}>
              <div className="loy-bar-fill" style={{ width: `${Math.round(progress * 100)}%`, background: 'var(--primary)' }}/>
            </div>
            <div className="mt-4 sub" style={{ fontSize: 13 }}>
              {next
                ? <>Spend <strong>{fmtMoney(next.minSpend - spend)}</strong> {t(lang,'dash.spendMore')} <strong>{next.name}</strong> {t(lang,'dash.andUnlock')} <strong>{next.discount}%</strong> {t(lang,'c.off')}.</>
                : t(lang,'dash.topTierMsg')}
            </div>
            <Button kind="ghost" onClick={() => setRoute('loyalty')} style={{ marginTop: 12 }}>{t(lang,'dash.programDetails')}</Button>
          </div>

          {lastVisit && (
            <div className="card card-lg" style={{ background: 'var(--surface-2)' }}>
              <div className="eyebrow mb-2" style={{ fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--muted)' }}>{t(lang,'dash.lastVisit')}</div>
              <div className="strong mb-2">{lastVisit.serviceIds.map(id => serviceById(id)?.title).join(' + ')}</div>
              <div className="sub mb-4">
                {t(lang,'dash.handledBy')} <strong>{lastVisit.tech}</strong> · {fmtDate(lastVisit.date, { weekday: false, year: true }, lang)}
              </div>
              <div className="row gap-8">
                {Array.from({length: 5}).map((_, i) => (
                  <Icon key={i} name="star" size={16}/>
                ))}
                <span className="sub mono" style={{ fontSize: 12 }}>{lastVisit.rating}.0 — {t(lang,'dash.yourRating')}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function UpcomingBooking({ b, state, setState, setRoute, lang }) {
  const v = vehicleById(state, b.vehicleId);
  const services = b.serviceIds.map(id => serviceById(id)).filter(Boolean);
  const d = new Date(b.date);
  const cancel = () => {
    setState(s => ({
      ...s,
      bookings: s.bookings.filter(x => x.id !== b.id),
      toasts: [...s.toasts, { id: Date.now(), msg: t(lang,'dash.bookingCancelled'), icon: 'x' }],
    }));
  };
  return (
    <div className="booking">
      <div className="booking-date">
        <div className="bd-d">{d.getDate()}</div>
        <div className="bd-m">{d.toLocaleDateString(typeof LANG_LOCALE !== 'undefined' ? LANG_LOCALE[lang] : 'en-GB', { month: 'short' })}</div>
      </div>
      <div className="booking-main">
        <div className="booking-title">{services.map(s => s.title).join(' + ')}</div>
        <div className="booking-meta">
          <span><Icon name="clock" size={13}/> {b.time}</span>
          <span><Icon name="car" size={13}/> {v?.plate} · {v?.make} {v?.model}</span>
          <span className="pill pill-olive"><span className="dot" style={{background:'var(--olive)'}}/>  {t(lang,'c.confirmed')}</span>
        </div>
      </div>
      <div className="row gap-8">
        <Button size="sm" icon="edit" onClick={() => setRoute('booking', { editId: b.id })}>{t(lang,'c.edit')}</Button>
        <Button size="sm" kind="danger" icon="x" onClick={cancel}>{t(lang,'c.cancel')}</Button>
      </div>
    </div>
  );
}

Object.assign(window, { DashboardView });
