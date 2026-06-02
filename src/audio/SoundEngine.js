// AudioContext is created lazily on the first play() call.
// This guarantees it is always created inside a user-gesture handler,
// which is required by iOS Safari — creating it at module/scene load time
// leaves the context permanently suspended on iPhone.
export default class SoundEngine {
  constructor() {
    this.enabled        = !!(window.AudioContext || window.webkitAudioContext);
    this.ctx            = null;
    this.master         = null;
    this.ambientStarted = false;
  }

  // Idempotent — safe to call multiple times; only creates ctx once.
  _boot() {
    if (this.ctx) return true;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      this.ctx  = new Ctx();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.40;
      this.master.connect(this.ctx.destination);
      return true;
    } catch (e) {
      this.enabled = false;
      return false;
    }
  }

  // Must be called from a pointerdown / touchstart handler.
  play(type) {
    if (!this.enabled || !this._boot()) return;

    if (this.ctx.state === 'suspended') {
      // resume() is async — play only after it resolves so currentTime is valid.
      this.ctx.resume().then(() => this._dispatch(type));
    } else {
      this._dispatch(type);
    }
  }

  startAmbient() {
    if (this.ambientStarted || !this.enabled || !this._boot()) return;
    this.ambientStarted = true;

    const go = () => {
      const rate = this.ctx.sampleRate;
      const buf  = this.ctx.createBuffer(1, rate * 3, rate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      const src  = this.ctx.createBufferSource();
      src.buffer = buf; src.loop = true;
      const f    = this.ctx.createBiquadFilter();
      f.type = 'lowpass'; f.frequency.value = 155;
      const g    = this.ctx.createGain(); g.gain.value = 0.032;
      src.connect(f); f.connect(g); g.connect(this.master);
      src.start();
    };

    if (this.ctx.state === 'suspended') this.ctx.resume().then(go);
    else go();
  }

  // ── sound dispatch ─────────────────────────────────────────────────────────

  _dispatch(type) {
    switch (type) {
      case 'moo':    return this._moo();
      case 'quack':  return this._quack();
      case 'splash': return this._splash();
      case 'ripple': return this._ripple();
      case 'click':  return this._click();
      case 'nom':    return this._nom();
      case 'happy':  return this._happy();
      case 'plop':   return this._plop();
    }
  }

  // ── sound primitives ───────────────────────────────────────────────────────

  _moo() {
    const t = this.ctx.currentTime;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.26, t + 0.06);
    g.gain.linearRampToValueAtTime(0.18, t + 0.45);
    g.gain.linearRampToValueAtTime(0, t + 0.75);
    g.connect(this.master);
    const filt = this.ctx.createBiquadFilter();
    filt.type = 'lowpass'; filt.frequency.value = 620; filt.connect(g);
    const o = this.ctx.createOscillator(); o.type = 'sawtooth';
    o.frequency.setValueAtTime(148, t);
    o.frequency.exponentialRampToValueAtTime(118, t + 0.28);
    o.frequency.exponentialRampToValueAtTime(138, t + 0.58);
    o.frequency.exponentialRampToValueAtTime(122, t + 0.75);
    o.connect(filt); o.start(t); o.stop(t + 0.75);
  }

  _quack() {
    const t = this.ctx.currentTime;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.17, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.24);
    g.connect(this.master);
    const filt = this.ctx.createBiquadFilter();
    filt.type = 'bandpass'; filt.frequency.value = 900; filt.Q.value = 2.2;
    filt.connect(g);
    const o = this.ctx.createOscillator(); o.type = 'square';
    o.frequency.setValueAtTime(760, t);
    o.frequency.exponentialRampToValueAtTime(490, t + 0.09);
    o.frequency.exponentialRampToValueAtTime(660, t + 0.16);
    o.frequency.exponentialRampToValueAtTime(510, t + 0.24);
    o.connect(filt); o.start(t); o.stop(t + 0.24);
  }

  _noise(dur, freq, type, gain) {
    const t    = this.ctx.currentTime;
    const size = Math.floor(this.ctx.sampleRate * dur);
    const buf  = this.ctx.createBuffer(1, size, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < size; i++) data[i] = Math.random() * 2 - 1;
    const src  = this.ctx.createBufferSource(); src.buffer = buf;
    const filt = this.ctx.createBiquadFilter(); filt.type = type; filt.frequency.value = freq;
    const g    = this.ctx.createGain();
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    src.connect(filt); filt.connect(g); g.connect(this.master); src.start(t);
  }

  _osc(type, freq, startG, endG, dur) {
    const t = this.ctx.currentTime;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(startG, t);
    g.gain.linearRampToValueAtTime(endG, t + dur);
    g.connect(this.master);
    const o = this.ctx.createOscillator(); o.type = type; o.frequency.value = freq;
    o.connect(g); o.start(t); o.stop(t + dur);
  }

  _splash() { this._noise(0.32, 1800, 'bandpass', 0.38); this._osc('sine', 80, 0.12, 0.001, 0.18); }
  _plop()   { this._noise(0.12, 2400, 'bandpass', 0.22); this._osc('sine', 120, 0.08, 0.001, 0.10); }
  _click()  { this._osc('sine', 370, 0.08, 0.001, 0.06); }
  _nom()    { this._osc('sine', 265, 0.055, 0.001, 0.14); }

  _ripple() {
    const t = this.ctx.currentTime;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.05, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
    g.connect(this.master);
    const o = this.ctx.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(900, t); o.frequency.exponentialRampToValueAtTime(280, t + 0.18);
    o.connect(g); o.start(t); o.stop(t + 0.18);
  }

  _happy() {
    [[524, 0], [660, 0.13], [784, 0.26]].forEach(([freq, delay]) => {
      const t = this.ctx.currentTime + delay;
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(0.10, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
      g.connect(this.master);
      const o = this.ctx.createOscillator(); o.type = 'triangle'; o.frequency.value = freq;
      o.connect(g); o.start(t); o.stop(t + 0.16);
    });
  }
}
