
/* global React, Icon, Button, Modal, t */
const { useState: useStateGar } = React;

function GarageView({ state, setState, lang }) {
  const [editing, setEditing] = useStateGar(null);
  const [form, setForm] = useStateGar(null);

  const openEdit = (v) => {
    setEditing(v || {});
    setForm(v ? { ...v } : { plate: '', make: '', model: '', year: new Date().getFullYear(), wheelSize: '17"', primary: false });
  };
  const close = () => { setEditing(null); setForm(null); };

  const save = () => {
    setState(s => {
      let vehicles = s.vehicles;
      if (editing.id) {
        vehicles = vehicles.map(v => v.id === editing.id ? { ...v, ...form } : v);
      } else {
        vehicles = [...vehicles, { ...form, id: 'v' + Math.random().toString(36).slice(2, 7) }];
      }
      if (form.primary) vehicles = vehicles.map(v => ({ ...v, primary: v.id === (editing.id || vehicles[vehicles.length-1].id) }));
      return { ...s, vehicles, toasts: [...s.toasts, { id: Date.now(), msg: editing.id ? t(lang,'gar.vehicleUpdated') : t(lang,'gar.vehicleAdded'), icon: 'check' }] };
    });
    close();
  };
  const remove = () => {
    setState(s => ({
      ...s,
      vehicles: s.vehicles.filter(v => v.id !== editing.id),
      toasts: [...s.toasts, { id: Date.now(), msg: t(lang,'gar.vehicleRemoved'), icon: 'trash' }],
    }));
    close();
  };

  const locale = typeof LANG_LOCALE !== 'undefined' ? LANG_LOCALE[lang] : 'en-GB';

  return (
    <div className="view">
      <div className="between mb-4">
        <div>
          <div className="sub mono" style={{ letterSpacing: '.1em', textTransform: 'uppercase', fontSize: 11 }}>{t(lang,'gar.myAccount')}</div>
          <h1 style={{ fontSize: 28, margin: '6px 0 0', fontWeight: 600, letterSpacing: '-.015em' }}>{t(lang,'gar.profileGarage')}</h1>
        </div>
        <Button kind="primary" icon="plus" onClick={() => openEdit(null)}>{t(lang,'gar.addVehicle')}</Button>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '360px 1fr', gap: 22 }}>
        <div className="card card-lg">
          <div className="card-title">{t(lang,'gar.personalDetails')}</div>
          <div className="row" style={{ gap: 14, marginBottom: 16 }}>
            <div className="avatar" style={{ width: 56, height: 56, fontSize: 18 }}>{state.user.name.split(' ').map(p => p[0]).join('')}</div>
            <div>
              <div className="strong" style={{ fontSize: 16 }}>{state.user.name}</div>
              <div className="sub mono" style={{ fontSize: 11 }}>{t(lang,'gar.memberSince')} {new Date(state.user.joined).toLocaleDateString(locale, { month: 'long', year: 'numeric' })}</div>
            </div>
          </div>
          <div className="col" style={{ gap: 10 }}>
            <ProfileRow icon="mail"  label={t(lang,'gar.email')} value={state.user.email}/>
            <ProfileRow icon="phone" label={t(lang,'gar.phone')} value={state.user.phone}/>
            <ProfileRow icon="medal" label={t(lang,'gar.tier')}  value={<span className="pill pill-primary">{currentTier(totalSpend(state.history)).name}</span>}/>
          </div>
          <Button kind="ghost" icon="edit" style={{ marginTop: 14 }}>{t(lang,'gar.editProfile')}</Button>
        </div>

        <div className="card card-lg">
          <div className="card-title">{t(lang,'gar.vehicles')} <span className="eyebrow">{state.vehicles.length} {t(lang,'gar.onFile')}</span></div>
          <div className="col">
            {state.vehicles.map(v => (
              <div key={v.id} className="booking">
                <div className="wheel" style={{ '--wsize': '56px' }}/>
                <div className="booking-main">
                  <div className="booking-title">
                    {v.make} {v.model} <span className="sub" style={{ fontWeight: 400 }}>· {v.year}</span>
                    {v.primary && <span className="pill pill-primary" style={{ marginLeft: 8 }}>{t(lang,'c.primary')}</span>}
                  </div>
                  <div className="booking-meta">
                    <span className="mono">{v.plate}</span>
                    <span>{v.wheelSize} {t(lang,'c.wheels')}</span>
                  </div>
                </div>
                <Button size="sm" icon="edit" onClick={() => openEdit(v)}>{t(lang,'c.edit')}</Button>
              </div>
            ))}
            {state.vehicles.length === 0 && <div className="sub">{t(lang,'gar.noVehicles')}</div>}
          </div>
        </div>
      </div>

      {form && (
        <Modal open={true} onClose={close}
          title={editing.id ? t(lang,'gar.editVehicle') : t(lang,'gar.addVehicleTitle')}
          subtitle={t(lang,'gar.vehicleSub')}
          footer={<>
            {editing.id && <Button kind="danger" icon="trash" onClick={remove} style={{ marginRight: 'auto' }}>{t(lang,'c.remove')}</Button>}
            <Button kind="ghost" onClick={close}>{t(lang,'c.cancel')}</Button>
            <Button kind="primary" icon="check" onClick={save} disabled={!form.plate || !form.make}>{t(lang,'c.save')}</Button>
          </>}>
          <div className="grid grid-2" style={{ gap: 12 }}>
            <div className="field"><label>{t(lang,'gar.plate')}</label><input className="input mono" value={form.plate} onChange={e => setForm({ ...form, plate: e.target.value.toUpperCase() })}/></div>
            <div className="field"><label>{t(lang,'gar.year')}</label><input className="input mono" type="number" value={form.year} onChange={e => setForm({ ...form, year: +e.target.value })}/></div>
            <div className="field"><label>{t(lang,'gar.make')}</label><input className="input" value={form.make} onChange={e => setForm({ ...form, make: e.target.value })}/></div>
            <div className="field"><label>{t(lang,'gar.model')}</label><input className="input" value={form.model} onChange={e => setForm({ ...form, model: e.target.value })}/></div>
            <div className="field"><label>{t(lang,'gar.wheelSize')}</label>
              <select className="select" value={form.wheelSize} onChange={e => setForm({ ...form, wheelSize: e.target.value })}>
                {['15"','16"','17"','18"','19"','20"','21"','22"'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="field"><label>{t(lang,'c.primary')}</label>
              <label className="row gap-8" style={{ paddingTop: 8 }}>
                <input type="checkbox" checked={!!form.primary} onChange={e => setForm({ ...form, primary: e.target.checked })}/>
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
    <div className="row" style={{ gap: 12, alignItems: 'flex-start' }}>
      <div style={{ width: 32, height: 32, borderRadius: 10, background: 'var(--surface-2)', color: 'var(--ink-2)', display: 'grid', placeItems: 'center', flex: 'none' }}>
        <Icon name={icon} size={15}/>
      </div>
      <div>
        <div className="sub mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '.1em' }}>{label}</div>
        <div>{value}</div>
      </div>
    </div>
  );
}

Object.assign(window, { GarageView });
