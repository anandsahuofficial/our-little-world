const SAVE_KEY = 'our-little-world-save';

const defaultState = {
  player: { x: 960, y: 350 },
  moo: {
    hunger: 100,
    happiness: 100,
    energy: 100,
    lastVisit: null,
    stage: 0,        // 0: baby, 1: young, 2: adult
    totalDaysCared: 0,
  },
  discoveredSecrets: [],
  firstVisit: true,
};

export function loadState() {
  try {
    const saved = localStorage.getItem(SAVE_KEY);
    if (!saved) return { ...defaultState, moo: { ...defaultState.moo } };
    return { ...defaultState, ...JSON.parse(saved) };
  } catch {
    return { ...defaultState, moo: { ...defaultState.moo } };
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch {
    // storage full or unavailable
  }
}

// Called on every visit — decays stats based on real elapsed time, then stamps now
export function applyTimedDecay(state) {
  const now = Date.now();
  const last = state.moo.lastVisit;

  if (last) {
    const hours = Math.min((now - last) / 3_600_000, 24); // cap at 24 h of decay
    const clamp = v => Math.min(100, Math.max(0, v));
    state.moo.hunger    = clamp(state.moo.hunger    - hours * 10);
    state.moo.happiness = clamp(state.moo.happiness - hours * 4);
    state.moo.energy    = clamp(state.moo.energy    - hours * 2);
  }

  state.moo.lastVisit = now;
  return state;
}
