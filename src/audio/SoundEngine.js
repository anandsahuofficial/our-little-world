export default class SoundEngine {
  constructor() {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) { this.enabled = false; return; }
    this.enabled = true;
    this.ctx = new Ctx();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.42;
    this.master.connect(this.ctx.destination);
    this.ambientStarted = false;
  }

  resume() {
    if (this.enabled && this.ctx.state === 'suspended') this.ctx.resume();
  }

  play(type) {
    if (!this.enabled) return;
    this.resume();
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

  // Start quiet ambient nature/water sound on first user gesture
  startAmbient() {
    if (!this.enabled || this.ambientStarted) return;
    this.ambientStarted = true;
    this.resume();

    const rate = this.ctx.sampleRate;
    const buf  = this.ctx.createBuffer(1, rate * 3, rate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    src.loop   = true;

    const filt = this.ctx.createBiquadFilter();
    filt.type = 'lowpass';
    filt.frequency.value = 160;

    const gain = this.ctx.createGain();
    gain.gain.value = 0.038;

    src.connect(filt);
    filt.connect(gain);
    gain.connect(this.master);
    src.start();
  }

  // ---- sound primitives ----

  _osc(type, freq, startGain, endGain, dur) {
    const t = this.ctx.currentTime;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(startGain, t);
    g.gain.linearRampToValueAtTime(endGain, t + dur);
    g.connect(this.master);
    const o = this.ctx.createOscillator();
    o.type = type; o.frequency.value = freq;
    o.connect(g);
    o.start(t); o.stop(t + dur);
  }

  _noise(durationSec, filterFreq, filterType, gain) {
    const t = this.ctx.currentTime;
    const size = Math.floor(this.ctx.sampleRate * durationSec);
    const buf  = this.ctx.createBuffer(1, size, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < size; i++) data[i] = Math.random() * 2 - 1;
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const filt = this.ctx.createBiquadFilter();
    filt.type = filterType; filt.frequency.value = filterFreq;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + durationSec);
    src.connect(filt); filt.connect(g); g.connect(this.master);
    src.start(t);
  }

  _moo() {
    const t = this.ctx.currentTime;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.26, t + 0.06);
    g.gain.linearRampToValueAtTime(0.18, t + 0.45);
    g.gain.linearRampToValueAtTime(0, t + 0.75);
    g.connect(this.master);

    const filt = this.ctx.createBiquadFilter();
    filt.type = 'lowpass'; filt.frequency.value = 620;
    filt.connect(g);

    const o = this.ctx.createOscillator();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(148, t);
    o.frequency.exponentialRampToValueAtTime(118, t + 0.28);
    o.frequency.exponentialRampToValueAtTime(138, t + 0.58);
    o.frequency.exponentialRampToValueAtTime(122, t + 0.75);
    o.connect(filt);
    o.start(t); o.stop(t + 0.75);
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

    const o = this.ctx.createOscillator();
    o.type = 'square';
    o.frequency.setValueAtTime(760, t);
    o.frequency.exponentialRampToValueAtTime(490, t + 0.09);
    o.frequency.exponentialRampToValueAtTime(660, t + 0.16);
    o.frequency.exponentialRampToValueAtTime(510, t + 0.24);
    o.connect(filt);
    o.start(t); o.stop(t + 0.24);
  }

  _splash() {
    this._noise(0.32, 1800, 'bandpass', 0.38);
    // Low thud underneath
    this._osc('sine', 80, 0.12, 0.001, 0.18);
  }

  _plop() {
    this._noise(0.12, 2400, 'bandpass', 0.22);
    this._osc('sine', 120, 0.08, 0.001, 0.10);
  }

  _ripple() {
    const t = this.ctx.currentTime;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.05, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
    g.connect(this.master);
    const o = this.ctx.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(900, t);
    o.frequency.exponentialRampToValueAtTime(280, t + 0.18);
    o.connect(g); o.start(t); o.stop(t + 0.18);
  }

  _click() {
    this._osc('sine', 370, 0.08, 0.001, 0.06);
  }

  _nom() {
    this._osc('sine', 265, 0.055, 0.001, 0.14);
  }

  _happy() {
    // Three ascending notes (C-E-G chord arpeggio)
    [[524, 0], [660, 0.13], [784, 0.26]].forEach(([freq, delay]) => {
      const t = this.ctx.currentTime + delay;
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(0.10, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
      g.connect(this.master);
      const o = this.ctx.createOscillator();
      o.type = 'triangle'; o.frequency.value = freq;
      o.connect(g); o.start(t); o.stop(t + 0.16);
    });
  }
}
