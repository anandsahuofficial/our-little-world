export default class BootScene extends Phaser.Scene {
  constructor() { super({ key: 'BootScene' }); }

  preload() {
    this.makePlayerTexture();
    this.makeTreeTexture();
    this.makeFlowerTexture();
    this.makeBenchTexture();
    this.makeBridgeTexture();
    this.makeDuckTexture();
    this.drawMoo('moo',       false, false);
    this.drawMoo('moo_blink', true,  false);
    this.drawMoo('moo_eat',   false, true);
    this.makeReedTexture();
    this.makeShimmerTexture();
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
    const g = this.make.graphics({ add: false });

    // Trunk shadow
    g.fillStyle(0x5d4037);
    g.fillRect(11, 22, 8, 18);

    // Trunk
    g.fillStyle(0x795548);
    g.fillRect(9, 20, 8, 18);

    // Leaves — layered for depth
    g.fillStyle(0x1b5e20);
    g.fillCircle(13, 18, 14);
    g.fillStyle(0x2e7d32);
    g.fillCircle(11, 14, 12);
    g.fillStyle(0x388e3c);
    g.fillCircle(15, 11, 10);
    g.fillStyle(0x43a047);
    g.fillCircle(13, 8, 7);
    // Highlight
    g.fillStyle(0x66bb6a);
    g.fillCircle(11, 6, 4);

    g.generateTexture('tree', 28, 38);
    g.destroy();
  }

  makeFlowerTexture() {
    const g = this.make.graphics({ add: false });

    // Stem
    g.fillStyle(0x4caf50);
    g.fillRect(4, 8, 2, 6);

    // Petals (pink)
    g.fillStyle(0xff80ab);
    g.fillCircle(3, 5, 3);
    g.fillCircle(7, 5, 3);
    g.fillCircle(5, 3, 3);
    g.fillCircle(5, 7, 3);

    // Center (yellow)
    g.fillStyle(0xffeb3b);
    g.fillCircle(5, 5, 2);

    g.generateTexture('flower', 10, 14);
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
  drawMoo(key, blink, eating) {
    const g = this.make.graphics({ add: false });
    const headY = eating ? 16 : 13; // shift head down when grazing

    // Tail tuft
    g.fillStyle(0xcfbea0);
    g.fillRect(0, 10, 4, 3);
    g.fillStyle(0x8d7760);
    g.fillCircle(2, 8, 3);

    // Body
    g.fillStyle(0xfffde7);
    g.fillEllipse(18, 17, 28, 12);

    // Black spots
    g.fillStyle(0x212121);
    g.fillEllipse(11, 15, 8, 6);
    g.fillEllipse(20, 18, 6, 5);
    g.fillEllipse(15, 20, 7, 4);

    // Back legs
    g.fillStyle(0xfffde7);
    g.fillRect(6, 20, 4, 7);
    g.fillRect(13, 20, 4, 7);
    g.fillStyle(0x5d4037);
    g.fillRect(6, 24, 4, 3);
    g.fillRect(13, 24, 4, 3);

    // Front legs
    g.fillStyle(0xfffde7);
    g.fillRect(23, 20, 4, 7);
    g.fillRect(30, 20, 4, 7);
    g.fillStyle(0x5d4037);
    g.fillRect(23, 24, 4, 3);
    g.fillRect(30, 24, 4, 3);

    // Neck
    g.fillStyle(0xfffde7);
    g.fillRect(29, 11, 5, 9);

    // Head
    g.fillStyle(0xfffde7);
    g.fillEllipse(37, headY, 12, 14);

    // Ear
    g.fillStyle(0xfffde7);
    g.fillEllipse(33, headY - 8, 7, 6);
    g.fillStyle(0xffccbc);
    g.fillEllipse(33, headY - 7, 5, 4);

    // Horn (tiny)
    g.fillStyle(0xfff59d);
    g.fillRect(32, headY - 13, 2, 5);
    g.fillRect(34, headY - 14, 2, 4);

    // Eye
    if (blink) {
      g.fillStyle(0x5d4037);
      g.fillRect(34, headY - 2, 5, 2);
    } else {
      g.fillStyle(0x4e342e);
      g.fillEllipse(36, headY - 1, 5, 6);
      g.fillStyle(0xffffff);
      g.fillEllipse(35, headY - 2, 3, 4);
      g.fillStyle(0x212121);
      g.fillEllipse(35, headY - 1, 2, 3);
      g.fillStyle(0xffffff);
      g.fillRect(34, headY - 3, 1, 1);
    }

    // Nose
    g.fillStyle(0xf8bbd0);
    g.fillEllipse(41, headY + 4, 5, 3);
    g.fillStyle(0xf06292);
    g.fillRect(40, headY + 3, 1, 1);
    g.fillRect(42, headY + 3, 1, 1);

    // Bell
    g.fillStyle(0xffd54f);
    g.fillRect(30, 21, 3, 4);
    g.fillStyle(0xffb300);
    g.fillRect(31, 23, 2, 1);

    // Grass in mouth when eating
    if (eating) {
      g.fillStyle(0x66bb6a);
      g.fillRect(39, headY + 6, 5, 2);
      g.fillRect(37, headY + 7, 7, 2);
    }

    g.generateTexture(key, 44, 30);
    g.destroy();
  }

  create() {
    this.scene.start('WorldScene');
  }
}
