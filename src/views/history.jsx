
/* global React, Icon, Button, t */
const { useState: useStateHist, useMemo: useMemoHist } = React;

function HistoryView({ state, lang }) {
  const [filter, setFilter] = useStateHist('all');
  const [vehFilter, setVehFilter] = useStateHist('all');

  const items = useMemoHist(() => {
    return state.history.filter(h => {
      if (vehFilter !== 'all' && h.vehicleId !== vehFilter) return false;
      if (filter === 'alloy') return h.serviceIds.some(id => serviceById(id)?.category === 'Alloy Restoration');
      if (filter === 'tires') return h.serviceIds.some(id => serviceById(id)?.category === 'Tire Service');
      return true;
    });
  }, [state.history, filter, vehFilter]);

  const spend = items.reduce((s, h) => s + h.total, 0);
  const countAlloy = state.history.filter(h => h.serviceIds.some(id => serviceById(id)?.category === 'Alloy Restoration')).length;
  const countTires = state.history.filter(h => h.serviceIds.some(id => serviceById(id)?.category === 'Tire Service')).length;

  const locale = typeof LANG_LOCALE !== 'undefined' ? LANG_LOCALE[lang] : 'en-GB';

  const chartData = useMemoHist(() => {
    const months = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toISOString().slice(0, 7);
      const total = state.history
        .filter(h => h.date.startsWith(key))
        .reduce((s, h) => s + h.total, 0);
      months.push({ key, label: d.toLocaleDateString(locale, { month: 'short' }), total });
    }
    return months;
  }, [state.history, locale]);
  const maxVal = Math.max(...chartData.map(m => m.total), 1);

  return (
    <div className="view">
      <div className="mb-4">
        <div className="sub mono" style={{ letterSpacing: '.1em', textTransform: 'uppercase', fontSize: 11 }}>{t(lang,'page.history.title')}</div>
        <h1 style={{ fontSize: 28, margin: '6px 0 0', fontWeight: 600, letterSpacing: '-.015em' }}>{t(lang,'page.history.sub')}</h1>
      </div>

      <div className="grid grid-3 mb-4">
        <div className="kpi">
          <div className="kpi-label">{t(lang,'hist.totalSpend')}</div>
          <div className="kpi-value mono tabular">{fmtMoney(totalSpend(state.history))}</div>
          <div className="kpi-foot">{t(lang,'hist.across')} {state.history.length} {t(lang,'hist.visits')}</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">{t(lang,'hist.alloyWork')}</div>
          <div className="kpi-value mono tabular">{countAlloy}</div>
          <div className="kpi-foot">{t(lang,'hist.restorationRepairPaint')}</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">{t(lang,'hist.tireService')}</div>
          <div className="kpi-value mono tabular">{countTires}</div>
          <div className="kpi-foot">{t(lang,'hist.changesAlignmentRepair')}</div>
        </div>
      </div>

      <div className="card card-lg mb-4">
        <div className="card-title">{t(lang,'hist.monthly')} <span className="eyebrow">€</span></div>
        <div className="row" style={{ alignItems: 'flex-end', gap: 8, height: 140 }}>
          {chartData.map((m, i) => {
            const h = Math.round((m.total / maxVal) * 120) + (m.total > 0 ? 8 : 2);
            return (
              <div key={m.key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', width: '100%' }}>
                  <div style={{
                    width: '100%', height: h,
                    background: m.total > 0 ? 'linear-gradient(180deg, var(--primary), color-mix(in oklch, var(--primary) 70%, var(--accent)))' : 'var(--surface-2)',
                    borderRadius: '6px 6px 2px 2px',
                    transition: 'height .4s cubic-bezier(.2,.8,.2,1)',
                  }} title={fmtMoney(m.total)}/>
                </div>
                <div className="mono sub" style={{ fontSize: 10 }}>{m.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card card-lg">
        <div className="row between mb-4">
          <div className="card-title mb-0">{t(lang,'hist.allVisits')} <span className="eyebrow">{items.length} {t(lang,'hist.results')} · {fmtMoney(spend)}</span></div>
          <div className="row gap-8">
            <div className="row gap-8" style={{ padding: 4, background: 'var(--surface-2)', borderRadius: 10 }}>
              {[['all','hist.filter.all'],['alloy','hist.filter.alloy'],['tires','hist.filter.tire']].map(([k,lk]) => (
                <button key={k}
                  onClick={() => setFilter(k)}
                  className="btn btn-sm"
                  style={{ background: filter === k ? 'var(--surface)' : 'transparent', border: 'none', color: filter === k ? 'var(--ink)' : 'var(--muted)' }}>
                  {t(lang,lk)}
                </button>
              ))}
            </div>
            <select className="select" value={vehFilter} onChange={e => setVehFilter(e.target.value)}>
              <option value="all">{t(lang,'hist.filter.allVeh')}</option>
              {state.vehicles.map(v => <option key={v.id} value={v.id}>{v.plate} · {v.make}</option>)}
            </select>
          </div>
        </div>
        <table className="tbl">
          <thead>
            <tr>
              <th>{t(lang,'tbl.date')}</th>
              <th>{t(lang,'tbl.work')}</th>
              <th>{t(lang,'tbl.vehicle')}</th>
              <th>{t(lang,'tbl.tech')}</th>
              <th>{t(lang,'tbl.rating')}</th>
              <th style={{ textAlign: 'right' }}>{t(lang,'tbl.total')}</th>
            </tr>
          </thead>
          <tbody>
            {items.map(h => {
              const v = vehicleById(state, h.vehicleId);
              return (
                <tr key={h.id}>
                  <td className="mono">{fmtDate(h.date, { year: true }, lang)}</td>
                  <td>
                    <div className="col" style={{ gap: 2 }}>
                      {h.serviceIds.map(id => {
                        const s = serviceById(id);
                        return <span key={id}>{s?.title} <span className="pill" style={{ marginLeft: 6 }}>{s?.category === 'Alloy Restoration' ? t(lang,'hist.alloyTag') : t(lang,'hist.tiresTag')}</span></span>;
                      })}
                    </div>
                  </td>
                  <td className="mono sub">{v?.plate}<br/><span style={{ fontSize: 11 }}>{v?.make} {v?.model}</span></td>
                  <td>{h.tech}</td>
                  <td>
                    {Array.from({length: 5}).map((_, i) => (
                      <Icon key={i} name="star" size={13} stroke={i < h.rating ? 2 : 1} style={{ color: i < h.rating ? 'var(--accent)' : 'var(--muted-2)' }}/>
                    ))}
                  </td>
                  <td className="mono tabular strong" style={{ textAlign: 'right' }}>{fmtMoney(h.total)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

Object.assign(window, { HistoryView });
