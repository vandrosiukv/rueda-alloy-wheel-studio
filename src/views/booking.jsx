
/* global React, Icon, Button, Modal, monthMatrix, isoDate, t */
const { useState: useStateBk, useMemo: useMemoBk, useEffect: useEffectBk } = React;

function BookingView({ state, setState, setRoute, initial, lang }) {
  const editing = initial?.editId ? state.bookings.find(b => b.id === initial.editId) : null;
  const prefillService = initial?.serviceId;

  const [step, setStep] = useStateBk(1);
  const [selectedServices, setSelectedServices] = useStateBk(() =>
    editing ? editing.serviceIds : (prefillService ? [prefillService] : []));
  const [vehicleId, setVehicleId] = useStateBk(() =>
    editing?.vehicleId || state.vehicles.find(v => v.primary)?.id || state.vehicles[0]?.id);
  const [note, setNote] = useStateBk(editing?.note || '');

  const initDate = editing ? new Date(editing.date) : new Date();
  const [visYear, setVisYear] = useStateBk(initDate.getFullYear());
  const [visMonth, setVisMonth] = useStateBk(initDate.getMonth());
  const [selectedDate, setSelectedDate] = useStateBk(editing ? editing.date : '');
  const [selectedTime, setSelectedTime] = useStateBk(editing ? editing.time : '');

  const locale = typeof LANG_LOCALE !== 'undefined' ? LANG_LOCALE[lang] : 'en-GB';
  const cells = useMemoBk(() => monthMatrix(visYear, visMonth), [visYear, visMonth]);
  const monthLabel = new Date(visYear, visMonth, 1).toLocaleDateString(locale, { month: 'long', year: 'numeric' });

  // Localized Mon-Sun headers
  const dowLabels = useMemoBk(() => {
    const labels = [];
    for (let i = 1; i <= 7; i++) {
      const d = new Date(2024, 0, i); // Jan 1 2024 is Monday
      labels.push(d.toLocaleDateString(locale, { weekday: 'short' }));
    }
    return labels;
  }, [locale]);

  const todayIso = todayStr();
  const totalDuration = selectedServices.reduce((s, id) => s + (serviceById(id)?.duration || 0), 0);
  const subtotal = selectedServices.reduce((s, id) => s + (serviceById(id)?.price || 0), 0);
  const tier = currentTier(totalSpend(state.history));
  const discount = +(subtotal * tier.discount / 100).toFixed(2);
  const total = subtotal - discount;

  const canStep2 = selectedServices.length > 0 && vehicleId;
  const canStep3 = canStep2 && selectedDate && selectedTime;

  const slotInfo = useMemoBk(
    () => selectedDate ? takenSlotsForDate(selectedDate, state.bookings.filter(b => !editing || b.id !== editing.id)) : null,
    [selectedDate, state.bookings, editing]
  );

  const prevMonth = () => { let m = visMonth - 1, y = visYear; if (m < 0) { m = 11; y--; } setVisMonth(m); setVisYear(y); };
  const nextMonth = () => { let m = visMonth + 1, y = visYear; if (m > 11) { m = 0; y++; } setVisMonth(m); setVisYear(y); };

  const pickDate = (cell) => {
    if (!cell.inMonth) return;
    const iso = isoDate(cell.date);
    if (iso < todayIso) return;
    if (cell.date.getDay() === 0) return;
    setSelectedDate(iso);
    setSelectedTime('');
  };

  const dateHasBookingMap = useMemoBk(() => {
    const m = {};
    state.bookings.forEach(b => { m[b.date] = true; });
    return m;
  }, [state.bookings]);

  const submit = () => {
    setState(s => {
      let bookings = s.bookings;
      if (editing) {
        bookings = bookings.map(b => b.id === editing.id
          ? { ...b, date: selectedDate, time: selectedTime, serviceIds: selectedServices, vehicleId, note }
          : b);
      } else {
        bookings = [...bookings, {
          id: 'b' + Math.random().toString(36).slice(2, 8),
          date: selectedDate, time: selectedTime,
          serviceIds: selectedServices, vehicleId, note, status: 'confirmed',
        }];
      }
      return {
        ...s, bookings, route: 'dashboard',
        toasts: [...s.toasts, { id: Date.now(), msg: editing ? t(lang,'book.updated') : t(lang,'book.confirmed'), icon: 'check' }],
      };
    });
  };

  return (
    <div className="view" style={{ maxWidth: 1180 }}>
      <div className="between mb-4">
        <div>
          <div className="sub mono" style={{ letterSpacing: '.1em', textTransform: 'uppercase', fontSize: 11 }}>
            {editing ? t(lang,'book.editing') : t(lang,'book.new')}
          </div>
          <h1 style={{ fontSize: 28, margin: '6px 0 0', fontWeight: 600, letterSpacing: '-.015em' }}>
            {editing ? t(lang,'book.changeAppt') : t(lang,'book.bookVisit')}
          </h1>
        </div>
        <Button kind="ghost" icon="arrow-left" onClick={() => setRoute('dashboard')}>{t(lang,'c.back')}</Button>
      </div>

      <div className="steps">
        {[1,2,3].map(i => (
          <div key={i} className={`step ${step === i ? 'step-active' : step > i ? 'step-done' : ''}`}>
            <div className="step-num">{step > i ? '✓' : i}</div>
            <span>{t(lang, `book.step${i}`)}</span>
          </div>
        ))}
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 360px', gap: 22, alignItems: 'start' }}>
        <div className="col">
          {step === 1 && (
            <>
              <div className="card card-lg">
                <div className="card-title">{t(lang,'book.chooseServices')} <span className="eyebrow">{selectedServices.length} {t(lang,'book.selected')}</span></div>
                <div className="grid grid-2">
                  {SERVICES.map(svc => {
                    const on = selectedServices.includes(svc.id);
                    return (
                      <button key={svc.id}
                        onClick={() => setSelectedServices(arr => on ? arr.filter(x => x !== svc.id) : [...arr, svc.id])}
                        style={{
                          textAlign: 'left', padding: 14, borderRadius: 12,
                          border: `1px solid ${on ? 'var(--primary)' : 'var(--border)'}`,
                          background: on ? 'var(--primary-soft)' : 'var(--surface)',
                          color: on ? 'var(--ink)' : 'inherit',
                          boxShadow: on ? '0 0 0 3px color-mix(in oklch, var(--primary) 18%, transparent)' : 'none',
                          transition: 'all .15s',
                        }}>
                        <div className="row between" style={{ marginBottom: 6 }}>
                          <span className="pill" style={{ background: 'transparent', borderColor: on ? 'var(--primary)' : 'var(--border)' }}>{svc.tag}</span>
                          <span className="mono strong">{fmtMoney(svc.price)}</span>
                        </div>
                        <div className="strong" style={{ fontSize: 14 }}>{svc.title}</div>
                        <div className="sub" style={{ fontSize: 12, marginTop: 2 }}>{svc.subtitle} · {svc.duration} {t(lang,'c.min')}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="card card-lg">
                <div className="card-title">{t(lang,'book.vehicle')}</div>
                <div className="grid grid-2">
                  {state.vehicles.map(v => {
                    const on = vehicleId === v.id;
                    return (
                      <button key={v.id} onClick={() => setVehicleId(v.id)}
                        style={{
                          textAlign: 'left', padding: 14, borderRadius: 12,
                          border: `1px solid ${on ? 'var(--ink)' : 'var(--border)'}`,
                          background: on ? 'var(--surface-2)' : 'var(--surface)',
                          transition: 'all .15s',
                        }}>
                        <div className="row" style={{ gap: 12 }}>
                          <div className="wheel" style={{ '--wsize': '44px' }}/>
                          <div>
                            <div className="strong">{v.make} {v.model}</div>
                            <div className="sub mono" style={{ fontSize: 12 }}>{v.plate} · {v.year} · {v.wheelSize}</div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="card card-lg">
                <div className="cal-head between">
                  <div>
                    <div className="sub mono" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.1em' }}>{t(lang,'book.pickDay')}</div>
                    <div className="cal-title">{monthLabel}</div>
                  </div>
                  <div className="row gap-8">
                    <button className="icon-btn" onClick={prevMonth}><Icon name="chevron-left"/></button>
                    <button className="icon-btn" onClick={nextMonth}><Icon name="chevron-right"/></button>
                  </div>
                </div>
                <div className="cal-grid">
                  {dowLabels.map(d => <div key={d} className="cal-dow">{d}</div>)}
                  {cells.map((c, i) => {
                    const iso = isoDate(c.date);
                    const isPast = iso < todayIso;
                    const isSun = c.date.getDay() === 0;
                    const isOff = !c.inMonth || isPast || isSun;
                    const isSel = iso === selectedDate;
                    const isToday = iso === todayIso;
                    const has = dateHasBookingMap[iso];
                    return (
                      <button key={i}
                        disabled={isOff}
                        onClick={() => pickDate(c)}
                        className={['cal-cell', isOff?'cal-cell-off':'', isSel?'cal-cell-selected':'', isToday?'cal-cell-today':'', has&&!isOff?'cal-cell-has':''].join(' ')}>
                        <div className="cal-cell-num">{c.day}</div>
                        {isSun && c.inMonth && <div className="sub mono" style={{ fontSize: 9, marginTop: 'auto' }}>{t(lang,'book.closed')}</div>}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="card card-lg">
                <div className="card-title">
                  {t(lang,'book.availableTimes')}
                  <span className="eyebrow">{selectedDate ? fmtDate(selectedDate, { year: true }, lang) : t(lang,'book.pickDay')}</span>
                </div>
                {!selectedDate && <div className="sub">{t(lang,'book.pickDayFirst')}</div>}
                {selectedDate && slotInfo?.closed && <div className="sub">{t(lang,'book.sundayClosed')}</div>}
                {selectedDate && !slotInfo?.closed && (
                  <div className="slots">
                    {ALL_SLOTS.map(tm => {
                      const taken = slotInfo.taken.has(tm);
                      const sel = selectedTime === tm;
                      return (
                        <button key={tm} className={`slot ${sel ? 'slot-selected' : ''}`} disabled={taken} onClick={() => setSelectedTime(tm)}>{tm}</button>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}

          {step === 3 && (
            <div className="card card-lg">
              <div className="card-title">{t(lang,'book.reviewConfirm')}</div>
              <div className="col" style={{ gap: 14 }}>
                <SummaryRow label={t(lang,'book.when')} icon="calendar"
                  value={selectedDate ? <>{fmtDate(selectedDate, { year: true }, lang)} · <span className="mono">{selectedTime}</span></> : '—'}/>
                <SummaryRow label={t(lang,'book.vehicle')} icon="car"
                  value={(() => { const v = vehicleById(state, vehicleId); return v ? `${v.make} ${v.model} · ${v.plate}` : '—'; })()}/>
                <SummaryRow label={t(lang,'book.services')} icon="wrench"
                  value={<div className="col" style={{ gap: 6 }}>
                    {selectedServices.map(id => {
                      const s = serviceById(id);
                      return <div key={id} className="between" style={{ fontSize: 13 }}>
                        <span>{s.title} <span className="sub">· {s.duration} {t(lang,'c.min')}</span></span>
                        <span className="mono tabular">{fmtMoney(s.price)}</span>
                      </div>;
                    })}
                  </div>}/>
                <SummaryRow label={t(lang,'book.duration')} icon="clock"
                  value={`${Math.floor(totalDuration/60)}h ${totalDuration%60}${t(lang,'c.min')}`}/>
              </div>
              <div className="field mt-4">
                <label>{t(lang,'book.note')}</label>
                <textarea className="input" rows={3} value={note} onChange={e => setNote(e.target.value)} placeholder={t(lang,'book.notePh')}/>
              </div>
            </div>
          )}

          <div className="row between mt-2">
            {step > 1
              ? <Button kind="ghost" icon="arrow-left" onClick={() => setStep(s => s - 1)}>{t(lang,'c.back')}</Button>
              : <div/>}
            {step < 3 && (
              <Button kind="primary" size="lg" icon="arrow-right"
                disabled={step === 1 ? !canStep2 : !canStep3}
                onClick={() => setStep(s => s + 1)}>
                {t(lang,'c.continue')}
              </Button>
            )}
            {step === 3 && (
              <Button kind="primary" size="lg" icon="check" onClick={submit}>
                {editing ? t(lang,'book.saveChanges') : t(lang,'book.confirmBooking')}
              </Button>
            )}
          </div>
        </div>

        <div style={{ position: 'sticky', top: 92 }}>
          <div className="card card-lg">
            <div className="card-title">{t(lang,'book.orderSummary')}</div>
            {selectedServices.length === 0 && <div className="sub">{t(lang,'book.pickService')}</div>}
            {selectedServices.map(id => {
              const s = serviceById(id);
              return (
                <div key={id} className="between" style={{ padding: '8px 0', borderBottom: '1px dashed var(--border)', fontSize: 13 }}>
                  <span>{s.title}</span>
                  <span className="mono">{fmtMoney(s.price)}</span>
                </div>
              );
            })}
            {selectedServices.length > 0 && (
              <>
                <div className="between" style={{ marginTop: 10, fontSize: 13 }}>
                  <span className="sub">{t(lang,'book.subtotal')}</span>
                  <span className="mono tabular">{fmtMoney(subtotal)}</span>
                </div>
                {tier.discount > 0 && (
                  <div className="between" style={{ marginTop: 4, fontSize: 13, color: 'var(--olive)' }}>
                    <span>{t(lang,'book.loyalty')} — {tier.name} · −{tier.discount}%</span>
                    <span className="mono tabular">−{fmtMoney(discount)}</span>
                  </div>
                )}
                <div className="between mt-4" style={{ fontSize: 18, fontWeight: 600 }}>
                  <span>{t(lang,'book.total')}</span>
                  <span className="mono tabular">{fmtMoney(total)}</span>
                </div>
                <div className="sub mt-2" style={{ fontSize: 11 }}>{t(lang,'book.finalNote')}</div>
              </>
            )}
          </div>

          <div className="card" style={{ marginTop: 16 }}>
            <div className="row" style={{ gap: 10, alignItems: 'flex-start' }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: 'var(--olive-soft)', color: 'var(--olive)', display: 'grid', placeItems: 'center', flex: 'none' }}>
                <Icon name="pin" size={16}/>
              </div>
              <div>
                <div className="strong" style={{ fontSize: 13 }}>Taller Rueda · Málaga</div>
                <div className="sub" style={{ fontSize: 12 }}>Calle de los Naranjos 14 · 29009</div>
                <div className="sub mono" style={{ fontSize: 11, marginTop: 4 }}>Mon–Sat · 09:00 – 18:00</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, icon }) {
  return (
    <div className="row" style={{ gap: 14, alignItems: 'flex-start' }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--surface-2)', color: 'var(--ink-2)', display: 'grid', placeItems: 'center', flex: 'none' }}>
        <Icon name={icon} size={16}/>
      </div>
      <div style={{ flex: 1 }}>
        <div className="sub mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '.1em' }}>{label}</div>
        <div style={{ marginTop: 2 }}>{value}</div>
      </div>
    </div>
  );
}

Object.assign(window, { BookingView });
