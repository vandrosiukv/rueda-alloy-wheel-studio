
/* global React, Icon, Button, t */

function LoyaltyView({ state, lang }) {
  const spend = totalSpend(state.history);
  const tier = currentTier(spend);
  const next = nextTier(spend);
  const progress = next ? Math.min(1, (spend - tier.minSpend) / (next.minSpend - tier.minSpend)) : 1;
  const pointsEarned = Math.floor(spend);
  const pointsRedeemable = Math.floor(pointsEarned / 10);

  return (
    <div className="view">
      <div className="mb-4">
        <div className="sub mono" style={{ letterSpacing: '.1em', textTransform: 'uppercase', fontSize: 11 }}>{t(lang,'loy.program')}</div>
        <h1 style={{ fontSize: 28, margin: '6px 0 0', fontWeight: 600, letterSpacing: '-.015em' }}>{t(lang,'loy.clubTitle')}</h1>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1.2fr 1fr', gap: 22 }}>
        <div className="loy-card">
          <div className="row between" style={{ alignItems: 'flex-start' }}>
            <div>
              <div className="mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '.15em', opacity: .8 }}>{t(lang,'loy.memberTier')}</div>
              <div className="loy-tier-name mt-2">{tier.name}</div>
              <div className="mono mt-2" style={{ fontSize: 12, opacity: .85 }}>{state.user.name.toUpperCase()} · {t(lang,'loy.since')} {new Date(state.user.joined).getFullYear()}</div>
            </div>
            <div className="wheel" style={{ '--wsize': '80px', border: '3px solid #fff5e3', filter: 'brightness(1.3) saturate(.7)' }}/>
          </div>
          <div className="mt-4" style={{ marginTop: 30 }}>
            <div className="row between" style={{ fontSize: 12, opacity: .85 }}>
              <span className="mono">{fmtMoney(spend)} {t(lang,'loy.lifetime')}</span>
              {next ? <span className="mono">→ {next.name} at {fmtMoney(next.minSpend)}</span> : <span className="mono">{t(lang,'loy.topTier')}</span>}
            </div>
            <div className="loy-bar">
              <div className="loy-bar-fill" style={{ width: `${Math.round(progress * 100)}%` }}/>
            </div>
            <div className="mt-2" style={{ fontSize: 13, opacity: .9 }}>
              {next
                ? `${fmtMoney(next.minSpend - spend)} ${t(lang,'loy.toUnlock')} ${next.discount}% ${t(lang,'loy.offEverything')}`
                : `${t(lang,'loy.maxDiscount')} ${tier.discount}% ${t(lang,'loy.discount')}`}
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card card-lg">
            <div className="card-title">{t(lang,'loy.points')}</div>
            <div className="row" style={{ gap: 24, padding: '8px 0' }}>
              <div>
                <div className="sub mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '.1em' }}>{t(lang,'loy.earned')}</div>
                <div className="mono tabular" style={{ fontSize: 28, fontWeight: 600 }}>{pointsEarned}</div>
              </div>
              <div style={{ width: 1, background: 'var(--border)', alignSelf: 'stretch' }}/>
              <div>
                <div className="sub mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '.1em' }}>{t(lang,'loy.redeemable')}</div>
                <div className="mono tabular" style={{ fontSize: 28, fontWeight: 600, color: 'var(--primary)' }}>€{pointsRedeemable}</div>
              </div>
            </div>
            <div className="sub" style={{ fontSize: 12 }}>{t(lang,'loy.pointsHelp')}</div>
            <Button kind="primary" icon="spark" style={{ marginTop: 14 }}>{t(lang,'loy.redeem')}</Button>
          </div>

          <div className="card card-lg">
            <div className="card-title">{t(lang,'loy.referrals')}</div>
            <div className="sub mb-4">{t(lang,'loy.refHelp')} <strong style={{ color: 'var(--ink)' }}>€20 {t(lang,'loy.credit')}</strong>.</div>
            <div className="row gap-8">
              <input className="input mono" value="RUEDA-LUCIA-2026" readOnly style={{ flex: 1, fontSize: 13 }}/>
              <Button kind="primary">{t(lang,'c.copy')}</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4" style={{ marginTop: 28 }}>
        <div className="card-title mb-4">
          {t(lang,'loy.allTiers')}
          <span className="eyebrow">{t(lang,'loy.tiersSub')}</span>
        </div>
        <div className="tiers">
          {TIERS.map((tr, i) => {
            const isCurrent = tr.name === tier.name;
            return (
              <div key={tr.name} className={`tier ${isCurrent ? 'tier-current' : ''}`}>
                <div className="tier-name">
                  <span style={{
                    width: 22, height: 22, borderRadius: '50%',
                    background: ['#a7b05b','#c96826','#d69314','#1f3a5f'][i],
                    display: 'inline-block', flex: 'none'
                  }}/>
                  {tr.name}
                  {isCurrent && <span className="pill pill-primary">{t(lang,'loy.current')}</span>}
                </div>
                <div className="tier-thresh mt-2">
                  {tr.minSpend === 0 ? t(lang,'loy.welcomeLevel') : `${t(lang,'loy.fromLifetime')} ${fmtMoney(tr.minSpend)} ${t(lang,'loy.lifetime')}`} · {tr.discount}% {t(lang,'c.off')}
                </div>
                <ul className="tier-perks">
                  {tr.perks.map((p, j) => <li key={j}>{p}</li>)}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { LoyaltyView });
