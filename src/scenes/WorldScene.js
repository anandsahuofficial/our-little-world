import Player from '../entities/Player.js';
import Moo    from '../entities/Moo.js';
import Duck   from '../entities/Duck.js';
import SoundEngine from '../audio/SoundEngine.js';
import { loadState, saveState, applyTimedDecay } from '../data/gameState.js';

// Lake geometry constants (used for water / shore detection)
const LAKE = { cx: 960, cy: 700, rx: 355, ry: 197 };
// Shore band is 55 px wider than the water ellipse on all sides
const SHORE = { cx: 960, cy: 700, rx: 410, ry: 252 };

export default class WorldScene extends Phaser.Scene {
  constructor() { super({ key: 'WorldScene' }); }

  // ── helpers ────────────────────────────────────────────────────────────────

  isInWater(x, y) {
    return Math.pow((x - LAKE.cx) / LAKE.rx, 2) +
           Math.pow((y - LAKE.cy) / LAKE.ry, 2) < 1;
  }

  isOnShore(x, y) {
    const inWater  = this.isInWater(x, y);
    const inShore  = Math.pow((x - SHORE.cx) / SHORE.rx, 2) +
                     Math.pow((y - SHORE.cy) / SHORE.ry, 2) < 1;
    return !inWater && inShore;
  }

  // Expanding-ring ripple at world-space (x, y); scale adjusts final radius
  createRipple(x, y, scale = 1) {
    const g    = this.add.graphics().setDepth(600);
    const maxR = 32 * scale;
    const data = { r: 5 };

    this.tweens.add({
      targets: data,
      r: maxR,
      duration: 720,
      ease: 'Cubic.Out',
      onUpdate: () => {
        const alpha = 1 - data.r / maxR;
        g.clear();
        g.lineStyle(Math.max(0.5, 2.2 * alpha), 0x90caf9, alpha);
        g.strokeCircle(x, y, data.r);
      },
      onComplete: () => g.destroy(),
    });
  }

  // Parabolic stone throw from (fromX,fromY) → (toX,toY)
  throwStone(fromX, fromY, toX, toY) {
    const stone  = this.add.graphics().setDepth(700);
    stone.fillStyle(0x78909c);
    stone.fillCircle(0, 0, 4);
    stone.setPosition(fromX, fromY);

    const arcH = Math.min(100, Phaser.Math.Distance.Between(fromX, fromY, toX, toY) * 0.4);
    const data = { t: 0 };

    this.tweens.add({
      targets: data,
      t: 1,
      duration: 480,
      ease: 'Linear',
      onUpdate: () => {
        const p = data.t;
        stone.setPosition(
          fromX + (toX - fromX) * p,
          fromY + (toY - fromY) * p - arcH * Math.sin(Math.PI * p)
        );
      },
      onComplete: () => {
        stone.destroy();
        this.sfx.play('splash');

        // Three expanding ripple rings
        for (let i = 0; i < 3; i++) {
          this.time.delayedCall(i * 170, () => this.createRipple(toX, toY, 0.55 + i * 0.5));
        }

        // "plop" text
        const txt = this.add.text(toX, toY - 20, 'plop!', {
          fontSize: '11px', color: '#90caf9',
          stroke: '#000000', strokeThickness: 2,
          fontFamily: 'Arial, sans-serif',
        }).setOrigin(0.5).setDepth(700);
        this.tweens.add({
          targets: txt, y: txt.y - 28, alpha: 0, duration: 900,
          ease: 'Cubic.Out', onComplete: () => txt.destroy(),
        });
      },
    });
  }

  // ── lifecycle ───────────────────────────────────────────────────────────────

