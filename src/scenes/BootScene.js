export default class BootScene extends Phaser.Scene {
  constructor() { super({ key: 'BootScene' }); }

  preload() {
    this.makePlayerTexture();
    this.makeTreeTexture();
    this.makeFlowerTexture();
    this.makeBenchTexture();
    this.makeBridgeTexture();
    this.makeDuckTexture();
    this._makeCowCanvas('moo',       'open',  false);
    this._makeCowCanvas('moo_blink', 'blink', false);
    this._makeCowCanvas('moo_eat',   'open',  true);
    this._makeCowCanvas('moo_dead',  'dead',  false);
    this.makeReedTexture();
    this.makeShimmerTexture();
    this.makeTempleTexture();
    this.makeDiyaTexture();
    this.makeBoatTexture();
  }

  makePlayerTexture() {
    const g = this.make.graphics({ add: false });

    // Hair
    g.fillStyle(0x3d1c02);
    g.fillRect(2, 0, 12, 5);
    g.fillRect(1, 4, 2, 9);
    g.fillRect(13, 4, 2, 9);

    // Head (skin)
    g.fillStyle(0xffcba4);
    g.fillRect(3, 3, 10, 9);

    // Eyes
    g.fillStyle(0x2c1810);
    g.fillRect(5, 7, 2, 2);
    g.fillRect(9, 7, 2, 2);
    // Eye shine
    g.fillStyle(0xffffff);
    g.fillRect(6, 7, 1, 1);
    g.fillRect(10, 7, 1, 1);

    // Blush
    g.fillStyle(0xffb3ba);
    g.fillRect(4, 10, 2, 1);
    g.fillRect(10, 10, 2, 1);

    // Body — pink dress
    g.fillStyle(0xf48fb1);
    g.fillRect(3, 12, 10, 7);

    // Collar detail
    g.fillStyle(0xfce4ec);
    g.fillRect(6, 12, 4, 2);

    // Skirt flare
    g.fillStyle(0xf48fb1);
    g.fillRect(1, 17, 14, 4);

    // Arms (skin)
    g.fillStyle(0xffcba4);
    g.fillRect(1, 13, 2, 5);
    g.fillRect(13, 13, 2, 5);

    // Legs
    g.fillStyle(0xffcba4);
    g.fillRect(4, 21, 3, 5);
    g.fillRect(9, 21, 3, 5);

    // Shoes
    g.fillStyle(0x5c3d1e);
    g.fillRect(3, 25, 4, 3);
    g.fillRect(9, 25, 4, 3);

    g.generateTexture('player', 16, 28);
    g.destroy();
  }

  makeTreeTexture() {
    // Banyan / Peepal — sacred trees common across Prayagraj and Triveni Sangam.
    // The Akshay Vat (immortal banyan) inside Allahabad Fort is a famous landmark.
    const g = this.make.graphics({ add: false });

    // Aerial roots (characteristic of banyan)
    g.fillStyle(0x6d4c41);
    g.fillRect(6,  26, 2, 14);
    g.fillRect(12, 28, 2, 12);
    g.fillRect(24, 28, 2, 12);
    g.fillRect(30, 26, 2, 14);

    // Main trunk (wide, gnarled)
    g.fillStyle(0x5d4037);
    g.fillRect(14, 22, 12, 22);
    g.fillStyle(0x795548);
    g.fillRect(12, 20, 14, 22);

    // Wide canopy — banyan spreads very broadly
    g.fillStyle(0x1b5e20);
    g.fillEllipse(20, 18, 38, 24);
    g.fillStyle(0x2e7d32);
    g.fillEllipse(17, 13, 32, 20);
    g.fillStyle(0x388e3c);
    g.fillEllipse(22, 9,  26, 16);
    g.fillStyle(0x43a047);
    g.fillEllipse(19, 6,  18, 12);
    // Highlight
    g.fillStyle(0x66bb6a);
    g.fillEllipse(16, 4, 10, 7);

    g.generateTexture('tree', 40, 42);
    g.destroy();
  }

  makeFlowerTexture() {
    // Marigold (genda phool) — iconic in Allahabad puja culture
    const g = this.make.graphics({ add: false });

    // Stem
    g.fillStyle(0x558b2f);
    g.fillRect(5, 11, 2, 7);
    // Small leaf
    g.fillStyle(0x689f38);
    g.fillRect(6, 14, 5, 2);

    // Outer petals — deep saffron/orange
    g.fillStyle(0xff8f00);
    g.fillCircle(3, 6, 3); g.fillCircle(8, 6, 3);
    g.fillCircle(5, 3, 3); g.fillCircle(5, 9, 3);
    g.fillCircle(2, 4, 2); g.fillCircle(9, 4, 2);
    g.fillCircle(2, 8, 2); g.fillCircle(9, 8, 2);

    // Inner petals — golden yellow
    g.fillStyle(0xffc107);
    g.fillCircle(4, 5, 2); g.fillCircle(7, 5, 2);
    g.fillCircle(5, 4, 2); g.fillCircle(5, 8, 2);

    // Centre
    g.fillStyle(0xff6f00);
    g.fillCircle(5, 6, 2);

    g.generateTexture('flower', 12, 18);
    g.destroy();
  }

  makeBenchTexture() {
    const g = this.make.graphics({ add: false });

    // Legs
    g.fillStyle(0x5d4037);
    g.fillRect(1, 10, 4, 8);
    g.fillRect(21, 10, 4, 8);

    // Seat slats
    g.fillStyle(0xa0785a);
    g.fillRect(0, 6, 26, 3);
    g.fillRect(0, 10, 26, 3);

    // Backrest
    g.fillStyle(0xbf9b6f);
    g.fillRect(0, 0, 26, 5);

    g.generateTexture('bench', 26, 18);
    g.destroy();
  }

  makeBridgeTexture() {
    const g = this.make.graphics({ add: false });

    // Stone base
    g.fillStyle(0xbdbdbd);
    g.fillRect(0, 18, 160, 16);

    // Stone texture lines
    g.fillStyle(0xaaaaaa);
    for (let x = 10; x < 160; x += 20) {
      g.fillRect(x, 18, 2, 16);
    }
    g.fillRect(0, 26, 160, 2);

    // Railings
    g.fillStyle(0xe0e0e0);
    g.fillRect(0, 12, 160, 6);
    g.fillRect(0, 34, 160, 6);

    // Railing posts
    g.fillStyle(0xeeeeee);
    for (let x = 4; x < 160; x += 16) {
      g.fillRect(x, 8, 4, 30);
    }

    // Top rail
    g.fillStyle(0xf5f5f5);
    g.fillRect(0, 6, 160, 4);
    g.fillRect(0, 38, 160, 4);

    g.generateTexture('bridge', 160, 44);
    g.destroy();
  }

  makeDuckTexture() {
    const g = this.make.graphics({ add: false });

    // Body (white)
    g.fillStyle(0xf5f5f5);
    g.fillEllipse(8, 8, 14, 10);

    // Head
    g.fillStyle(0xf5f5f5);
    g.fillCircle(14, 5, 5);

    // Bill (orange)
    g.fillStyle(0xff9800);
    g.fillRect(18, 5, 4, 2);

    // Eye
    g.fillStyle(0x212121);
    g.fillRect(15, 4, 2, 2);

    // Wing detail
    g.fillStyle(0xe0e0e0);
    g.fillEllipse(7, 8, 10, 6);

    g.generateTexture('duck', 22, 14);
    g.destroy();
  }

  makeTempleTexture() {
    // North-Indian Nagara-style shikhara temple, common near Allahabad ghats
    const g = this.make.graphics({ add: false });

    // Saffron flag / kalash on top
    g.fillStyle(0xff7043);
    g.fillRect(10, 0, 2, 10);  // pole
    g.fillStyle(0xff5722);
    g.fillRect(11, 0, 8, 6);   // pennant

    // Tapering shikhara
    g.fillStyle(0xfff9c4);
    g.fillRect(10, 9,  4,  3);
    g.fillStyle(0xfff8e1);
    g.fillRect(9,  11, 6,  3);
    g.fillRect(8,  13, 8,  3);
    g.fillRect(7,  15, 10, 3);
    g.fillRect(6,  17, 12, 3);
    g.fillRect(5,  19, 14, 4);

    // Main mandap body
    g.fillStyle(0xfff8e1);
    g.fillRect(3,  22, 18, 13);

    // Decorative pillars
    g.fillStyle(0xf0c060);
    g.fillRect(3,  22, 3, 13);
    g.fillRect(18, 22, 3, 13);

    // Base platform (jagati)
    g.fillStyle(0xe8d5a3);
    g.fillRect(1,  34, 22, 5);
    g.fillRect(0,  38, 24, 4);

    // Arched door
    g.fillStyle(0xd4a017);
    g.fillRect(9,  27, 6,  8);
    g.fillStyle(0xffd54f);
    g.fillCircle(12, 28, 3);  // arch curve

    g.generateTexture('temple', 24, 42);
    g.destroy();
  }

  makeDiyaTexture() {
    // Clay oil lamp — floated on water during festivals at Sangam
    const g = this.make.graphics({ add: false });

    // Clay body
    g.fillStyle(0xc1845c);
    g.fillEllipse(5, 8, 10, 6);
    g.fillStyle(0xa0522d);
    g.fillRect(2, 9, 6, 3);

    // Flame — outer orange
    g.fillStyle(0xff9800);
    g.fillEllipse(5, 5, 4, 7);
    // Flame — inner yellow
    g.fillStyle(0xffeb3b);
    g.fillEllipse(5, 6, 2, 4);
    // Tip
    g.fillStyle(0xffffff);
    g.fillRect(4, 3, 2, 1);

    g.generateTexture('diya', 10, 13);
    g.destroy();
  }

  makeBoatTexture() {
    // Flat-bottomed nauka (rowboat) — used for Sangam darshan and river crossings
    const g = this.make.graphics({ add: false });

    // Hull sides
    g.fillStyle(0x8b5e3c);
    g.fillRect(2,  8, 34, 8);
    // Keel / bottom
    g.fillStyle(0x6d4c41);
    g.fillRect(6, 14, 26, 4);
    // Prow (bow shape)
    g.fillStyle(0x8b5e3c);
    g.fillRect(0, 10, 4, 4);
    g.fillRect(34, 10, 4, 4);

    // Oar left
    g.fillStyle(0xb08060);
    g.fillRect(-5, 11, 9, 2);
    // Oar right
    g.fillRect(34, 11, 9, 2);

    // Boatman silhouette
    g.fillStyle(0x37474f);
    g.fillRect(14, 3, 4, 6);   // body
    g.fillCircle(16, 2, 3);    // head
    // Conical hat
    g.fillStyle(0x5d4037);
    g.fillRect(13, -1, 6, 3);
    g.fillRect(14, -4, 4, 4);

    g.generateTexture('boat', 43, 18);
    g.destroy();
  }

  makeReedTexture() {
    const g = this.make.graphics({ add: false });
    // Stem
    g.fillStyle(0x558b2f);
    g.fillRect(4, 4, 2, 20);
    // Cattail head (dark brown)
    g.fillStyle(0x5d4037);
    g.fillEllipse(5, 7, 5, 10);
    // Leaf
    g.fillStyle(0x689f38);
    g.fillRect(5, 12, 8, 2);
    g.fillRect(6, 14, 6, 2);
    g.generateTexture('reed', 14, 24);
    g.destroy();
  }

  makeShimmerTexture() {
    const g = this.make.graphics({ add: false });
    g.fillStyle(0xffffff, 1);
    g.fillEllipse(2, 1, 4, 2);
    g.generateTexture('shimmer', 4, 2);
    g.destroy();
  }

  // key: texture name | blink: eyes closed | eating: head lowered + grass
  // ── Cute cow using HTML5 Canvas 2D API (smooth curves, gradients, eyelashes)
  // Phaser's Graphics API only has rects/circles with no anti-aliasing.
  // Canvas 2D gives us bezier curves, radial gradients, and smooth arcs —
  // everything needed to draw something that actually looks cute.
  _makeCowCanvas(key, eyeState, eating) {
    const W = 64, H = 64;
    const el = document.createElement('canvas');
    el.width = W; el.height = H;
    const c = el.getContext('2d');
    this._drawCow(c, eyeState, eating);
    if (this.textures.exists(key)) this.textures.remove(key);
    this.textures.addCanvas(key, el);
  }

  _drawCow(c, eyeState, eating) {
    const cx = 32; // horizontal centre

    // ── BODY ──────────────────────────────────────────────────────────────
    // Soft shadow beneath body
    c.fillStyle = 'rgba(0,0,0,0.08)';
    c.beginPath(); c.ellipse(cx + 2, 52, 20, 11, 0, 0, Math.PI * 2); c.fill();

    // Body with radial gradient (gives depth)
    const bodyG = c.createRadialGradient(cx - 4, 44, 3, cx, 50, 20);
    bodyG.addColorStop(0, '#fffde7');
    bodyG.addColorStop(1, '#ede0c8');
    c.fillStyle = bodyG;
    c.beginPath(); c.ellipse(cx, 50, 19, 11, 0, 0, Math.PI * 2); c.fill();

    // Body outline
    c.strokeStyle = '#d4c4a0'; c.lineWidth = 1;
    c.beginPath(); c.ellipse(cx, 50, 19, 11, 0, 0, Math.PI * 2); c.stroke();

    // ── HOLSTEIN SPOTS ────────────────────────────────────────────────────
    c.fillStyle = '#1a1a1a';
    c.save(); c.translate(22, 47); c.rotate(-0.4);
    c.beginPath(); c.ellipse(0, 0, 8, 6, 0, 0, Math.PI * 2); c.fill();
    c.restore();
    c.save(); c.translate(42, 53); c.rotate(0.3);
    c.beginPath(); c.ellipse(0, 0, 6, 4, 0, 0, Math.PI * 2); c.fill();
    c.restore();

    // ── LEGS (4 stubby rounded legs) ──────────────────────────────────────
    [13, 21, 37, 45].forEach(lx => {
      // Leg
      c.fillStyle = '#ede0c8';
      c.fillRect(lx, 57, 6, 8);
      // Hoof (dark rounded)
      c.fillStyle = '#5d4037';
      c.beginPath();
      c.arc(lx + 3, 65, 3.5, Math.PI, 2 * Math.PI);
      c.rect(lx, 62, 6, 3); c.fill();
    });

    // ── COWBELL ───────────────────────────────────────────────────────────
    c.fillStyle = '#ffd54f';
    c.beginPath(); c.roundRect(29, 40, 6, 8, 2); c.fill();
    c.fillStyle = '#ffb300';
    c.beginPath(); c.arc(32, 47, 2, 0, Math.PI * 2); c.fill();
    // Rope
    c.strokeStyle = '#8d6e63'; c.lineWidth = 1.5;
    c.beginPath(); c.moveTo(32, 38); c.lineTo(32, 40); c.stroke();

    // ── EARS (wide ovals — cow ears are NOT tall like rabbit ears) ─────────
    // Left ear
    c.fillStyle = '#ede0c8';
    c.beginPath(); c.ellipse(11, 15, 10, 7, -0.4, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#f4988a';
    c.beginPath(); c.ellipse(11, 16, 6.5, 4.5, -0.4, 0, Math.PI * 2); c.fill();
    // Right ear
    c.fillStyle = '#ede0c8';
    c.beginPath(); c.ellipse(53, 15, 10, 7, 0.4, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#f4988a';
    c.beginPath(); c.ellipse(53, 16, 6.5, 4.5, 0.4, 0, Math.PI * 2); c.fill();

    // ── HEAD ──────────────────────────────────────────────────────────────
    // Soft shadow
    c.fillStyle = 'rgba(0,0,0,0.07)';
    c.beginPath(); c.arc(cx + 1, 23, 18, 0, Math.PI * 2); c.fill();

    // Head with gradient (lighter on top-left = soft lighting)
    const headG = c.createRadialGradient(cx - 5, 16, 3, cx, 22, 18);
    headG.addColorStop(0, '#fffde7');
    headG.addColorStop(1, '#ede0c8');
    c.fillStyle = headG;
    c.beginPath(); c.arc(cx, 22, 17, 0, Math.PI * 2); c.fill();
    c.strokeStyle = '#d4c4a0'; c.lineWidth = 1;
    c.beginPath(); c.arc(cx, 22, 17, 0, Math.PI * 2); c.stroke();

    // ── HORNS (bezier-curved — small & cute) ──────────────────────────────
    c.fillStyle = '#ffc107';
    // Left horn
    c.beginPath();
    c.moveTo(21, 9); c.quadraticCurveTo(14, 1, 23, 5);
    c.quadraticCurveTo(27, 9, 21, 9); c.fill();
    // Right horn
    c.beginPath();
    c.moveTo(43, 9); c.quadraticCurveTo(50, 1, 41, 5);
    c.quadraticCurveTo(37, 9, 43, 9); c.fill();

    // ── EYES ──────────────────────────────────────────────────────────────
    if (eyeState === 'dead') {
      c.strokeStyle = '#4e342e'; c.lineWidth = 2.5; c.lineCap = 'round';
      [21, 43].forEach(ex => {
        c.beginPath(); c.moveTo(ex - 4, 17); c.lineTo(ex + 4, 25); c.stroke();
        c.beginPath(); c.moveTo(ex + 4, 17); c.lineTo(ex - 4, 25); c.stroke();
      });

    } else if (eyeState === 'blink') {
      // Cute closed crescents
      c.strokeStyle = '#4e342e'; c.lineWidth = 2.5; c.lineCap = 'round';
      [21, 43].forEach(ex => {
        c.beginPath();
        c.arc(ex, 22, 5.5, Math.PI + 0.25, 2 * Math.PI - 0.25);
        c.stroke();
      });

    } else {
      // Open eyes — gradient iris, highlights, eyelashes
      [21, 43].forEach(ex => {
        // Sclera
        c.fillStyle = 'white';
        c.beginPath(); c.arc(ex, 21, 6.5, 0, Math.PI * 2); c.fill();
        // Iris with gradient
        const irisG = c.createRadialGradient(ex - 1, 20, 1, ex, 21, 5.5);
        irisG.addColorStop(0, '#795548');
        irisG.addColorStop(1, '#3e2723');
        c.fillStyle = irisG;
        c.beginPath(); c.arc(ex, 21, 5, 0, Math.PI * 2); c.fill();
        // Pupil
        c.fillStyle = '#111';
        c.beginPath(); c.arc(ex - 0.5, 21.5, 2.8, 0, Math.PI * 2); c.fill();
        // Main highlight
        c.fillStyle = 'white';
        c.beginPath(); c.arc(ex - 2, 18.5, 1.8, 0, Math.PI * 2); c.fill();
        // Small second highlight
        c.beginPath(); c.arc(ex + 1.5, 20, 0.9, 0, Math.PI * 2); c.fill();
        // Eyelashes (small strokes above each eye)
        c.strokeStyle = '#4e342e'; c.lineWidth = 1.2; c.lineCap = 'round';
        [-4, -2, 0, 2, 4].forEach(dx => {
          c.beginPath();
          c.moveTo(ex + dx, 15.5);
          c.lineTo(ex + dx - 0.8, 13);
          c.stroke();
        });
      });
    }

    // ── BLUSH CIRCLES ─────────────────────────────────────────────────────
    if (eyeState !== 'dead') {
      c.fillStyle = 'rgba(255,120,100,0.28)';
      c.beginPath(); c.ellipse(14, 29, 6.5, 4, 0, 0, Math.PI * 2); c.fill();
      c.beginPath(); c.ellipse(50, 29, 6.5, 4, 0, 0, Math.PI * 2); c.fill();
    }

    // ── MUZZLE (big, soft, clearly cow) ───────────────────────────────────
    // Muzzle shadow
    c.fillStyle = 'rgba(0,0,0,0.07)';
    c.beginPath(); c.ellipse(cx + 1, 34, 12, 8.5, 0, 0, Math.PI * 2); c.fill();
    // Muzzle with gradient
    const muzzG = c.createRadialGradient(cx - 3, 29, 2, cx, 33, 11);
    muzzG.addColorStop(0, '#ffd5b8');
    muzzG.addColorStop(1, '#f5a88a');
    c.fillStyle = muzzG;
    c.beginPath(); c.ellipse(cx, 33, 11, 8, 0, 0, Math.PI * 2); c.fill();
    // Muzzle highlight
    c.fillStyle = 'rgba(255,255,255,0.35)';
    c.beginPath(); c.ellipse(cx - 3, 29, 5, 3, -0.3, 0, Math.PI * 2); c.fill();
    // Nostrils
    c.fillStyle = '#c07050';
    c.beginPath(); c.ellipse(cx - 4, 34, 2.8, 2, 0.15, 0, Math.PI * 2); c.fill();
    c.beginPath(); c.ellipse(cx + 4, 34, 2.8, 2, -0.15, 0, Math.PI * 2); c.fill();

    // ── MOUTH / EXPRESSION ────────────────────────────────────────────────
    c.strokeStyle = '#c07050'; c.lineWidth = 1.5; c.lineCap = 'round';
    if (eyeState === 'dead') {
      // Sad frown
      c.beginPath(); c.arc(cx, 42, 5, 0.15, Math.PI - 0.15, true); c.stroke();
    } else if (eating) {
      // Open mouth
      c.beginPath(); c.arc(cx, 39, 5, 0.1, Math.PI - 0.1); c.stroke();
      // Grass hanging from mouth
      c.fillStyle = '#4caf50';
      c.fillRect(cx - 2, 42, 16, 3);
      c.fillRect(cx, 45, 12, 3);
      c.fillStyle = '#66bb6a';
      c.fillRect(cx, 43, 5, 2);
      c.fillRect(cx + 7, 43, 5, 2);
    } else {
      // Happy smile
      c.beginPath(); c.arc(cx, 39, 5, 0.1, Math.PI - 0.1); c.stroke();
    }
  }

  create() {
    this.scene.start('WorldScene');
  }
}
