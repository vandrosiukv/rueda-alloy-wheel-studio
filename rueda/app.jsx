/* global React, ReactDOM, window,
  Icon, Button, Toasts,
  Dashboard, Booking, Services, Garage, History, Loyalty,
  loadState, saveState, totalSpend, tierFor, t, LANG_LABEL, LANG_CODE */
const { useState, useEffect, useCallback } = React;

const NAV = [
  { id:'dashboard', icon:'home',     group:'workshop' },
  { id:'booking',   icon:'calendar', group:'workshop' },
  { id:'services',  icon:'layers',   group:'workshop' },
  { id:'garage',    icon:'car',      group:'account' },
  { id:'history',   icon:'receipt',  group:'account' },
  { id:'loyalty',   icon:'medal',    group:'account' },
];

function App() {
  const [state, setState] = useState(() => loadState());
  const [arg, setArg] = useState(null);
  const [langOpen, setLangOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const lang = state.lang || 'en';

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
    document.documentElement.setAttribute('lang', lang);
    saveState(state);
  }, [state, lang]);

  const setRoute = useCallback((id, a = null) => {
    setArg(a);
    setState(s => ({ ...s, route: id }));
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  const toggleTheme = () => setState(s => ({ ...s, theme: s.theme==='dark'?'light':'dark' }));
  const setLang = (l) => { setState(s => ({ ...s, lang: l })); setLangOpen(false); };
  const dismiss = (id) => setState(s => ({ ...s, toasts: s.toasts.filter(x => x.id !== id) }));

  const spend = totalSpend(state.history);
  const tier = tierFor(spend);
  const upcomingCount = state.bookings.filter(b => b.date >= new Date().toISOString().slice(0,10)).length;
  const route = state.route;

  return (
    <div className={`app${sidebarOpen ? ' sidebar-is-open' : ''}`}>
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}/>}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"/>
          <div>
            <div className="brand-name">Rueda</div>
            <div className="brand-sub">{t(lang,'brand.sub')}</div>
          </div>
        </div>

        <div className="nav-label">{t(lang,'nav.workshop')}</div>
        {NAV.filter(n => n.group==='workshop').map(n => (
          <button key={n.id} className={`nav-item ${route===n.id?'active':''}`} onClick={() => setRoute(n.id)}>
            <Icon name={n.icon} size={16}/> {t(lang,'nav.'+n.id)}
            {n.id==='booking' && upcomingCount>0 && <span className="nav-badge">{upcomingCount}</span>}
          </button>
        ))}
        <div className="nav-label">{t(lang,'nav.account')}</div>
        {NAV.filter(n => n.group==='account').map(n => (
          <button key={n.id} className={`nav-item ${route===n.id?'active':''}`} onClick={() => setRoute(n.id)}>
            <Icon name={n.icon} size={16}/> {t(lang,'nav.'+n.id)}
          </button>
        ))}

        <div className="sidebar-foot">
          <div className="user-chip">
            <div className="avatar">{state.user.name.split(' ').map(p=>p[0]).join('')}</div>
            <div style={{flex:1,minWidth:0}}>
              <div className="user-name">{state.user.name}</div>
              <div className="user-tier">{tier.name} · {tier.pct}% {t(lang,'c.off')}</div>
            </div>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button className="icon-btn mobile-menu-btn" onClick={() => setSidebarOpen(o => !o)} title="Menu">
            <Icon name="menu" size={18}/>
          </button>
          <div>
            <h1>{t(lang,'top.'+route+'.title')}</h1>
            <div className="topbar-sub">{t(lang,'top.'+route+'.sub')}</div>
          </div>
          <div className="spacer"/>

          <div style={{position:'relative'}}>
            <button className="lang-btn" onClick={() => setLangOpen(o => !o)} title={t(lang,'top.language')}>
              <Icon name="globe" size={14}/>
              {LANG_CODE[lang]}
              <Icon name="chevD" size={11}/>
            </button>
            {langOpen && (
              <>
                <div onClick={() => setLangOpen(false)} style={{position:'fixed',inset:0,zIndex:25}}/>
                <div className="lang-pop">
                  {Object.keys(LANG_LABEL).map(l => (
                    <button key={l} className={`lang-item ${l===lang?'cur':''}`} onClick={() => setLang(l)}>
                      <span className="code">{LANG_CODE[l]}</span>
                      <span>{LANG_LABEL[l]}</span>
                      {l===lang && <span style={{marginLeft:'auto'}}>✓</span>}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <button className="icon-btn" title={t(lang,'top.notifications')}><Icon name="bell"/></button>
          <button className="icon-btn" title={t(lang,'top.toggleTheme')} onClick={toggleTheme}><Icon name={state.theme==='dark'?'sun':'moon'}/></button>
          <Button kind="accent" icon="plus" onClick={() => setRoute('booking')}>{t(lang,'top.newBooking')}</Button>
        </header>

        {route==='dashboard' && <Dashboard state={state} setState={setState} setRoute={setRoute} lang={lang}/>}
        {route==='booking'   && <Booking   state={state} setState={setState} setRoute={setRoute} initial={arg} lang={lang}/>}
        {route==='services'  && <Services  setRoute={setRoute} lang={lang}/>}
        {route==='garage'    && <Garage    state={state} setState={setState} lang={lang}/>}
        {route==='history'   && <History   state={state} lang={lang}/>}
        {route==='loyalty'   && <Loyalty   state={state} lang={lang}/>}
      </main>

      <nav className="bottom-nav">
        {NAV.map(n => (
          <button key={n.id} className={`bottom-nav-item ${route===n.id?'active':''}`} onClick={() => setRoute(n.id)}>
            <Icon name={n.icon} size={22}/>
            <span>{t(lang,'nav.'+n.id)}</span>
            {n.id==='booking' && upcomingCount>0 && <span className="bottom-nav-badge">{upcomingCount}</span>}
          </button>
        ))}
      </nav>

      <Toasts items={state.toasts} onDismiss={dismiss}/>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