  create() {
    const W = 1920, H = 1440;
    this.physics.world.setBounds(0, 0, W, H);

    this.sfx   = new SoundEngine();
    this.registry.set('sfx', this.sfx);

    this.state = applyTimedDecay(loadState());

    this.buildWorld(W, H);

    // Player
    this.player = new Player(this, this.state.player.x, this.state.player.y);

    // Moo
    this.moo = new Moo(this, 680, 455, this.state.moo);
    this.registry.set('mooStats', { ...this.state.moo });

    // Ducks (on the lake)
    this.ducks = [
      new Duck(this, 830, 680, this.sfx),
      new Duck(this, 860, 695, this.sfx),
      new Duck(this, 1080, 710, this.sfx),
      new Duck(this, 1060, 730, this.sfx),
    ];

    // Camera
    this.cameras.main.setBounds(0, 0, W, H);
    this.cameras.main.startFollow(this.player.sprite, true, 0.08, 0.08);
    this.cameras.main.setZoom(1.5);

    // T's name tag
    this.nameTag = this.add.text(0, 0, 'T', {
      fontSize: '10px', color: '#ffffff',
      stroke: '#000000', strokeThickness: 3,
      fontFamily: 'Arial, sans-serif',
    }).setOrigin(0.5, 1).setDepth(9999);

    // Water-entry tracking
    this.wasInWater      = false;
    this.waterRippleCool = 0;
    this.waterSoundCool  = 0;

    // ── input ──────────────────────────────────────────────────────────────
    this.input.on('pointerdown', ptr => {
      this.sfx.startAmbient(); // kick off ambient on first touch
      const w = this.cameras.main.getWorldPoint(ptr.x, ptr.y);

      // 1. Near Moo → open care menu
      const dMoo = Phaser.Math.Distance.Between(w.x, w.y, this.moo.sprite.x, this.moo.sprite.y);
      if (dMoo < 80 && this.moo.isNearPlayer) {
        this.sfx.play('click');
        this.game.events.emit('moo-interact');
        return;
      }

      // 2. Near a duck → feed it
      const nearDuck = this.ducks.find(d =>
        Phaser.Math.Distance.Between(w.x, w.y, d.sprite.x, d.sprite.y) < 80
      );
      if (nearDuck) {
        nearDuck.feed();
        return;
      }

      // 3. Tap on water surface → throw stone (if player is NOT in water)
      if (this.isInWater(w.x, w.y)) {
        if (!this.isInWater(this.player.sprite.x, this.player.sprite.y)) {
          this.throwStone(this.player.sprite.x, this.player.sprite.y, w.x, w.y);
        } else {
          // Player is in water — just make a ripple
          this.createRipple(w.x, w.y, 0.8);
          this.sfx.play('ripple');
        }
        return;
      }

      // 4. Default — move T
      this.player.moveTo(w.x, w.y);
    });

    // Moo action from UIScene
    this.game.events.on('moo-action', ({ action }) => {
      const ok = this.moo.react(action);
      if (ok) {
        this.state.moo = this.moo.mooState;
        saveState(this.state);
      }
    }, this);

    // Autosave
    this.time.addEvent({ delay: 30000, loop: true, callback: this.autosave, callbackScope: this });

    // HUD overlay
    this.scene.launch('UIScene');

    if (this.state.firstVisit) {
      this.state.firstVisit = false;
      this.showWelcome();
    }
  }

  showWelcome() {
    const cam = this.cameras.main;
    const cx  = cam.scrollX + cam.width  / 2 / cam.zoom;
    const cy  = cam.scrollY + cam.height / 2 / cam.zoom;

    const msg = this.add.text(cx, cy,
      'Welcome to Our Little World!\nFind Moo nearby and tap her :)', {
        fontSize: '18px', color: '#ffffff',
        stroke: '#000000', strokeThickness: 4,
        fontFamily: 'Georgia, serif', align: 'center',
      }).setOrigin(0.5).setDepth(20000).setAlpha(0);

    this.tweens.add({ targets: msg, alpha: 1, duration: 600 });
    this.time.delayedCall(3000, () => {
      this.tweens.add({ targets: msg, alpha: 0, duration: 600, onComplete: () => msg.destroy() });
    });
  }

  // ── world building ──────────────────────────────────────────────────────────

