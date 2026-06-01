
/* global window */
// --- Rueda app state & seed data ---

const LS_KEY = 'rueda_state_v1';

const SERVICES = [
  { id: 'alloy-refurb',  category: 'Alloy Restoration', title: 'Full Alloy Refurbishment',  subtitle: 'Turnkey — strip, repair, paint, lacquer',              desc: 'Complete restoration: chemical strip, kerb-rash repair, primer, base coat, two-layer clear lacquer. 24h cure.', price: 95,  unit: 'per wheel', duration: 180, featured: true, tag: 'Alloy · Turnkey'    },
  { id: 'diamond-cut',   category: 'Alloy Restoration', title: 'Diamond Cut Finish',         subtitle: 'CNC-lathe precision resurface',                         desc: 'Machined mirror-cut face on two-tone alloys. Checked for TIR, lacquered to OEM spec.',                          price: 120, unit: 'per wheel', duration: 150,               tag: 'Alloy · Premium'    },
  { id: 'kerb-repair',   category: 'Alloy Restoration', title: 'Kerb Damage Repair',         subtitle: 'Single-point rash & scuff fix',                         desc: 'Spot repair for curb rash: fill, sand, colour-match, blend. Best for localised damage.',                        price: 45,  unit: 'per wheel', duration: 75,                tag: 'Alloy · Repair'     },
  { id: 'custom-colour', category: 'Alloy Restoration', title: 'Custom Colour & Finish',     subtitle: 'Bespoke paint, satin, matte or metallic',               desc: 'Choose from 400+ RAL and custom pearl finishes. Includes colour sample, two-stage paint and ceramic top-coat.', price: 140, unit: 'per wheel', duration: 240,               tag: 'Alloy · Custom'     },
  { id: 'straighten',    category: 'Alloy Restoration', title: 'Wheel Straightening',        subtitle: 'Hydraulic bend & buckle correction',                    desc: 'For alloys bent by potholes. Runout measured, corrected on 30-ton hydraulic press, re-balanced.',               price: 70,  unit: 'per wheel', duration: 90,                tag: 'Alloy · Structural' },
  { id: 'tire-change',   category: 'Tire Service',      title: 'Tire Change & Balance',      subtitle: 'Seasonal swap, 4 wheels',                               desc: 'Dismount, mount, high-speed balancing, valve replacement, torque-to-spec. All sizes to 22".',                   price: 60,  unit: 'set of 4',  duration: 45,                tag: 'Tires'              },
  { id: 'puncture',      category: 'Tire Service',      title: 'Puncture Repair',            subtitle: 'Internal patch & plug',                                 desc: 'Internal mushroom patch repair (not a rope plug). Only on tread, within legal repair zone.',                    price: 18,  unit: 'per tire',  duration: 30,                tag: 'Tires'              },
  { id: 'alignment',     category: 'Tire Service',      title: '4-Wheel Alignment',          subtitle: 'Laser-guided geometry',                                 desc: 'Hunter HawkEye camera alignment. Camber, caster, toe to manufacturer spec with printout.',                       price: 55,  unit: 'per vehicle', duration: 60,              tag: 'Tires'              },
  { id: 'nitrogen',      category: 'Tire Service',      title: 'Nitrogen Inflation',         subtitle: 'N₂ pressure stability',                                 desc: 'Full purge & refill with 95%+ nitrogen. Reduces pressure drift from temperature changes.',                       price: 12,  unit: 'set of 4',  duration: 15,                tag: 'Tires'              },
  { id: 'ceramic',       category: 'Alloy Restoration', title: 'Ceramic Wheel Coating',      subtitle: '9H hardness, 3-year warranty',                          desc: 'Hydrophobic ceramic coating over fresh lacquer. Protects against brake dust and road salt.',                     price: 60,  unit: 'per wheel', duration: 60,                tag: 'Alloy · Protection' },
];

const TIERS = [
  { name: 'Aceituna', minSpend: 0,    discount: 0,   perks: ['Free nitrogen top-up', 'SMS appointment reminders'] },
  { name: 'Naranja',  minSpend: 250,  discount: 5,   perks: ['5% off all services', 'Priority weekday slots', 'Free kerb inspection'] },
  { name: 'Azahar',   minSpend: 750,  discount: 10,  perks: ['10% off all services', 'Courtesy EV shuttle (5km)', '1 free puncture repair / yr'] },
  { name: 'Albero',   minSpend: 1800, discount: 15,  perks: ['15% off all services', '24h emergency slot guarantee', 'Annual ceramic re-coat (1 wheel)', 'Named technician'] },
];

function todayStr() {
  const d = new Date(); d.setHours(0,0,0,0);
  return d.toISOString().slice(0,10);
}
function daysFromNow(n) {
  const d = new Date(); d.setHours(10,0,0,0); d.setDate(d.getDate()+n);
  return d.toISOString().slice(0,10);
}

