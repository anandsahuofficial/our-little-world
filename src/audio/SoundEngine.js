/**
 * SoundEngine — Web Audio API sound generator.
 *
 * iOS Safari (and Chrome) suspend AudioContext until a user gesture.
 * The correct pattern:
 *   1. Call unlock() once from a pointerdown/touchstart handler.
 *      This creates the ctx, resumes it, AND plays a 1-sample silent
 *      buffer — the silent buffer is what actually "proves" intent to
 *      iOS hardware and lets all future audio play freely.
 *   2. After unlock, play() dispatches sounds synchronously (no async,
 *      no promises) so they work from anywhere including the game loop.
 *
 * DO NOT create AudioContext in the constructor — doing so at module
 * load / scene-create time leaves the context suspended permanently
 * on iPhone because it is outside any user gesture.
 */
export default class SoundEngine {
  constructor() {
    this.enabled  = !!(window.AudioContext || window.webkitAudioContext);
    this.ctx      = null;
    this.master   = null;
    this.unlocked = false;
  }

  // ── public API ─────────────────────────────────────────────────────────────

  /**
   * Must be called from a synchronous user-gesture handler (pointerdown).
   * Idempotent — safe to call on every tap; only does work the first time.
   */
  unlock() {
    if (!this.enabled || this.unlocked) return;

    try {
      if (!this.ctx) {
        const Ctx   = window.AudioContext || window.webkitAudioContext;
        this.ctx    = new Ctx();
        this.master = this.ctx.createGain();
        this.master.gain.value = 0.75;        // master volume
        this.master.connect(this.ctx.destination);
      }

      const go = () => {
        // Play a 1-sample silent buffer — unlocks iOS audio hardware.
        // Without this step, iOS blocks even oscillators after resume().
        const buf = this.ctx.createBuffer(1, 1, this.ctx.sampleRate);
        const src = this.ctx.createBufferSource();
        src.buffer = buf;
        src.connect(this.ctx.destination);
        src.start(0);
        this.unlocked = true;
        this._startAmbient();
      };

      // resume() is needed if autoplay policy suspended the context
      if (this.ctx.state !== 'running') {
        this.ctx.resume().then(go);
      } else {
        go();
      }
    } catch (e) {
      console.warn('[SFX] unlock failed:', e.message);
      this.enabled = false;
    }
  }

  /**
   * Safe to call from anywhere — game loop, tweens, event handlers.
   * Silently no-ops until unlock() has been called and resolved.
   */
  play(type) {
    if (!this.enabled || !this.unlocked) return;
    try {
      this._dispatch(type);
    } catch (e) {
      console.warn('[SFX] play error:', type, e.message);
    }
  }

  // ── internals ──────────────────────────────────────────────────────────────

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

