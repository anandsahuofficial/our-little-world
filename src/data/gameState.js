const SAVE_KEY = 'our-little-world-save';

const defaultState = {
  player: { x: 960, y: 350 },
  moo: {
    hunger:    100,
    happiness: 100,
    energy:    100,
    lastVisit: null,
    lastFed:   null,   // timestamp of last successful feeding
    dead:      false,  // dies if not fed within 4 hours
    stage:     0,      // 0: baby
    totalDaysCared: 0,
  },
  discoveredSecrets: [],
  firstVisit: true,
};

export function loadState() {
  try {
    const saved = localStorage.getItem(SAVE_KEY);
    if (!saved) return { ...defaultState, moo: { ...defaultState.moo } };
    const parsed = JSON.parse(saved);
    return { ...defaultState, ...parsed, moo: { ...defaultState.moo, ...parsed.moo } };
  } catch {
    return { ...defaultState, moo: { ...defaultState.moo } };
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch { /* storage full */ }
}

// Called on every visit.
// Applies stat decay, then checks the 4-hour death condition.
export function applyTimedDecay(state) {
  const now = Date.now();
  const m   = state.moo;

  // Start the feeding clock on first-ever visit
  if (!m.lastFed) m.lastFed = now;

  // ── 4-HOUR DEATH CHECK ──────────────────────────────────────────────────
  if (!m.dead) {
    const hoursSinceFed = (now - m.lastFed) / 3_600_000;
    if (hoursSinceFed >= 4) {
      m.dead    = true;
      m.hunger  = 0;
    }
  }

  // ── STAT DECAY (proportional to time away, capped at 24 h) ──────────────
  if (m.lastVisit) {
    const hours = Math.min((now - m.lastVisit) / 3_600_000, 24);
    const clamp = v => Math.min(100, Math.max(0, v));
    m.hunger    = clamp(m.hunger    - hours * 10);
    m.happiness = clamp(m.happiness - hours * 4);
    m.energy    = clamp(m.energy    - hours * 2);
  }

  m.lastVisit = now;
  return state;
}

// Returns milliseconds remaining before death (0 if already dead or overdue)
export function msUntilDeath(mooState) {
  if (!mooState.lastFed || mooState.dead) return 0;
  return Math.max(0, mooState.lastFed + 4 * 3_600_000 - Date.now());
}