const DEFAULT_STATE = {
  lang: 'en',
  theme: 'light',
  route: 'dashboard',
  user: {
    name: 'Lucía Moreno',
    email: 'lucia.moreno@example.es',
    phone: '+34 655 042 118',
    joined: '2023-04-11',
  },
  vehicles: [
    { id: 'v1', plate: '4821-LXK', make: 'Audi', model: 'A4 Avant', year: 2021, wheelSize: '18"', primary: true },
    { id: 'v2', plate: '7014-BNR', make: 'SEAT', model: 'León FR',   year: 2019, wheelSize: '17"', primary: false },
  ],
  bookings: [
    { id: 'b201', date: daysFromNow(3),  time: '10:30', serviceIds: ['alloy-refurb'],           vehicleId: 'v1', status: 'confirmed', note: 'All 4 wheels. Colour match OEM silver.' },
    { id: 'b202', date: daysFromNow(12), time: '15:00', serviceIds: ['tire-change', 'alignment'], vehicleId: 'v2', status: 'confirmed', note: '' },
  ],
  history: [
    { id: 'h101', date: '2026-03-14', serviceIds: ['kerb-repair'],             vehicleId: 'v1', total:  42.75, tech: 'Andrés R.', rating: 5 },
    { id: 'h100', date: '2026-02-02', serviceIds: ['tire-change', 'nitrogen'],  vehicleId: 'v1', total:  68.40, tech: 'Marta G.',  rating: 5 },
    { id: 'h099', date: '2025-11-19', serviceIds: ['diamond-cut'],             vehicleId: 'v1', total: 456.00, tech: 'Javier L.', rating: 5 },
    { id: 'h098', date: '2025-10-04', serviceIds: ['alignment'],               vehicleId: 'v2', total:  52.25, tech: 'Andrés R.', rating: 4 },
    { id: 'h097', date: '2025-08-22', serviceIds: ['puncture'],                vehicleId: 'v2', total:  17.10, tech: 'Marta G.',  rating: 5 },
    { id: 'h096', date: '2025-05-30', serviceIds: ['ceramic'],                 vehicleId: 'v1', total: 228.00, tech: 'Javier L.', rating: 5 },
    { id: 'h095', date: '2025-04-17', serviceIds: ['tire-change'],             vehicleId: 'v1', total:  57.00, tech: 'Andrés R.', rating: 4 },
    { id: 'h094', date: '2024-12-11', serviceIds: ['alloy-refurb'],            vehicleId: 'v2', total: 361.00, tech: 'Javier L.', rating: 5 },
    { id: 'h093', date: '2024-10-06', serviceIds: ['alignment', 'nitrogen'],   vehicleId: 'v1', total:  63.65, tech: 'Marta G.',  rating: 5 },
  ],
  toasts: [],
};

const ALL_SLOTS = (() => {
  const out = [];
  for (let h = 9; h < 18; h++) {
    out.push(`${String(h).padStart(2,'0')}:00`);
    out.push(`${String(h).padStart(2,'0')}:30`);
  }
  return out;
})();

function takenSlotsForDate(dateStr, bookings) {
  const booked = bookings.filter(b => b.date === dateStr).map(b => b.time);
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) hash = (hash * 31 + dateStr.charCodeAt(i)) >>> 0;
  const pool = [...ALL_SLOTS];
  const taken = new Set(booked);
  const d = new Date(dateStr);
  if (d.getDay() === 0) return { taken: new Set(ALL_SLOTS), closed: true };
  const nTaken = 4 + (hash % 6);
  for (let i = 0; i < nTaken; i++) taken.add(pool[(hash + i * 7) % pool.length]);
  return { taken, closed: false };
}

function loadState() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return { ...DEFAULT_STATE };
    const saved = JSON.parse(raw);
    return { ...DEFAULT_STATE, ...saved, toasts: [] };
  } catch {
    return { ...DEFAULT_STATE };
  }
}
function saveState(s) {
  try {
    const { toasts, ...rest } = s;
    localStorage.setItem(LS_KEY, JSON.stringify(rest));
  } catch {}
}

function totalSpend(history) { return history.reduce((sum, h) => sum + h.total, 0); }
function currentTier(spend) {
  let t = TIERS[0];
  for (const x of TIERS) if (spend >= x.minSpend) t = x;
  return t;
}
function nextTier(spend) { return TIERS.find(t => spend < t.minSpend) || null; }
function serviceById(id) { return SERVICES.find(s => s.id === id); }
function vehicleById(state, id) { return state.vehicles.find(v => v.id === id); }

function fmtDate(iso, opts = {}, lang = 'en') {
  const locale = (typeof LANG_LOCALE !== 'undefined' ? LANG_LOCALE[lang] : null) || 'en-GB';
  const d = new Date(iso + (iso.includes('T') ? '' : 'T00:00'));
  const { weekday = true, year = false } = opts;
  const parts = [];
  if (weekday) parts.push(d.toLocaleDateString(locale, { weekday: 'short' }));
  parts.push(d.toLocaleDateString(locale, { day: '2-digit', month: 'short' }));
  if (year) parts.push(d.getFullYear());
  return parts.join(' ');
}
function fmtMoney(n) { return '€' + n.toFixed(2); }

Object.assign(window, {
  SERVICES, TIERS, ALL_SLOTS,
  takenSlotsForDate, loadState, saveState,
  totalSpend, currentTier, nextTier,
  serviceById, vehicleById, fmtDate, fmtMoney,
  todayStr, daysFromNow,
});