  // Quiet nature ambience — starts automatically after first unlock
  _startAmbient() {
    try {
      const rate = this.ctx.sampleRate;
      const buf  = this.ctx.createBuffer(1, rate * 4, rate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      const src  = this.ctx.createBufferSource();
      src.buffer = buf; src.loop = true;
      const lo   = this.ctx.createBiquadFilter();
      lo.type = 'lowpass'; lo.frequency.value = 140;
      const g    = this.ctx.createGain(); g.gain.value = 0.04;
      src.connect(lo); lo.connect(g); g.connect(this.master);
      src.start(0);
    } catch (e) { /* ambient is optional */ }
  }

  // ── helpers ────────────────────────────────────────────────────────────────

  // Simple oscillator burst
  _osc(type, freq, peakGain, dur) {
    const t = this.ctx.currentTime;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(peakGain, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    g.connect(this.master);
    const o = this.ctx.createOscillator();
    o.type = type; o.frequency.value = freq;
    o.connect(g); o.start(t); o.stop(t + dur + 0.01);
  }

  // White-noise burst through a band-pass filter
  _noise(dur, filterFreq, peakGain) {
    const t    = this.ctx.currentTime;
    const size = Math.ceil(this.ctx.sampleRate * dur);
    const buf  = this.ctx.createBuffer(1, size, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < size; i++) data[i] = Math.random() * 2 - 1;
    const src  = this.ctx.createBufferSource(); src.buffer = buf;
    const bp   = this.ctx.createBiquadFilter();
    bp.type = 'bandpass'; bp.frequency.value = filterFreq; bp.Q.value = 1.2;
    const g    = this.ctx.createGain();
    g.gain.setValueAtTime(peakGain, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(bp); bp.connect(g); g.connect(this.master);
    src.start(t);
  }

  // ── sounds ──────────────────────────────────────────────────────────────────

  _moo() {
    const t = this.ctx.currentTime;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.45, t + 0.06);
    g.gain.linearRampToValueAtTime(0.30, t + 0.45);
    g.gain.linearRampToValueAtTime(0, t + 0.80);
    g.connect(this.master);

    const lo = this.ctx.createBiquadFilter();
    lo.type = 'lowpass'; lo.frequency.value = 680;
    lo.connect(g);

    const o = this.ctx.createOscillator(); o.type = 'sawtooth';
    o.frequency.setValueAtTime(148, t);
    o.frequency.exponentialRampToValueAtTime(118, t + 0.28);
    o.frequency.exponentialRampToValueAtTime(140, t + 0.60);
    o.frequency.exponentialRampToValueAtTime(122, t + 0.80);
    o.connect(lo); o.start(t); o.stop(t + 0.82);
  }

  _quack() {
    const t = this.ctx.currentTime;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.35, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.26);
    g.connect(this.master);

    const bp = this.ctx.createBiquadFilter();
    bp.type = 'bandpass'; bp.frequency.value = 950; bp.Q.value = 2.5;
    bp.connect(g);

    const o = this.ctx.createOscillator(); o.type = 'square';
    o.frequency.setValueAtTime(780, t);
    o.frequency.exponentialRampToValueAtTime(500, t + 0.09);
    o.frequency.exponentialRampToValueAtTime(680, t + 0.17);
    o.frequency.exponentialRampToValueAtTime(520, t + 0.26);
    o.connect(bp); o.start(t); o.stop(t + 0.28);
  }

  _splash() {
    this._noise(0.35, 1600, 0.55);
    this._osc('sine', 75, 0.25, 0.22);
  }

  _plop() {
    this._noise(0.14, 2200, 0.35);
    this._osc('sine', 110, 0.18, 0.12);
  }

  _ripple() {
    const t = this.ctx.currentTime;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.18, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
    g.connect(this.master);
    const o = this.ctx.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(1100, t);
    o.frequency.exponentialRampToValueAtTime(300, t + 0.22);
    o.connect(g); o.start(t); o.stop(t + 0.24);
  }

  _click() {
    const t = this.ctx.currentTime;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.25, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
    g.connect(this.master);
    const o = this.ctx.createOscillator();
    o.type = 'sine'; o.frequency.value = 440;
    o.connect(g); o.start(t); o.stop(t + 0.10);
  }

  _nom() {
    // Two soft clicks — munching
    [0, 0.10].forEach(delay => {
      const t = this.ctx.currentTime + delay;
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(0.20, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
      g.connect(this.master);
      const o = this.ctx.createOscillator();
      o.type = 'sine'; o.frequency.value = 220;
      o.connect(g); o.start(t); o.stop(t + 0.09);
    });
  }

  _happy() {
    // C–E–G ascending arpeggio
    [[524, 0], [660, 0.14], [784, 0.28]].forEach(([freq, delay]) => {
      const t = this.ctx.currentTime + delay;
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(0.22, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.20);
      g.connect(this.master);
      const o = this.ctx.createOscillator();
      o.type = 'triangle'; o.frequency.value = freq;
      o.connect(g); o.start(t); o.stop(t + 0.22);
    });
  }
}
