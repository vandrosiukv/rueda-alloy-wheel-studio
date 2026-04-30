/* global React, window, Icon, Button, Modal */
const { useState, useMemo } = React;

function svcTitle(lang, s) { return t(lang, s.tk + '.t'); }
function svcDesc(lang, s) { return t(lang, s.tk + '.d'); }
function svcUnit(lang, s) { return t(lang, s.unitk); }
function svcTag(lang, s) { return t(lang, s.tagk); }
function tierLabel(lang, name) { return t(lang, 'tier.name.' + name); }

/* ───── Dashboard ───── */
function Dashboard({ state, setState, setRoute, lang }) {
  const spend = totalSpend(state.history);
  const tier = tierFor(spend);
  const next = nextTier(spend);
  const progress = next ? Math.min(1, (spend - tier.min) / (next.min - tier.min)) : 1;
  const upcoming = state.bookings.filter(b => b.date >= todayIso()).sort((a,b)=>a.date.localeCompare(b.date));
  const last = state.history[0];

  const tierRest = next
    ? t(lang, 'kpi.tier.toNext', { amount: fmtMoney(next.min - spend), tier: tierLabel(lang, next.name) })
    : t(lang, 'kpi.tier.top');

  const cancel = (b) => setState(s => ({
    ...s, bookings: s.bookings.filter(x => x.id !== b.id),
    toasts: [...s.toasts, { id: Date.now(), msg: t(lang,'dash.bookingCancelled'), icon: 'x' }]
  }));

  return (
    <div>
      <div className="grid g4 mb-4">
        <div className="kpi">
          <div className="kpi-label">{t(lang,'kpi.spend')}</div>
          <div className="kpi-value mono tabular">{fmtMoney(spend)}</div>
          <div className="kpi-foot">{t(lang,'kpi.spend.foot',{n:state.history.length})}</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">{t(lang,'kpi.vehicles')}</div>
          <div className="kpi-value mono tabular">{state.vehicles.length}</div>
          <div className="kpi-foot">{t(lang,'kpi.vehicles.foot',{plate: state.vehicles.find(v=>v.primary)?.plate || '—'})}</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">{t(lang,'kpi.upcoming')}</div>
          <div className="kpi-value mono tabular">{upcoming.length}</div>
          <div className="kpi-foot">{t(lang,'kpi.upcoming.foot',{when: upcoming[0] ? fmtDate(lang, upcoming[0].date) : '—'})}</div>
        </div>
        <div className="kpi accent">
          <div className="kpi-label">{t(lang,'kpi.tier')}</div>
          <div className="kpi-value">{tierLabel(lang, tier.name)}</div>
          <div className="kpi-foot">{t(lang,'kpi.tier.foot',{pct:tier.pct, rest:tierRest})}</div>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1.5fr 1fr' }}>
        <div className="col">
          <div className="card lg">
            <div className="ctitle">
              {t(lang,'dash.upcoming')}
              <Button kind="accent" icon="plus" size="sm" onClick={() => setRoute('booking')}>{t(lang,'top.newBooking')}</Button>
            </div>
            {upcoming.length === 0 && <div className="sub">{t(lang,'dash.noUpcoming')}</div>}
            <div className="col">
              {upcoming.map(b => {
                const v = vehicleById(state, b.vehicleId);
                const services = b.serviceIds.map(svc).filter(Boolean);
                const d = new Date(b.date);
                return (
                  <div key={b.id} className="booking">
                    <div className="bdate">
                      <div className="d">{d.getDate()}</div>
                      <div className="m">{shortMonth(lang, d)}</div>
                    </div>
                    <div className="bmain">
                      <div className="btitle">{services.map(s => svcTitle(lang, s)).join(' + ')}</div>
                      <div className="bmeta">
                        <span><Icon name="clock" size={12}/> {b.time}</span>
                        <span><Icon name="car" size={12}/> {v?.plate} · {v?.make} {v?.model}</span>
                        <span className="pill olive"><span className="dot"/>{t(lang,'c.confirmed')}</span>
                      </div>
                    </div>
                    <div className="row">
                      <Button size="sm" icon="edit" onClick={() => setRoute('booking',{editId:b.id})}>{t(lang,'c.edit')}</Button>
                      <Button size="sm" kind="danger" icon="x" onClick={() => cancel(b)}>{t(lang,'c.cancel')}</Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card lg">
            <div className="ctitle">
              {t(lang,'dash.recent')}
              <button className="btn ghost sm" onClick={() => setRoute('history')}>{t(lang,'dash.viewAll')}</button>
            </div>
            <table className="tbl">
              <thead><tr>
                <th>{t(lang,'hist.col.date')}</th>
                <th>{t(lang,'book.services')}</th>
                <th>{t(lang,'book.vehicle')}</th>
                <th style={{textAlign:'right'}}>{t(lang,'hist.col.total')}</th>
              </tr></thead>
              <tbody>
                {state.history.slice(0,4).map(h => {
                  const v = vehicleById(state, h.vehicleId);
                  return (
                    <tr key={h.id}>
                      <td className="mono">{fmtDate(lang, h.date, {year:true})}</td>
                      <td>{h.serviceIds.map(id => svcTitle(lang, svc(id))).join(' · ')}</td>
                      <td className="mono sub">{v?.plate}</td>
                      <td className="mono tabular strong" style={{textAlign:'right'}}>{fmtMoney(h.total)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="col">
          <div className="card lg">
            <div className="ctitle">
              {t(lang,'dash.garage')}
              <span className="eyebrow">{t(lang,'dash.garageCount',{n:state.vehicles.length})}</span>
            </div>
            <div className="col">
              {state.vehicles.map(v => (
                <div key={v.id} className="row" style={{padding:'8px 0'}}>
                  <div className="wheel" style={{'--s':'48px'}}/>
                  <div style={{flex:1}}>
                    <div className="strong">{v.make} {v.model} <span className="sub" style={{fontWeight:400}}>· {v.year}</span></div>
                    <div className="sub mono" style={{fontSize:11}}>{v.plate} · {t(lang,'gar.wheels',{size:v.wheelSize})}</div>
                  </div>
                  {v.primary && <span className="pill primary">{t(lang,'c.primary')}</span>}
                </div>
              ))}
              <Button kind="ghost" icon="plus" onClick={() => setRoute('garage')}>{t(lang,'dash.manage')}</Button>
            </div>
          </div>

          <div className="card lg">
            <div className="ctitle">
              {t(lang,'dash.loyalty')}
              <span className="pill primary">{tierLabel(lang, tier.name)} · {tier.pct}%</span>
            </div>
            <div className="mono tabular sub" style={{fontSize:12}}>{fmtMoney(spend)}{next && ` / ${fmtMoney(next.min)}`}</div>
            <div className="bar"><div className="bar-fill" style={{width: `${Math.round(progress*100)}%`}}/></div>
            <div className="sub mt-3" style={{fontSize:13}}>
              {next ? t(lang,'dash.spendMore',{amount: fmtMoney(next.min-spend), tier: tierLabel(lang, next.name), pct: next.pct}) : t(lang,'dash.topTier')}
            </div>
            <Button kind="ghost" onClick={() => setRoute('loyalty')} style={{marginTop:12}}>{t(lang,'dash.programDetails')}</Button>
          </div>

          {last && (
            <div className="card lg" style={{background:'var(--surface-2)'}}>
              <div className="eyebrow mb-2">{t(lang,'dash.lastVisit')}</div>
              <div className="strong mb-2">{last.serviceIds.map(id => svcTitle(lang, svc(id))).join(' + ')}</div>
              <div className="sub" style={{fontSize:12.5}}>{t(lang,'dash.handledBy',{tech:last.tech, date: fmtDate(lang, last.date, {year:true})})}</div>
              <div className="row mt-3">
                {Array.from({length:5}).map((_,i) => <Icon key={i} name="star" size={14}/>)}
                <span className="sub mono" style={{fontSize:11}}>{last.rating}.0 — {t(lang,'dash.yourRating')}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ───── Booking ───── */
function Booking({ state, setState, setRoute, initial, lang }) {
  const editing = initial?.editId ? state.bookings.find(b => b.id === initial.editId) : null;
  const [step, setStep] = useState(1);
  const [services, setServices] = useState(() => editing ? editing.serviceIds : (initial?.serviceId ? [initial.serviceId] : []));
  const [vehicleId, setVehicleId] = useState(() => editing?.vehicleId || state.vehicles.find(v=>v.primary)?.id || state.vehicles[0]?.id);
  const [note, setNote] = useState(editing?.note || '');

  const initD = editing ? new Date(editing.date) : new Date();
  const [vY, setVY] = useState(initD.getFullYear());
  const [vM, setVM] = useState(initD.getMonth());
  const [date, setDate] = useState(editing?.date || '');
  const [time, setTime] = useState(editing?.time || '');

  const cells = useMemo(() => monthGrid(vY, vM), [vY, vM]);
  const today = todayIso();
  const subtotal = services.reduce((s,id) => s + (svc(id)?.price || 0), 0);
  const dur = services.reduce((s,id) => s + (svc(id)?.dur || 0), 0);
  const tier = tierFor(totalSpend(state.history));
  const discount = +(subtotal * tier.pct/100).toFixed(2);
  const total = subtotal - discount;
  const slotInfo = useMemo(() => date ? takenSlots(date, state.bookings.filter(b => !editing || b.id !== editing.id)) : null, [date, state.bookings, editing]);

  const can2 = services.length > 0 && vehicleId;
  const can3 = can2 && date && time;

  const submit = () => {
    setState(s => {
      let bookings = s.bookings;
      if (editing) bookings = bookings.map(b => b.id === editing.id ? {...b, date, time, serviceIds:services, vehicleId, note} : b);
      else bookings = [...bookings, { id:'b'+Math.random().toString(36).slice(2,7), date, time, serviceIds:services, vehicleId, note, status:'confirmed'}];
      return { ...s, bookings, route:'dashboard', toasts: [...s.toasts, {id:Date.now(), msg: editing? t(lang,'book.updated') : t(lang,'book.confirmed'), icon:'check'}]};
    });
  };

  return (
    <div style={{maxWidth:1180}}>
      <div className="steps">
        {[1,2,3].map(i => (
          <div key={i} className={`step ${step===i?'active':step>i?'done':''}`}>
            <div className="n">{step>i?'✓':i}</div>
            <span>{t(lang,'book.step'+i)}</span>
          </div>
        ))}
      </div>

      <div className="grid" style={{gridTemplateColumns:'1fr 340px',alignItems:'start'}}>
        <div className="col">
          {step===1 && (
            <>
              <div className="card lg">
                <div className="ctitle">{t(lang,'book.chooseServices')} <span className="eyebrow">{services.length} {t(lang,'c.selected')}</span></div>
                <div className="grid g2">
                  {SERVICES.map(s => {
                    const on = services.includes(s.id);
                    return (
                      <button key={s.id} onClick={() => setServices(arr => on ? arr.filter(x=>x!==s.id) : [...arr, s.id])}
                        style={{textAlign:'left',padding:14,borderRadius:12,border:`1px solid ${on?'var(--primary)':'var(--border)'}`,background:on?'var(--primary-soft)':'var(--surface)',color:'var(--ink)',transition:'all .12s'}}>
                        <div className="between" style={{marginBottom:6}}>
                          <span className="pill">{svcTag(lang, s)}</span>
                          <span className="mono strong">{fmtMoney(s.price)}</span>
                        </div>
                        <div className="strong" style={{fontSize:14}}>{svcTitle(lang, s)}</div>
                        <div className="sub" style={{fontSize:12,marginTop:2}}>{s.dur} {t(lang,'c.minutes')} · {svcUnit(lang, s)}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="card lg">
                <div className="ctitle">{t(lang,'book.vehicle')}</div>
                <div className="grid g2">
                  {state.vehicles.map(v => {
                    const on = vehicleId === v.id;
                    return (
                      <button key={v.id} onClick={() => setVehicleId(v.id)}
                        style={{textAlign:'left',padding:14,borderRadius:12,border:`1px solid ${on?'var(--ink)':'var(--border)'}`,background:on?'var(--surface-2)':'var(--surface)'}}>
                        <div className="row">
                          <div className="wheel" style={{'--s':'40px'}}/>
                          <div>
                            <div className="strong">{v.make} {v.model}</div>
                            <div className="sub mono" style={{fontSize:11}}>{v.plate} · {v.year} · {v.wheelSize}</div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {step===2 && (
            <>
              <div className="card lg">
                <div className="between mb-3">
                  <div>
                    <div className="eyebrow">{t(lang,'book.pickDay')}</div>
                    <div className="strong" style={{fontSize:18,textTransform:'capitalize'}}>{monthLabel(lang, new Date(vY, vM, 1))}</div>
                  </div>
                  <div className="row">
                    <button className="icon-btn" onClick={() => { let m=vM-1, y=vY; if(m<0){m=11;y--;} setVM(m); setVY(y); }}><Icon name="chevL"/></button>
                    <button className="icon-btn" onClick={() => { let m=vM+1, y=vY; if(m>11){m=0;y++;} setVM(m); setVY(y); }}><Icon name="chevR"/></button>
                  </div>
                </div>
                <div className="cal">
                  {DOW[lang].map(d => <div key={d} className="dow">{d}</div>)}
                  {cells.map((c,i) => {
                    const iso = isoDate(c.date);
                    const past = iso < today;
                    const sun = c.date.getDay() === 0;
                    const off = !c.inMonth || past || sun;
                    const sel = iso === date;
                    const isToday = iso === today;
                    const has = state.bookings.some(b => b.date === iso);
                    return (
                      <button key={i} disabled={off} className={['cell', off?'off':'', sel?'sel':'', isToday?'today':'', has&&!off?'has':''].join(' ')}
                        onClick={() => { if(!off){ setDate(iso); setTime(''); } }}>
                        <div>{c.day}</div>
                        {sun && c.inMonth && <div className="sub mono" style={{fontSize:8,marginTop:'auto'}}>{t(lang,'c.closed')}</div>}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="card lg">
                <div className="ctitle">{t(lang,'book.availableTimes')} <span className="eyebrow">{date ? fmtDate(lang, date, {year:true}) : t(lang,'book.pickDay')}</span></div>
                {!date && <div className="sub">{t(lang,'book.pickDayFirst')}</div>}
                {date && slotInfo?.closed && <div className="sub">{t(lang,'book.sundayClosed')}</div>}
                {date && !slotInfo?.closed && (
                  <div className="slots">
                    {ALL_SLOTS.map(tm => {
                      const taken = slotInfo.taken.has(tm);
                      return <button key={tm} className={`slot ${time===tm?'sel':''}`} disabled={taken} onClick={() => setTime(tm)}>{tm}</button>;
                    })}
                  </div>
                )}
              </div>
            </>
          )}

          {step===3 && (
            <div className="card lg">
              <div className="ctitle">{t(lang,'book.review')}</div>
              <div className="col" style={{gap:14}}>
                <SumRow icon="calendar" label={t(lang,'book.when')} value={date ? <>{fmtDate(lang, date, {year:true})} · <span className="mono">{time}</span></> : '—'}/>
                <SumRow icon="car" label={t(lang,'book.vehicle')} value={(()=>{ const v=vehicleById(state,vehicleId); return v?`${v.make} ${v.model} · ${v.plate}`:'—'; })()}/>
                <SumRow icon="wrench" label={t(lang,'book.services')} value={
                  <div className="col" style={{gap:6}}>
                    {services.map(id => { const s = svc(id); return (
                      <div key={id} className="between" style={{fontSize:13}}>
                        <span>{svcTitle(lang, s)} <span className="sub">· {s.dur} {t(lang,'c.minutes')}</span></span>
                        <span className="mono tabular">{fmtMoney(s.price)}</span>
                      </div>
                    ); })}
                  </div>
                }/>
                <SumRow icon="clock" label={t(lang,'book.duration')} value={`${Math.floor(dur/60)}h ${dur%60}m`}/>
              </div>
              <div className="field mt-4">
                <label>{t(lang,'book.note')}</label>
                <textarea className="input" rows={3} value={note} onChange={e=>setNote(e.target.value)} placeholder={t(lang,'book.notePh')}/>
              </div>
            </div>
          )}

          <div className="between mt-3">
            {step>1 ? <Button kind="ghost" icon="arrowL" onClick={() => setStep(s=>s-1)}>{t(lang,'c.back')}</Button> : <div/>}
            {step<3 && <Button kind="accent" iconRight="arrowR" disabled={step===1?!can2:!can3} onClick={() => setStep(s=>s+1)}>{t(lang,'c.continue')}</Button>}
            {step===3 && <Button kind="accent" icon="check" onClick={submit}>{editing ? t(lang,'book.saveChanges') : t(lang,'c.confirm')}</Button>}
          </div>
        </div>

        <div style={{position:'sticky',top:90}}>
          <div className="card lg">
            <div className="ctitle">{t(lang,'book.orderSummary')}</div>
            {services.length===0 && <div className="sub">{t(lang,'book.pickOne')}</div>}
            {services.map(id => { const s = svc(id); return (
              <div key={id} className="between" style={{padding:'8px 0',borderBottom:'1px dashed var(--border)',fontSize:13}}>
                <span>{svcTitle(lang, s)}</span><span className="mono">{fmtMoney(s.price)}</span>
              </div>
            ); })}
            {services.length>0 && (<>
              <div className="between mt-3" style={{fontSize:13}}>
                <span className="sub">{t(lang,'book.subtotal')}</span><span className="mono tabular">{fmtMoney(subtotal)}</span>
              </div>
              {tier.pct>0 && (
                <div className="between" style={{fontSize:13,color:'var(--olive)',marginTop:4}}>
                  <span>{t(lang,'book.discount',{tier:tierLabel(lang, tier.name), pct:tier.pct})}</span>
                  <span className="mono tabular">−{fmtMoney(discount)}</span>
                </div>
              )}
              <div className="between mt-3" style={{fontSize:18,fontWeight:600}}>
                <span>{t(lang,'book.total')}</span><span className="mono tabular">{fmtMoney(total)}</span>
              </div>
              <div className="sub mt-2" style={{fontSize:11}}>{t(lang,'book.finalPrice')}</div>
            </>)}
          </div>
          <div className="card mt-3">
            <div className="row" style={{alignItems:'flex-start'}}>
              <div style={{width:32,height:32,borderRadius:9,background:'var(--olive-soft)',color:'var(--olive)',display:'grid',placeItems:'center',flex:'none'}}>
                <Icon name="pin" size={15}/>
              </div>
              <div>
                <div className="strong" style={{fontSize:13}}>{t(lang,'book.location')}</div>
                <div className="sub" style={{fontSize:12}}>{t(lang,'book.address')}</div>
                <div className="sub mono mt-1" style={{fontSize:11}}>{t(lang,'book.hours')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SumRow({ icon, label, value }) {
  return (
    <div className="row" style={{alignItems:'flex-start'}}>
      <div style={{width:34,height:34,borderRadius:9,background:'var(--surface-2)',color:'var(--ink-2)',display:'grid',placeItems:'center',flex:'none'}}>
        <Icon name={icon} size={15}/>
      </div>
      <div style={{flex:1}}>
        <div className="eyebrow">{label}</div>
        <div className="mt-1">{value}</div>
      </div>
    </div>
  );
}

/* ───── Services ───── */
function Services({ setRoute, lang }) {
  const [cat, setCat] = useState('all');
  const cats = ['all', ...Array.from(new Set(SERVICES.map(s => s.cat)))];
  const items = SERVICES.filter(s => cat === 'all' || s.cat === cat);

  return (
    <div>
      <p className="sub mb-4" style={{maxWidth:620}}>{t(lang,'svc.intro')}</p>
      <div className="row wrap mb-4">
        {cats.map(c => (
          <button key={c} className="btn sm"
            onClick={() => setCat(c)}
            style={{background:cat===c?'var(--ink)':'var(--surface)',color:cat===c?'var(--bg-2)':'var(--ink-2)',borderColor:cat===c?'var(--ink)':'var(--border)'}}>
            {c==='all' ? t(lang,'svc.all') : t(lang, 'cat.'+c)}
          </button>
        ))}
      </div>
      <div className="grid" style={{gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))'}}>
        {items.map(s => (
          <div key={s.id} className="svc">
            <div className="svc-hero">
              <div className="row between">
                <span className="pill primary">{svcTag(lang, s)}</span>
                {s.featured && <span className="pill accent">{t(lang,'svc.tag.featured')}</span>}
              </div>
              <div className="row mt-3">
                <div className="wheel" style={{'--s':'72px'}}/>
                <div className="sub mono" style={{fontSize:9,opacity:.6}}>{t(lang,'cat.'+s.cat).toLowerCase()}</div>
              </div>
            </div>
            <div className="svc-body">
              <div className="svc-title">{svcTitle(lang, s)}</div>
              <div className="svc-desc">{svcDesc(lang, s)}</div>
              <div className="row wrap" style={{marginTop:'auto'}}>
                <span className="pill"><Icon name="clock" size={10}/> {s.dur} {t(lang,'c.minutes')}</span>
                <span className="pill">{svcUnit(lang, s)}</span>
              </div>
              <div className="svc-foot">
                <div className="svc-price"><small>{t(lang,'c.from')} </small>{fmtMoney(s.price)}</div>
                <Button kind="accent" size="sm" icon="calendar" onClick={() => setRoute('booking',{serviceId:s.id})}>{t(lang,'svc.book')}</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───── Garage ───── */
function Garage({ state, setState, lang }) {
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(null);
  const open = (v) => {
    setEditing(v || {});
    setForm(v ? {...v} : { plate:'', make:'', model:'', year: new Date().getFullYear(), wheelSize:'17"', primary:false });
  };
  const close = () => { setEditing(null); setForm(null); };
  const save = () => {
    setState(s => {
      let vehicles = s.vehicles;
      if (editing.id) vehicles = vehicles.map(v => v.id===editing.id ? {...v, ...form} : v);
      else { const nv = {...form, id: 'v'+Math.random().toString(36).slice(2,6)}; vehicles = [...vehicles, nv]; if (form.primary) vehicles = vehicles.map(v => ({...v, primary: v.id===nv.id})); }
      if (form.primary && editing.id) vehicles = vehicles.map(v => ({...v, primary: v.id===editing.id}));
      return {...s, vehicles, toasts: [...s.toasts, { id:Date.now(), msg: editing.id ? t(lang,'gar.updated') : t(lang,'gar.added'), icon:'check'}]};
    });
    close();
  };
  const remove = () => {
    setState(s => ({...s, vehicles: s.vehicles.filter(v => v.id !== editing.id), toasts:[...s.toasts, {id:Date.now(), msg:t(lang,'gar.removed'), icon:'trash'}]}));
    close();
  };
  const tier = tierFor(totalSpend(state.history));

  return (
    <div>
      <div className="between mb-4">
        <div className="sub">{t(lang,'top.garage.sub')}</div>
        <Button kind="accent" icon="plus" onClick={() => open(null)}>{t(lang,'gar.addVehicle')}</Button>
      </div>
      <div className="grid" style={{gridTemplateColumns:'340px 1fr'}}>
        <div className="card lg">
          <div className="ctitle">{t(lang,'gar.personal')}</div>
          <div className="row mb-3">
            <div className="avatar" style={{width:54,height:54,fontSize:18}}>{state.user.name.split(' ').map(p=>p[0]).join('')}</div>
            <div>
              <div className="strong" style={{fontSize:15}}>{state.user.name}</div>
              <div className="sub mono" style={{fontSize:11}}>{t(lang,'gar.memberSince',{when: new Date(state.user.joined).toLocaleDateString(LANG_LOCALE[lang],{month:'long',year:'numeric'})})}</div>
            </div>
          </div>
          <ProfileRow icon="mail" label={t(lang,'gar.email')} value={state.user.email}/>
          <ProfileRow icon="phone" label={t(lang,'gar.phone')} value={state.user.phone}/>
          <ProfileRow icon="medal" label={t(lang,'gar.tier')} value={<span className="pill primary">{tierLabel(lang, tier.name)}</span>}/>
          <Button kind="ghost" icon="edit" style={{marginTop:14}}>{t(lang,'gar.editProfile')}</Button>
        </div>
        <div className="card lg">
          <div className="ctitle">{t(lang,'gar.vehicles')} <span className="eyebrow">{t(lang,'gar.onFile',{n:state.vehicles.length})}</span></div>
          <div className="col">
            {state.vehicles.map(v => (
              <div key={v.id} className="booking">
                <div className="wheel" style={{'--s':'48px'}}/>
                <div className="bmain">
                  <div className="btitle">
                    {v.make} {v.model} <span className="sub" style={{fontWeight:400}}>· {v.year}</span>
                    {v.primary && <span className="pill primary" style={{marginLeft:8}}>{t(lang,'c.primary')}</span>}
                  </div>
                  <div className="bmeta">
                    <span className="mono">{v.plate}</span>
                    <span>{t(lang,'gar.wheels',{size:v.wheelSize})}</span>
                  </div>
                </div>
                <Button size="sm" icon="edit" onClick={() => open(v)}>{t(lang,'c.edit')}</Button>
              </div>
            ))}
            {state.vehicles.length===0 && <div className="sub">{t(lang,'gar.noVehicles')}</div>}
          </div>
        </div>
      </div>

      {form && (
        <Modal open={true} onClose={close}
          title={editing.id ? t(lang,'gar.editTitle') : t(lang,'gar.addTitle')}
          subtitle={t(lang,'gar.modalSub')}
          footer={<>
            {editing.id && <Button kind="danger" icon="trash" onClick={remove} style={{marginRight:'auto'}}>{t(lang,'c.remove')}</Button>}
            <Button kind="ghost" onClick={close}>{t(lang,'c.cancel')}</Button>
            <Button kind="accent" icon="check" onClick={save} disabled={!form.plate || !form.make}>{t(lang,'c.save')}</Button>
          </>}>
          <div className="grid g2">
            <div className="field"><label>{t(lang,'gar.plate')}</label><input className="input mono" value={form.plate} onChange={e=>setForm({...form, plate:e.target.value.toUpperCase()})}/></div>
            <div className="field"><label>{t(lang,'gar.year')}</label><input className="input mono" type="number" value={form.year} onChange={e=>setForm({...form, year:+e.target.value})}/></div>
            <div className="field"><label>{t(lang,'gar.make')}</label><input className="input" value={form.make} onChange={e=>setForm({...form, make:e.target.value})}/></div>
            <div className="field"><label>{t(lang,'gar.model')}</label><input className="input" value={form.model} onChange={e=>setForm({...form, model:e.target.value})}/></div>
            <div className="field"><label>{t(lang,'gar.wheelSize')}</label>
              <select className="select" value={form.wheelSize} onChange={e=>setForm({...form, wheelSize:e.target.value})}>
                {['15"','16"','17"','18"','19"','20"','21"','22"'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="field"><label>{t(lang,'c.primary')}</label>
              <label className="row" style={{paddingTop:8}}>
                <input type="checkbox" checked={!!form.primary} onChange={e=>setForm({...form, primary:e.target.checked})}/>
                <span className="sub">{t(lang,'gar.primaryLabel')}</span>
              </label>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function ProfileRow({ icon, label, value }) {
  return (
    <div className="row mt-2" style={{alignItems:'flex-start'}}>
      <div style={{width:30,height:30,borderRadius:9,background:'var(--surface-2)',color:'var(--ink-2)',display:'grid',placeItems:'center',flex:'none'}}>
        <Icon name={icon} size={14}/>
      </div>
      <div>
        <div className="eyebrow">{label}</div>
        <div className="mt-1">{value}</div>
      </div>
    </div>
  );
}

/* ───── History ───── */
function History({ state, lang }) {
  const [filt, setFilt] = useState('all');
  const [veh, setVeh] = useState('all');
  const items = useMemo(() => state.history.filter(h => {
    if (veh !== 'all' && h.vehicleId !== veh) return false;
    if (filt === 'alloy') return h.serviceIds.some(id => svc(id)?.cat === 'Alloy Restoration');
    if (filt === 'tires') return h.serviceIds.some(id => svc(id)?.cat === 'Tire Service');
    return true;
  }), [state.history, filt, veh]);
  const totalF = items.reduce((s,h) => s+h.total, 0);
  const cAlloy = state.history.filter(h => h.serviceIds.some(id => svc(id)?.cat==='Alloy Restoration')).length;
  const cTires = state.history.filter(h => h.serviceIds.some(id => svc(id)?.cat==='Tire Service')).length;

  const chart = useMemo(() => {
    const months = []; const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth()-i, 1);
      const k = d.toISOString().slice(0,7);
      const total = state.history.filter(h => h.date.startsWith(k)).reduce((s,h)=>s+h.total,0);
      months.push({ k, label: d.toLocaleDateString(LANG_LOCALE[lang], {month:'short'}), total });
    }
    return months;
  }, [state.history, lang]);
  const max = Math.max(...chart.map(m => m.total), 1);

  return (
    <div>
      <div className="grid g3 mb-4">
        <div className="kpi"><div className="kpi-label">{t(lang,'hist.kpi.spend')}</div><div className="kpi-value mono tabular">{fmtMoney(totalSpend(state.history))}</div><div className="kpi-foot">{t(lang,'hist.kpi.spend.foot',{n:state.history.length})}</div></div>
        <div className="kpi"><div className="kpi-label">{t(lang,'hist.kpi.alloy')}</div><div className="kpi-value mono tabular">{cAlloy}</div><div className="kpi-foot">{t(lang,'hist.kpi.alloy.foot')}</div></div>
        <div className="kpi"><div className="kpi-label">{t(lang,'hist.kpi.tires')}</div><div className="kpi-value mono tabular">{cTires}</div><div className="kpi-foot">{t(lang,'hist.kpi.tires.foot')}</div></div>
      </div>

      <div className="card lg mb-4">
        <div className="ctitle">{t(lang,'hist.monthly')} <span className="eyebrow">€</span></div>
        <div className="row" style={{alignItems:'flex-end',gap:8,height:120}}>
          {chart.map(m => {
            const h = Math.round((m.total/max)*100) + (m.total>0?6:2);
            return (
              <div key={m.k} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:6}}>
                <div style={{flex:1,display:'flex',alignItems:'flex-end',width:'100%'}}>
                  <div title={fmtMoney(m.total)} style={{width:'100%',height:h,background: m.total>0?'linear-gradient(180deg,var(--primary),var(--accent))':'var(--surface-2)',borderRadius:'5px 5px 1px 1px',transition:'height .4s'}}/>
                </div>
                <div className="mono sub" style={{fontSize:10}}>{m.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card lg">
        <div className="between mb-3">
          <div className="ctitle" style={{margin:0}}>{t(lang,'hist.allVisits')} <span className="eyebrow">{t(lang,'hist.results',{n:items.length, total: fmtMoney(totalF)})}</span></div>
          <div className="row">
            <div className="row" style={{padding:3,background:'var(--surface-2)',borderRadius:9}}>
              {[['all','c.all'],['alloy','c.alloy'],['tires','c.tires']].map(([k,lk]) => (
                <button key={k} onClick={() => setFilt(k)} className="btn sm" style={{background:filt===k?'var(--surface)':'transparent',border:'none',color:filt===k?'var(--ink)':'var(--muted)'}}>{t(lang,lk)}</button>
              ))}
            </div>
            <select className="select" style={{width:'auto'}} value={veh} onChange={e=>setVeh(e.target.value)}>
              <option value="all">{t(lang,'c.allVehicles')}</option>
              {state.vehicles.map(v => <option key={v.id} value={v.id}>{v.plate} · {v.make}</option>)}
            </select>
          </div>
        </div>
        <table className="tbl">
          <thead><tr>
            <th>{t(lang,'hist.col.date')}</th>
            <th>{t(lang,'hist.col.work')}</th>
            <th>{t(lang,'hist.col.vehicle')}</th>
            <th>{t(lang,'hist.col.tech')}</th>
            <th>{t(lang,'hist.col.rating')}</th>
            <th style={{textAlign:'right'}}>{t(lang,'hist.col.total')}</th>
          </tr></thead>
          <tbody>
            {items.map(h => {
              const v = vehicleById(state, h.vehicleId);
              return (
                <tr key={h.id}>
                  <td className="mono">{fmtDate(lang, h.date,{year:true})}</td>
                  <td><div className="col" style={{gap:2}}>{h.serviceIds.map(id => { const s = svc(id); return <span key={id}>{svcTitle(lang, s)} <span className="pill" style={{marginLeft:4}}>{s?.cat==='Alloy Restoration'?t(lang,'c.alloy'):t(lang,'c.tires')}</span></span>; })}</div></td>
                  <td className="mono sub">{v?.plate}<br/><span style={{fontSize:11}}>{v?.make} {v?.model}</span></td>
                  <td>{h.tech}</td>
                  <td>{Array.from({length:5}).map((_,i) => <Icon key={i} name="star" size={12} stroke={i<h.rating?2:1}/>)}</td>
                  <td className="mono tabular strong" style={{textAlign:'right'}}>{fmtMoney(h.total)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ───── Loyalty ───── */
function Loyalty({ state, lang }) {
  const spend = totalSpend(state.history);
  const tier = tierFor(spend);
  const next = nextTier(spend);
  const progress = next ? Math.min(1, (spend - tier.min)/(next.min - tier.min)) : 1;
  const pts = Math.floor(spend);
  const redeem = Math.floor(pts/10);

  return (
    <div>
      <div className="grid" style={{gridTemplateColumns:'1.2fr 1fr'}}>
        <div className="loy-hero">
          <div className="row between" style={{alignItems:'flex-start'}}>
            <div>
              <div className="eyebrow" style={{color:'rgba(255,255,255,.7)'}}>{t(lang,'loy.memberTier')}</div>
              <div className="loy-tier-name">{tierLabel(lang, tier.name)}</div>
              <div className="mono mt-2" style={{fontSize:11,opacity:.85}}>{t(lang,'loy.since',{name: state.user.name.toUpperCase(), year: new Date(state.user.joined).getFullYear()})}</div>
            </div>
            <div className="wheel" style={{'--s':'72px',border:'2px solid #fff5e3',filter:'brightness(1.4) saturate(.6)'}}/>
          </div>
          <div className="mt-4">
            <div className="row between" style={{fontSize:12,opacity:.85}}>
              <span className="mono">{t(lang,'loy.lifetime',{amount: fmtMoney(spend)})}</span>
              {next ? <span className="mono">{t(lang,'loy.toNext',{tier: tierLabel(lang, next.name), amount: fmtMoney(next.min)})}</span> : null}
            </div>
            <div className="bar"><div className="bar-fill" style={{width:`${Math.round(progress*100)}%`}}/></div>
            <div className="mt-2" style={{fontSize:13,opacity:.95}}>
              {next ? t(lang,'loy.toUnlock',{amount: fmtMoney(next.min - spend), pct: next.pct}) : t(lang,'loy.maxDiscount',{pct: tier.pct})}
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card lg">
            <div className="ctitle">{t(lang,'loy.points')}</div>
            <div className="row" style={{gap:24}}>
              <div>
                <div className="eyebrow">{t(lang,'loy.earned')}</div>
                <div className="mono tabular" style={{fontSize:26,fontWeight:600}}>{pts}</div>
              </div>
              <div style={{width:1,background:'var(--border)',alignSelf:'stretch'}}/>
              <div>
                <div className="eyebrow">{t(lang,'loy.redeemable')}</div>
                <div className="mono tabular" style={{fontSize:26,fontWeight:600,color:'var(--primary)'}}>€{redeem}</div>
              </div>
            </div>
            <div className="sub mt-3" style={{fontSize:12}}>{t(lang,'loy.pointsHelp')}</div>
            <Button kind="accent" icon="spark" style={{marginTop:14}}>{t(lang,'loy.redeem')}</Button>
          </div>
          <div className="card lg">
            <div className="ctitle">{t(lang,'loy.referrals')}</div>
            <div className="sub mb-3" style={{fontSize:12.5}}>{t(lang,'loy.refHelp',{credit:'€20'})}</div>
            <div className="row">
              <input className="input mono" value="RUEDA-LUCIA-2026" readOnly style={{flex:1,fontSize:12}}/>
              <Button kind="accent">{t(lang,'c.copy')}</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="ctitle mb-3">{t(lang,'loy.allTiers')} <span className="eyebrow">{t(lang,'loy.tiersSub')}</span></div>
        <div className="tiers">
          {TIERS.map(tr => {
            const cur = tr.name === tier.name;
            const perks = tArr(lang, 'perk.' + tr.name);
            return (
              <div key={tr.name} className={`tier ${cur?'cur':''}`}>
                <div className="tier-name">
                  <span style={{width:18,height:18,borderRadius:'50%',background:tr.color,display:'inline-block',flex:'none'}}/>
                  {tierLabel(lang, tr.name)}
                  {cur && <span className="pill primary">{t(lang,'loy.current')}</span>}
                </div>
                <div className="tier-thresh">
                  {tr.min===0 ? `${t(lang,'loy.welcome')} · ${tr.pct}% ${t(lang,'c.off')}` : t(lang,'loy.thresh',{amount: fmtMoney(tr.min), pct: tr.pct})}
                </div>
                <ul className="tier-perks">
                  {perks.map((p,i) => <li key={i}>{p}</li>)}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Dashboard, Booking, Services, Garage, History, Loyalty });
