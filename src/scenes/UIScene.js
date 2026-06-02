export default class UIScene extends Phaser.Scene {
  constructor() { super({ key: 'UIScene' }); }

  create() {
    this.menuVisible = false;

    this.createStatsPanel();
    this.createActionMenu();

    this.game.events.on('moo-interact', this.showMenu, this);
  }

  createStatsPanel() {
    const px = 10, py = 10, pw = 148, ph = 80;

    // Background
    const bg = this.add.graphics();
    bg.fillStyle(0x000000, 0.55);
    bg.fillRoundedRect(px, py, pw, ph, 8);

    this.add.text(px + pw / 2, py + 10, '~ Moo ~', {
      fontSize: '11px',
      color: '#ffd54f',
      fontFamily: 'Georgia, serif',
      fontStyle: 'italic',
    }).setOrigin(0.5, 0.5);

    const labelStyle = { fontSize: '8px', color: '#e0e0e0', fontFamily: 'Arial, sans-serif' };
    const barYs = [py + 28, py + 46, py + 64];

    this.add.text(px + 6, barYs[0], 'Hunger', labelStyle).setOrigin(0, 0.5);
    this.add.text(px + 6, barYs[1], 'Happy',  labelStyle).setOrigin(0, 0.5);
    this.add.text(px + 6, barYs[2], 'Energy', labelStyle).setOrigin(0, 0.5);

    // Bar backgrounds
    const barBg = this.add.graphics();
    barBg.fillStyle(0x333333, 0.9);
    barYs.forEach(by => barBg.fillRect(px + 52, by - 5, 90, 10));

    // Dynamic bar fills — redrawn each update
    this.barFills = this.add.graphics();
    this.barX  = px + 52;
    this.barYs = barYs;

    // Color config per stat
    this.barColors = [
      { high: 0xff7043, mid: 0xffb74d, low: 0xef5350 },  // hunger  — orange theme
      { high: 0xec407a, mid: 0xffb74d, low: 0xef5350 },  // happy   — pink theme
      { high: 0x42a5f5, mid: 0xffb74d, low: 0xef5350 },  // energy  — blue theme
    ];
  }

  createActionMenu() {
    const sw = this.scale.width;
    const sh = this.scale.height;
    const mw = 290, mh = 112;
    const mx = (sw - mw) / 2;
    const my = sh - mh - 22;

    this.menuGroup = this.add.group();

    // Tap-outside blocker
    this.blocker = this.add.rectangle(sw / 2, sh / 2, sw, sh, 0x000000, 0.01)
      .setInteractive()
      .setVisible(false);
    this.blocker.on('pointerdown', () => this.hideMenu());

    // Panel
    const panel = this.add.graphics();
    panel.fillStyle(0x111111, 0.82);
    panel.fillRoundedRect(mx, my, mw, mh, 10);
    this.menuGroup.add(panel);

    this.add.text(sw / 2, my + 16, 'Care for Moo:', {
      fontSize: '13px',
      color: '#ffd54f',
      fontFamily: 'Georgia, serif',
    }).setOrigin(0.5);

    // Action buttons
    const btnY  = my + 72;
    const btns  = [
      { label: 'Feed', action: 'feed', color: 0xe65100, x: sw / 2 - 94 },
      { label: 'Pet',  action: 'pet',  color: 0xad1457, x: sw / 2      },
      { label: 'Play', action: 'play', color: 0x1565c0, x: sw / 2 + 94 },
    ];

    btns.forEach(b => {
      const rect = this.add.rectangle(b.x, btnY, 82, 34, b.color, 1)
        .setInteractive({ useHandCursor: true });
      const lbl = this.add.text(b.x, btnY, b.label, {
        fontSize: '13px',
        color: '#ffffff',
        fontStyle: 'bold',
        fontFamily: 'Arial, sans-serif',
      }).setOrigin(0.5);

      rect.on('pointerover', () => rect.setAlpha(0.75));
      rect.on('pointerout',  () => rect.setAlpha(1));
      rect.on('pointerdown', () => {
        const sfx = this.registry.get('sfx');
        if (sfx) { sfx.unlock(); sfx.play('click'); }
        this.game.events.emit('moo-action', { action: b.action });
        this.hideMenu();
      });

      this.menuGroup.add(rect);
      this.menuGroup.add(lbl);
    });

    // Close (x) button
    const closeBtn = this.add.text(mx + mw - 10, my + 8, 'x', {
      fontSize: '14px',
      color: '#888888',
      fontFamily: 'Arial, sans-serif',
    }).setOrigin(1, 0).setInteractive({ useHandCursor: true });
    closeBtn.on('pointerdown', () => this.hideMenu());
    this.menuGroup.add(closeBtn);

    this.menuGroup.setVisible(false);
  }

  showMenu() {
    if (this.menuVisible) return;
    this.menuVisible = true;
    this.blocker.setVisible(true);
    this.menuGroup.setVisible(true);
    this.menuGroup.getChildren().forEach(obj => {
      obj.setAlpha(0);
      this.tweens.add({ targets: obj, alpha: 1, duration: 180 });
    });
  }

  hideMenu() {
    if (!this.menuVisible) return;
    this.menuVisible = false;
    this.blocker.setVisible(false);
    const children = this.menuGroup.getChildren();
    let done = 0;
    children.forEach(obj => {
      this.tweens.add({
        targets: obj,
        alpha: 0,
        duration: 130,
        onComplete: () => {
          done++;
          if (done === children.length) this.menuGroup.setVisible(false);
        },
      });
    });
  }

  update() {
    const stats = this.registry.get('mooStats');
    if (!stats) return;

    this.barFills.clear();

    const vals = [stats.hunger, stats.happiness, stats.energy];
    vals.forEach((v, i) => {
      const c = this.barColors[i];
      const color = v <= 30 ? c.low : v <= 60 ? c.mid : c.high;
      const w = Math.max(2, (v / 100) * 90);
      this.barFills.fillStyle(color, 1);
      this.barFills.fillRect(this.barX, this.barYs[i] - 5, w, 10);
    });
  }

  shutdown() {
    this.game.events.off('moo-interact', this.showMenu, this);
  }
}
