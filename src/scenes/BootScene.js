export default class BootScene extends Phaser.Scene {
  constructor() { super({ key: 'BootScene' }); }

  preload() {
    this.makePlayerTexture();
    this.makeTreeTexture();
    this.makeFlowerTexture();
    this.makeBenchTexture();
    this.makeBridgeTexture();
    this.makeDuckTexture();
    this.drawMoo('moo',       'open',  false);
    this.drawMoo('moo_blink', 'blink', false);
    this.drawMoo('moo_eat',   'open',  true);
    this.drawMoo('moo_dead',  'dead',  false);
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
  // eyeState: 'open' | 'blink' | 'dead'
  drawMoo(key, eyeState, eating) {
    const g  = this.make.graphics({ add: false });
    const W  = 50, H = 32;
    const hs = eating ? 3 : 0; // head shifts down when grazing

    // ── TAIL ────────────────────────────────────────────────────────────────
    g.fillStyle(0xcdc0a0);
    g.fillRect(1, 12, 4, 3);
    g.fillStyle(0x6d4c41);
    g.fillCircle(2, 10, 3);

    // ── BODY (wide, blocky Holstein shape) ──────────────────────────────────
    g.fillStyle(0xfffde7);
    g.fillEllipse(19, 18, 34, 14);

    // ── SPOTS (large, clearly Holstein) ─────────────────────────────────────
    g.fillStyle(0x212121);
    g.fillEllipse(11, 14, 13, 9);
    g.fillEllipse(23, 20, 9, 7);
    g.fillEllipse(16, 23, 11, 5);

    // ── BACK LEGS ────────────────────────────────────────────────────────────
    g.fillStyle(0xfffde7);
    g.fillRect(6,  21, 5, 9);
    g.fillRect(13, 21, 5, 9);
    g.fillStyle(0x4e342e);
    g.fillRect(6,  27, 5, 3);
    g.fillRect(13, 27, 5, 3);

    // ── FRONT LEGS ───────────────────────────────────────────────────────────
    g.fillStyle(0xfffde7);
    g.fillRect(27, 21, 5, 9);
    g.fillRect(33, 21, 5, 9);
    g.fillStyle(0x4e342e);
    g.fillRect(27, 27, 5, 3);
    g.fillRect(33, 27, 5, 3);

    // ── NECK (short, wide) ───────────────────────────────────────────────────
    g.fillStyle(0xfffde7);
    g.fillRect(33, 12 + hs, 6, 11);

    // ── HEAD: rectangular (wider than tall) — this is the key cow shape ──────
    // A rabbit head is round/oval; a cow head is wide and blocky.
    g.fillStyle(0xfffde7);
    g.fillRect(33, 8 + hs, 13, 13);     // main head block
    g.fillCircle(33, 8  + hs, 4);       // rounded back-top corner
    g.fillCircle(33, 20 + hs, 4);       // rounded back-bottom corner

    // ── EAR: wide flat oval sticking out to the SIDE (NOT tall = NOT rabbit) ─
    // Width (14) >> Height (8) — the key visual fix that makes it look like a cow
    g.fillStyle(0xfffde7);
    g.fillEllipse(36, 5 + hs, 14, 8);   // outer ear — wide, flat
    g.fillStyle(0xf4988a);
    g.fillEllipse(36, 6 + hs, 9,  5);   // pink inner

    // ── HORNS: two small stubs on top of forehead ────────────────────────────
    g.fillStyle(0xffc107);
    g.fillRect(38, 2 + hs, 3, 5);
    g.fillRect(42, 2 + hs, 3, 5);

    // ── EYE ──────────────────────────────────────────────────────────────────
    if (eyeState === 'blink') {
      g.fillStyle(0x5d4037);
      g.fillRect(37, 13 + hs, 7, 2);    // closed lid

    } else if (eyeState === 'dead') {
      // Pixel-art X eyes
      g.fillStyle(0x4e342e);
      g.fillRect(37, 11 + hs, 2, 2); g.fillRect(42, 11 + hs, 2, 2);
      g.fillRect(39, 13 + hs, 2, 2);
      g.fillRect(37, 15 + hs, 2, 2); g.fillRect(42, 15 + hs, 2, 2);

    } else {
      // Normal large expressive eye
      g.fillStyle(0x3e2723);
      g.fillCircle(41, 13 + hs, 4);
      g.fillStyle(0xffffff);
      g.fillCircle(40, 12 + hs, 2);
      g.fillStyle(0x212121);
      g.fillCircle(40, 13 + hs, 1);
      g.fillStyle(0xffffff);
      g.fillRect(39, 11 + hs, 1, 1);
    }

    // ── MUZZLE: the defining cow feature — wide pinkish square protrusion ─────
    // This clearly differentiates from rabbit (which has a small pointed nose).
    g.fillStyle(0xf5c0a8);
    g.fillRect(44, 12 + hs, 6, 9);      // rectangular muzzle block
    g.fillCircle(47, 20 + hs, 3);       // rounded chin

    // Nostrils — two clear dark holes on the muzzle
    g.fillStyle(0xa0522d);
    g.fillCircle(45, 15 + hs, 1);
    g.fillCircle(48, 15 + hs, 1);

    // Mouth line
    g.fillStyle(0x9e5030);
    g.fillRect(44, 19 + hs, 6, 1);

    // ── GRASS IN MOUTH (eating variant) ──────────────────────────────────────
    if (eating) {
      g.fillStyle(0x558b2f);
      g.fillRect(44, 18 + hs, 6, 2);
      g.fillRect(43, 20 + hs, 7, 2);
    }

    // ── COWBELL ──────────────────────────────────────────────────────────────
    g.fillStyle(0xffd54f);
    g.fillRect(35, 22, 4, 5);
    g.fillStyle(0xffb300);
    g.fillRect(36, 24, 2, 2);

    g.generateTexture(key, W, H);
    g.destroy();
  }

  create() {
    this.scene.start('WorldScene');
  }
}
