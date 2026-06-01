
/* global React, ReactDOM, Icon, Button, Toasts,
   DashboardView, BookingView, GarageView, HistoryView, LoyaltyView, ServicesView,
   loadState, saveState, totalSpend, currentTier,
   t, LANG_LABEL, LANG_CODE */

const { useState, useEffect, useMemo, useCallback } = React;

const NAV = [
  { id: 'dashboard', icon: 'home',     group: 'main'    },
  { id: 'booking',   icon: 'calendar', group: 'main'    },
  { id: 'services',  icon: 'layers',   group: 'main'    },
  { id: 'garage',    icon: 'car',      group: 'account' },
  { id: 'history',   icon: 'receipt',  group: 'account' },
  { id: 'loyalty',   icon: 'medal',    group: 'account' },
];

function App() {
  const [state, setState] = useState(() => loadState());
  const [routeArg, setRouteArg] = useState(null);
  const [langOpen, setLangOpen] = useState(false);

  const lang = state.lang || 'en';

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
    document.documentElement.setAttribute('lang', lang);
    saveState(state);
  }, [state, lang]);

  const setRoute = useCallback((id, arg = null) => {
    setRouteArg(arg);
    setState(s => ({ ...s, route: id }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const toggleTheme = () => setState(s => ({ ...s, theme: s.theme === 'dark' ? 'light' : 'dark' }));
  const setLang = (l) => { setState(s => ({ ...s, lang: l })); setLangOpen(false); };
  const dismissToast = (id) => setState(s => ({ ...s, toasts: s.toasts.filter(t => t.id !== id) }));

  const spend = totalSpend(state.history);
  const tier = currentTier(spend);
  const upcomingCount = state.bookings.filter(b => b.date >= new Date().toISOString().slice(0,10)).length;

  const headings = {
    dashboard: { title: t(lang,'page.dashboard.title'), sub: t(lang,'page.dashboard.sub') },
    booking:   { title: t(lang,'page.booking.title'),   sub: t(lang,'page.booking.sub')   },
    services:  { title: t(lang,'page.services.title'),  sub: t(lang,'page.services.sub')  },
    garage:    { title: t(lang,'page.garage.title'),    sub: t(lang,'page.garage.sub')    },
    history:   { title: t(lang,'page.history.title'),   sub: t(lang,'page.history.sub')   },
    loyalty:   { title: t(lang,'page.loyalty.title'),   sub: t(lang,'page.loyalty.sub')   },
  };
  const h = headings[state.route] || headings.dashboard;

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"/>
          <div>
            <div className="brand-name">Rueda</div>
            <div className="brand-sub">Alloy · studio</div>
          </div>
        </div>

        <div className="nav-label">{t(lang,'nav.workshop')}</div>
        <div className="nav">
          {NAV.filter(n => n.group === 'main').map(n => (
            <button key={n.id}
              className={`nav-item ${state.route === n.id ? 'active' : ''}`}
              onClick={() => setRoute(n.id)}>
              <span className="nav-icon"><Icon name={n.icon} size={17}/></span>
              {t(lang, 'nav.' + n.id)}
              {n.id === 'booking' && upcomingCount > 0 && <span className="nav-badge">{upcomingCount}</span>}
            </button>
          ))}
        </div>

        <div className="nav-label">{t(lang,'nav.account')}</div>
        <div className="nav">
          {NAV.filter(n => n.group === 'account').map(n => (
            <button key={n.id}
              className={`nav-item ${state.route === n.id ? 'active' : ''}`}
              onClick={() => setRoute(n.id)}>
              <span className="nav-icon"><Icon name={n.icon} size={17}/></span>
              {t(lang, 'nav.' + n.id)}
            </button>
          ))}
        </div>

        <div className="sidebar-footer">
          <div className="user-chip">
            <div className="avatar">{state.user.name.split(' ').map(p => p[0]).join('')}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="user-name">{state.user.name}</div>
              <div className="user-tier">{tier.name} · {tier.discount}% {t(lang,'c.off')}</div>
            </div>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <h1>{h.title}</h1>
            <div className="topbar-sub">{h.sub}</div>
          </div>
          <div className="topbar-spacer"/>

          {/* Language picker */}
          <div style={{ position: 'relative' }}>
            <button className="icon-btn lang-btn" title={t(lang,'c.language')}
              onClick={() => setLangOpen(o => !o)}
              style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 10px', fontSize: 12, fontWeight: 600 }}>
              <Icon name="globe" size={14}/>
              {LANG_CODE[lang]}
              <Icon name="chevron-down" size={11}/>
            </button>
            {langOpen && (
              <>
                <div onClick={() => setLangOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 25 }}/>
                <div style={{
                  position: 'absolute', right: 0, top: 'calc(100% + 6px)', zIndex: 30,
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,.12)',
                  minWidth: 150, overflow: 'hidden',
                }}>
                  {Object.keys(LANG_LABEL).map(l => (
                    <button key={l} onClick={() => setLang(l)} style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      width: '100%', padding: '10px 14px', textAlign: 'left',
                      background: l === lang ? 'var(--surface-2)' : 'transparent',
                      border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--ink)',
                    }}>
                      <span style={{ fontWeight: 700, fontSize: 11, color: 'var(--muted)', minWidth: 22 }}>{LANG_CODE[l]}</span>
                      <span>{LANG_LABEL[l]}</span>
                      {l === lang && <span style={{ marginLeft: 'auto', color: 'var(--primary)' }}>✓</span>}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <button className="icon-btn" title={t(lang,'c.notifications')}><Icon name="bell"/></button>
          <button className="icon-btn" title={t(lang,'c.toggleTheme')} onClick={toggleTheme}>
            <Icon name={state.theme === 'dark' ? 'sun' : 'moon'}/>
          </button>
          <Button kind="primary" icon="plus" onClick={() => setRoute('booking')}>{t(lang,'c.newBooking')}</Button>
        </header>

        {state.route === 'dashboard' && <DashboardView state={state} setRoute={setRoute} setState={setState} lang={lang}/>}
        {state.route === 'booking'   && <BookingView   state={state} setRoute={setRoute} setState={setState} initial={routeArg} lang={lang}/>}
        {state.route === 'services'  && <ServicesView  setRoute={setRoute} lang={lang}/>}
        {state.route === 'garage'    && <GarageView    state={state} setState={setState} lang={lang}/>}
        {state.route === 'history'   && <HistoryView   state={state} lang={lang}/>}
        {state.route === 'loyalty'   && <LoyaltyView   state={state} lang={lang}/>}
      </main>

      <Toasts items={state.toasts} onDismiss={dismissToast}/>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