  buildWorld(W, H) {
    const bg = this.add.graphics();

    // ── GRASS ──────────────────────────────────────────────────────────────
    bg.fillStyle(0x4caf50);
    bg.fillRect(0, 0, W, H);
    bg.fillStyle(0x56c25b);
    for (let x = 0; x < W; x += 64) {
      for (let y = 0; y < H; y += 64) {
        if (((x / 64) + (y / 64)) % 2 === 0) {
          bg.fillRect(x, y, 32, 32);
          bg.fillRect(x + 32, y + 32, 32, 32);
        }
      }
    }

    // ── SHORE BAND (drawn before lake so water covers inner portion) ────────
    // Outer sandy ring
    bg.fillStyle(0xc8b49a);
    bg.fillEllipse(SHORE.cx, SHORE.cy, SHORE.rx * 2, SHORE.ry * 2);
    // Inner shore — slightly darker, closer to water edge
    bg.fillStyle(0xb0997e);
    bg.fillEllipse(LAKE.cx, LAKE.cy, (LAKE.rx + 28) * 2, (LAKE.ry + 28) * 2);

    // Pebbles — two rings around the lake perimeter (deterministic via angle)
    const pebbleColors = [0x9e9e9e, 0x78909c, 0x8d6e63, 0xbdbdbd, 0xa1887f];
    const nAngles = 26;
    for (let i = 0; i < nAngles; i++) {
      const a  = (i / nAngles) * Math.PI * 2;
      const a2 = a + 0.14;
      const r1x = LAKE.rx * 1.055, r1y = LAKE.ry * 1.055;
      const r2x = LAKE.rx * 1.10,  r2y = LAKE.ry * 1.10;
      bg.fillStyle(pebbleColors[i % 5]);
      bg.fillCircle(
        Math.round(LAKE.cx + Math.cos(a)  * r1x),
        Math.round(LAKE.cy + Math.sin(a)  * r1y),
        2 + (i % 2)
      );
      bg.fillStyle(pebbleColors[(i + 3) % 5]);
      bg.fillCircle(
        Math.round(LAKE.cx + Math.cos(a2) * r2x),
        Math.round(LAKE.cy + Math.sin(a2) * r2y),
        1 + (i % 3)
      );
    }

    // ── SANDY PATH ─────────────────────────────────────────────────────────
    bg.fillStyle(0xd4a96a);
    bg.fillRect(490, 370, 940, 36);
    bg.fillRect(490, 994, 940, 36);
    bg.fillRect(454, 370, 36, 660);
    bg.fillRect(1430, 370, 36, 660);
    bg.fillCircle(490,  388, 36);
    bg.fillCircle(1430, 388, 36);
    bg.fillCircle(490,  1012, 36);
    bg.fillCircle(1430, 1012, 36);
    bg.fillStyle(0xb8904a);
    bg.fillRect(494, 374, 932, 4);
    bg.fillRect(494, 1022, 932, 4);
    bg.fillRect(458, 374, 4, 652);
    bg.fillRect(1458, 374, 4, 652);

    // ── LAKE ───────────────────────────────────────────────────────────────
    bg.fillStyle(0x0d47a1);
    bg.fillEllipse(966, 706, 728, 408);
    bg.fillStyle(0x1565c0);
    bg.fillEllipse(LAKE.cx, LAKE.cy, LAKE.rx * 2, LAKE.ry * 2);
    bg.fillStyle(0x1976d2);
    bg.fillEllipse(950, 695, 580, 320);
    // Surface highlights
    bg.fillStyle(0x42a5f5);
    bg.fillEllipse(870, 640, 220, 90);
    bg.fillEllipse(1080, 670, 140, 60);
    // Deep centre
    bg.fillStyle(0x0d47a1);
    bg.fillEllipse(970, 720, 340, 180);

    // Water sparkle dots
    bg.fillStyle(0x90caf9);
    [{x:820,y:630},{x:900,y:610},{x:1020,y:640},
     {x:780,y:680},{x:1100,y:660},{x:860,y:750},
     {x:1050,y:730},{x:960,y:600}].forEach(s => bg.fillRect(s.x, s.y, 3, 3));

    // Shore-water transition line (subtle lighter ring just inside shore)
    bg.lineStyle(5, 0x64b5f6, 0.35);
    bg.strokeEllipse(LAKE.cx, LAKE.cy, LAKE.rx * 2 + 10, LAKE.ry * 2 + 10);

    // Lily pads
    bg.fillStyle(0x2e7d32);
    [{x:690,y:670},{x:720,y:710},{x:740,y:740},
     {x:1180,y:660},{x:1210,y:695},{x:1195,y:730},
     {x:950,y:860},{x:985,y:845},{x:970,y:875}].forEach(p => {
      bg.fillCircle(p.x, p.y, 10);
      bg.fillStyle(0xffffff);
      bg.fillCircle(p.x + 1, p.y - 1, 3);
      bg.fillStyle(0x2e7d32);
    });

    // ── ANIMATED WATER SHIMMER ─────────────────────────────────────────────
    const shimmerPos = [
      {x:820,y:625},{x:880,y:600},{x:940,y:615},{x:1000,y:610},
      {x:1060,y:625},{x:1110,y:645},{x:790,y:665},{x:855,y:680},
      {x:925,y:670},{x:995,y:672},{x:1060,y:662},{x:1115,y:650},
      {x:820,y:705},{x:895,y:720},{x:965,y:708},{x:1040,y:715},
      {x:1100,y:700},{x:845,y:745},{x:960,y:755},{x:1075,y:745},
    ];
    shimmerPos.forEach((p, i) => {
      const s = this.add.image(p.x, p.y, 'shimmer').setDepth(503).setAlpha(0.45);
      this.tweens.add({
        targets: s, alpha: 0.05,
        duration: 680 + i * 55, yoyo: true, repeat: -1,
        ease: 'Sine.easeInOut', delay: i * 145,
      });
    });

    // ── BRIDGE ─────────────────────────────────────────────────────────────
    this.add.image(960, 870, 'bridge').setDepth(500);

    // ── SHORE REEDS ────────────────────────────────────────────────────────
    // Positions verified to sit in the shore band (outside water, inside shore ellipse)
    const reeds = [
      {x:573, y:700}, {x:582, y:726}, {x:566, y:752},  // left shore
      {x:622, y:808}, {x:608, y:830},                   // bottom-left shore
      {x:1346,y:700}, {x:1358,y:726}, {x:1340,y:752},  // right shore
      {x:1300,y:808}, {x:1314,y:830},                   // bottom-right shore
      {x:950, y:483}, {x:972, y:482}, {x:990, y:485},  // top shore
      {x:946, y:912}, {x:970, y:918}, {x:994, y:912},  // bottom shore
    ];
    reeds.forEach(r => this.add.image(r.x, r.y, 'reed').setDepth(r.y + 3));

    // ── TREES ──────────────────────────────────────────────────────────────
    [
      {x:180,y:280},{x:240,y:360},{x:170,y:460},{x:220,y:560},{x:180,y:660},
      {x:240,y:760},{x:185,y:860},{x:230,y:960},{x:175,y:1060},{x:250,y:1140},
      {x:1740,y:280},{x:1680,y:380},{x:1750,y:480},{x:1700,y:580},{x:1760,y:680},
      {x:1690,y:780},{x:1745,y:880},{x:1685,y:980},{x:1750,y:1080},{x:1700,y:1160},
      {x:420,y:185},{x:560,y:155},{x:720,y:175},{x:880,y:155},{x:960,y:170},
      {x:1040,y:155},{x:1200,y:175},{x:1360,y:155},{x:1500,y:185},
      {x:420,y:1250},{x:580,y:1280},{x:750,y:1255},{x:960,y:1270},
      {x:1170,y:1255},{x:1340,y:1280},{x:1500,y:1255},
      {x:570,y:455},{x:1350,y:455},{x:580,y:930},{x:1340,y:930},
    ].forEach(t => this.add.image(t.x, t.y, 'tree').setDepth(t.y));

    // ── BENCHES ────────────────────────────────────────────────────────────
    [
      {x:650,y:383,a:0},{x:810,y:383,a:0},{x:1110,y:383,a:0},{x:1270,y:383,a:0},
      {x:650,y:1007,a:180},{x:810,y:1007,a:180},{x:1110,y:1007,a:180},{x:1270,y:1007,a:180},
      {x:472,y:580,a:90},{x:472,y:780,a:90},{x:1448,y:580,a:270},{x:1448,y:780,a:270},
    ].forEach(b => this.add.image(b.x, b.y, 'bench').setAngle(b.a).setDepth(b.y + 1));

    // ── FLOWERS ────────────────────────────────────────────────────────────
    [
      {x:110,y:295},{x:148,y:370},{x:195,y:310},{x:125,y:440},{x:160,y:510},
      {x:200,y:430},{x:115,y:590},{x:155,y:650},{x:195,y:580},{x:120,y:730},
      {x:165,y:790},{x:205,y:720},{x:130,y:890},{x:175,y:960},{x:210,y:830},
      {x:1710,y:295},{x:1760,y:370},{x:1725,y:430},{x:1705,y:510},{x:1765,y:590},
      {x:1720,y:650},{x:1710,y:720},{x:1758,y:800},{x:1715,y:860},{x:1700,y:950},
      {x:1760,y:1010},{x:1725,y:1080},{x:360,y:200},{x:450,y:240},{x:540,y:210},
      {x:650,y:250},{x:740,y:220},{x:830,y:245},{x:960,y:215},{x:1070,y:240},
      {x:1170,y:220},{x:1260,y:250},{x:1380,y:215},{x:1480,y:240},{x:360,y:1195},
      {x:460,y:1225},{x:555,y:1200},{x:670,y:1230},{x:760,y:1210},{x:860,y:1235},
      {x:960,y:1210},{x:1070,y:1230},{x:1170,y:1205},{x:1275,y:1225},{x:1490,y:1230},
    ].forEach(f => this.add.image(f.x, f.y, 'flower').setDepth(f.y + 2));

    // ── AREA LABELS ────────────────────────────────────────────────────────
    this.add.text(960, 95, 'Central Park', {
      fontSize: '36px', color: '#1b5e20',
      stroke: '#a5d6a7', strokeThickness: 5,
      fontFamily: 'Georgia, serif', fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(9998);

    this.add.text(960, 138, 'New York City', {
      fontSize: '18px', color: '#2e7d32',
      fontFamily: 'Georgia, serif', fontStyle: 'italic',
    }).setOrigin(0.5).setDepth(9998);

    // Shore interaction hint (world-space, near top of lake)
    this.shoreHint = this.add.text(960, 472, 'tap the water to throw a stone', {
      fontSize: '10px', color: '#b0bec5',
      stroke: '#000000', strokeThickness: 2,
      fontFamily: 'Arial, sans-serif',
    }).setOrigin(0.5).setDepth(9997).setAlpha(0);
  }

  autosave() {
    this.state.player.x = this.player.sprite.x;
    this.state.player.y = this.player.sprite.y;
    this.state.moo      = this.moo.mooState;
    saveState(this.state);
  }

  // ── update ──────────────────────────────────────────────────────────────────

  update() {
    this.player.update();
    this.moo.update();
    this.ducks.forEach(d => d.update(this.player.sprite.x, this.player.sprite.y));

    const px = this.player.sprite.x;
    const py = this.player.sprite.y;

    // Moo proximity
    const dMoo = Phaser.Math.Distance.Between(px, py, this.moo.sprite.x, this.moo.sprite.y);
    this.moo.setNearPlayer(dMoo < 100);

    // T's name tag
    this.nameTag.setPosition(px, py - (28 * 2.5) / 2 - 4);
    this.nameTag.setDepth(py + 1);

    // ── water effects ──────────────────────────────────────────────────────
    const inWater = this.isInWater(px, py);

    // Splash sound + ripple burst on water entry
    if (inWater && !this.wasInWater) {
      this.sfx.play('splash');
      this.createRipple(px, py, 1.4);
    }
    this.wasInWater = inWater;

    if (inWater) {
      // Slow the player while wading
      const body = this.player.sprite.body;
      body.velocity.x *= 0.45;
      body.velocity.y *= 0.45;

      const speed = Math.hypot(body.velocity.x, body.velocity.y);
      if (speed > 8) {
        this.waterRippleCool--;
        this.waterSoundCool--;

        if (this.waterRippleCool <= 0) {
          this.createRipple(px, py, 0.5);
          this.waterRippleCool = 20;
        }
        if (this.waterSoundCool <= 0) {
          this.sfx.play('ripple');
          this.waterSoundCool = 65;
        }
      }
    }

    // Shore hint: fade in when on shore, fade out when elsewhere
    const onShore = this.isOnShore(px, py);
    if (this.shoreHint) {
      const target = onShore ? 0.75 : 0;
      if (Math.abs(this.shoreHint.alpha - target) > 0.01) {
        this.shoreHint.setAlpha(Phaser.Math.Linear(this.shoreHint.alpha, target, 0.05));
      }
    }
  }
}
