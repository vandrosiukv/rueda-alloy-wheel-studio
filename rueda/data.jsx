/* global window */
const LS = 'rueda_lite_v1';

const SERVICES = [
  { id:'s1', cat:'Alloy Restoration', tk:'svc.diamondCut', tagk:'svc.tag.alloy',
    price:280, dur:240, unitk:'svc.unit.4wheels', featured:true },
  { id:'s2', cat:'Alloy Restoration', tk:'svc.fullRefinish', tagk:'svc.tag.alloy',
    price:340, dur:300, unitk:'svc.unit.4wheels', featured:true },
  { id:'s3', cat:'Alloy Restoration', tk:'svc.curbRepair', tagk:'svc.tag.alloy',
    price:55, dur:75, unitk:'svc.unit.perWheel' },
  { id:'s4', cat:'Alloy Restoration', tk:'svc.polish', tagk:'svc.tag.alloy',
    price:140, dur:180, unitk:'svc.unit.4wheels' },
  { id:'s5', cat:'Tire Service', tk:'svc.tireMount', tagk:'svc.tag.tire',
    price:60, dur:60, unitk:'svc.unit.set' },
  { id:'s6', cat:'Tire Service', tk:'svc.tireRepair', tagk:'svc.tag.tire',
    price:18, dur:30, unitk:'svc.unit.repair' },
  { id:'s7', cat:'Wheel Service', tk:'svc.alignment', tagk:'svc.tag.tire',
    price:75, dur:75, unitk:'svc.unit.full' },
  { id:'s8', cat:'Tire Service', tk:'svc.seasonal', tagk:'svc.tag.tire',
    price:48, dur:45, unitk:'svc.unit.swap' },
];

const TIERS = [
  { name:'Olivo',        min:0,    pct:0,  color:'#a7b05b' },
  { name:'Barro',        min:300,  pct:5,  color:'#c96826' },
  { name:'Azafrán',      min:900,  pct:10, color:'#d69314' },
  { name:'Mediterráneo', min:1800, pct:15, color:'#1f3a5f' },
];

const ALL_SLOTS = ['09:00','09:45','10:30','11:15','12:00','13:30','14:15','15:00','15:45','16:30','17:15'];

function svc(id) { return SERVICES.find(s => s.id === id); }
function tierFor(spend) {
  let t = TIERS[0]; for (const x of TIERS) if (spend >= x.min) t = x; return t;
}
function nextTier(spend) {
  return TIERS.find(t => t.min > spend) || null;
}

function todayIso() { return new Date().toISOString().slice(0, 10); }
function isoDate(d) { return d.toISOString().slice(0, 10); }
function monthGrid(y, m) {
  const first = new Date(y, m, 1);
  const start = new Date(y, m, 1 - ((first.getDay() + 6) % 7)); // Mon-first
  const cells = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(start); d.setDate(start.getDate() + i);
    cells.push({ date: d, day: d.getDate(), inMonth: d.getMonth() === m });
  }
  return cells;
}
function totalSpend(history) { return history.reduce((s, h) => s + h.total, 0); }

const SEED = {
  lang: 'en',
  theme: 'light',
  route: 'dashboard',
  user: {
    name: 'Lucía Moreno',
    email: 'lucia.moreno@email.es',
    phone: '+34 662 18 04 22',
    joined: '2023-03-12',
  },
  vehicles: [
    { id:'v1', plate:'1284 KFB', make:'Audi', model:'A4 Avant', year:2021, wheelSize:'18"', primary:true },
    { id:'v2', plate:'4076 LMR', make:'Volkswagen', model:'Golf GTI', year:2019, wheelSize:'19"' },
  ],
  bookings: [
    { id:'b1', date: addDays(3), time:'10:30', serviceIds:['s4'], vehicleId:'v1', note:'', status:'confirmed' },
    { id:'b2', date: addDays(11), time:'14:15', serviceIds:['s5','s7'], vehicleId:'v2', note:'', status:'confirmed' },
  ],
  history: [
    { id:'h1', date: addDays(-22), serviceIds:['s2'], vehicleId:'v1', tech:'Pablo Núñez',  rating:5, total:340 },
    { id:'h2', date: addDays(-58), serviceIds:['s5','s7'], vehicleId:'v1', tech:'Marta Ruiz', rating:5, total:135 },
    { id:'h3', date: addDays(-92), serviceIds:['s3'], vehicleId:'v2', tech:'Pablo Núñez',  rating:4, total:55 },
    { id:'h4', date: addDays(-148), serviceIds:['s1'], vehicleId:'v1', tech:'Marta Ruiz', rating:5, total:280 },
    { id:'h5', date: addDays(-200), serviceIds:['s8'], vehicleId:'v2', tech:'Iván López',  rating:5, total:48 },
    { id:'h6', date: addDays(-260), serviceIds:['s2','s7'], vehicleId:'v2', tech:'Marta Ruiz', rating:5, total:415 },
    { id:'h7', date: addDays(-330), serviceIds:['s4'], vehicleId:'v1', tech:'Pablo Núñez', rating:4, total:140 },
  ],
  toasts: [],
};

function addDays(n) {
  const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10);
}

function loadState() {
  try {
    const raw = localStorage.getItem(LS);
    if (!raw) return { ...SEED };
    return { ...SEED, ...JSON.parse(raw), toasts: [] };
  } catch { return { ...SEED }; }
}
function saveState(s) {
  const { toasts, ...rest } = s;
  try { localStorage.setItem(LS, JSON.stringify(rest)); } catch {}
}

function vehicleById(state, id) { return state.vehicles.find(v => v.id === id); }

function takenSlots(date, bookings) {
  const taken = new Set(bookings.filter(b => b.date === date).map(b => b.time));
  const dow = new Date(date).getDay();
  return { taken, closed: dow === 0 };
}

Object.assign(window, {
  SERVICES, TIERS, ALL_SLOTS, svc, tierFor, nextTier,
  todayIso, isoDate, monthGrid, totalSpend,
  loadState, saveState, vehicleById, takenSlots,
});
