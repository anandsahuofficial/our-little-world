export default class Moo {
  constructor(scene, x, y, mooState) {
    this.scene    = scene;
    this.mooState = mooState;
    this.isNearPlayer = false;
    this.isDead   = false;
    this.isSleeping = false;

    // Sprite (larger scale to fit new 50×32 texture)
    this.sprite = scene.add.sprite(x, y, 'moo')
      .setScale(2.0)
      .setDepth(y);

    // Blink animation
    scene.anims.create({
      key: 'moo_idle_anim',
      frames: [
        { key: 'moo' }, { key: 'moo' }, { key: 'moo' }, { key: 'moo_blink' },
      ],
      frameRate: 1.2,
      repeat: -1,
    });
    this.sprite.play('moo_idle_anim');

    // Gentle idle bob
    this.idleBob = scene.tweens.add({
      targets: this.sprite, y: y + 3,
      duration: 1800, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
    });

    // "!" proximity indicator
    this.indicator = scene.add.text(x, y - 55, '!', {
      fontSize: '18px', color: '#ffffff',
      stroke: '#444444', strokeThickness: 3,
      fontFamily: 'Arial, sans-serif', fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(9500).setVisible(false).setAlpha(0);

    // Name tag
    this.nameTag = scene.add.text(x, y - 44, 'Moo', {
      fontSize: '9px', color: '#ffe082',
      stroke: '#000000', strokeThickness: 3,
      fontFamily: 'Arial, sans-serif',
    }).setOrigin(0.5, 1).setDepth(9501);

    // Sleeping "z z z" text
    this.zzzText = scene.add.text(x + 22, y - 30, 'z z z', {
      fontSize: '10px', color: '#b0bec5',
      stroke: '#000000', strokeThickness: 2,
      fontFamily: 'Arial, sans-serif', fontStyle: 'italic',
    }).setOrigin(0).setDepth(9502).setVisible(false);

    // Dead state overlay text (hidden initially)
    this.deadMsg = null;

    // Wander bounds
    this.bounds = { x1: 565, y1: 425, x2: 875, y2: 490 };

    // Enter appropriate state
    if (mooState.dead) {
      this._enterDeadState();
    } else {
      this.scheduleWander();
    }
  }

  // ── wander ─────────────────────────────────────────────────────────────────

  scheduleWander() {
    if (this.isDead || this.isSleeping || this.isInteracting) return;
    const delay = 2500 + Math.floor(Math.random() * 3500);
    this.wanderTimer = this.scene.time.delayedCall(delay, () => {
      if (!this.isDead && !this.isSleeping) this.doWander();
    });
  }

  doWander() {
    const { x1, y1, x2, y2 } = this.bounds;
    const tx = x1 + Math.random() * (x2 - x1);
    const ty = y1 + Math.random() * (y2 - y1);
    const dist = Phaser.Math.Distance.Between(this.sprite.x, this.sprite.y, tx, ty);

    this.sprite.setFlipX(tx < this.sprite.x);
    if (this.idleBob) this.idleBob.pause();

    this.scene.tweens.add({
      targets: this.sprite, x: tx, y: ty,
      duration: Math.max(1000, (dist / 35) * 1000),
      ease: 'Sine.easeInOut',
      onComplete: () => {
        this.sprite.setFlipX(false);
        if (this.idleBob) this.idleBob.resume();
        if (Math.random() < 0.4) {
          this.sprite.stop();
          this.sprite.setTexture('moo_eat');
          this.scene.time.delayedCall(2200, () => {
            if (!this.isDead && !this.isSleeping) this.sprite.play('moo_idle_anim');
          });
        }
        this.scheduleWander();
      },
    });
  }

  // ── state checks ───────────────────────────────────────────────────────────

  checkSleepState() {
    const shouldSleep = this.mooState.energy < 25;
    if (shouldSleep && !this.isSleeping) {
      this.isSleeping = true;
      if (this.wanderTimer) this.wanderTimer.remove();
      this.sprite.stop();
      this.sprite.setTexture('moo_eat');
      this.zzzText.setVisible(true);
      this.scene.tweens.add({
        targets: this.zzzText, y: this.zzzText.y - 6, alpha: 0.6,
        duration: 1200, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
      });
    } else if (!shouldSleep && this.isSleeping) {
      this.isSleeping = false;
      this.scene.tweens.killTweensOf(this.zzzText);
      this.zzzText.setVisible(false).setAlpha(1);
      this.sprite.play('moo_idle_anim');
      this.scheduleWander();
    }
  }

  // ── death / revival ────────────────────────────────────────────────────────

  _enterDeadState() {
    this.isDead = true;
    if (this.wanderTimer) this.wanderTimer.remove();
    this.scene.tweens.killTweensOf(this.sprite);
    if (this.idleBob) this.idleBob.stop();

    this.sprite.stop();
    this.sprite.setTexture('moo_dead');
    this.sprite.setAngle(90);   // lying on side

    // Sad flowers around Moo
    const sx = this.sprite.x, sy = this.sprite.y;
    [{x:-28,y:-8},{x:28,y:-8},{x:0,y:18},{x:-18,y:14},{x:18,y:14}].forEach(o => {
      this.scene.add.image(sx + o.x, sy + o.y, 'flower')
        .setDepth(sy + 5).setScale(1.2);
    });

    // Urgency message above
    this.deadMsg = this.scene.add.text(sx, sy - 65,
      'Moo is starving!\nTap her to feed & revive', {
        fontSize: '11px', color: '#ff7043',
        stroke: '#000000', strokeThickness: 3,
        fontFamily: 'Arial, sans-serif', align: 'center',
      }).setOrigin(0.5).setDepth(9999);

    // Pulse the message
    this.scene.tweens.add({
      targets: this.deadMsg, alpha: 0.5,
      duration: 800, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
    });
  }

  _revive(sfx) {
    const m = this.mooState;
    m.dead      = false;
    m.lastFed   = Date.now();
    m.hunger    = 80;
    m.happiness = 55;
    m.energy    = 60;
    this.isDead = false;

    if (sfx) { sfx.play('nom'); sfx.play('happy'); }

    if (this.deadMsg) { this.deadMsg.destroy(); this.deadMsg = null; }
    this.sprite.setAngle(0);
    this.sprite.play('moo_idle_anim');
    this.idleBob = this.scene.tweens.add({
      targets: this.sprite, y: this.sprite.y + 3,
      duration: 1800, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
    });

    // Revival hearts
    for (let i = 0; i < 6; i++) {
      this.scene.time.delayedCall(i * 180, () => this.floatText('<3', '#ff69b4'));
    }

    this.scene.registry.set('mooStats', { ...m });
    this.scheduleWander();
  }

  // ── proximity ──────────────────────────────────────────────────────────────

  setNearPlayer(near) {
    if (near === this.isNearPlayer) return;
    this.isNearPlayer = near;

    if (near) {
      const label = this.isDead ? '! revive' : '!';
      this.indicator.setText(label).setVisible(true);
      this.scene.tweens.killTweensOf(this.indicator);
      this.scene.tweens.add({ targets: this.indicator, alpha: 1, duration: 250, ease: 'Back.Out' });
      this.indicatorPulse = this.scene.tweens.add({
        targets: this.indicator, scaleY: 1.35,
        duration: 500, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
      });
    } else {
      if (this.indicatorPulse) { this.indicatorPulse.stop(); this.indicatorPulse = null; }
      this.scene.tweens.add({
        targets: this.indicator, alpha: 0, duration: 200,
        onComplete: () => this.indicator.setVisible(false).setScale(1),
      });
    }
  }

  // ── actions ────────────────────────────────────────────────────────────────

  // Returns true if action succeeded
  react(action) {
    const m   = this.mooState;
    const sfx = this.scene.registry.get('sfx');

    // Revival path — only feed works when dead
    if (this.isDead) {
      if (action === 'feed') this._revive(sfx);
      return true;
    }

    if (action === 'feed') {
      m.hunger    = Math.min(100, m.hunger + 35);
      m.happiness = Math.min(100, m.happiness + 10);
      m.lastFed   = Date.now();   // reset the 4-hour death clock
      this.floatText('<3 nom nom!', '#ff9800');
      this.quickBob();
      if (sfx) { sfx.play('nom'); sfx.play('moo'); }

    } else if (action === 'pet') {
      m.happiness = Math.min(100, m.happiness + 25);
      m.energy    = Math.min(100, m.energy + 5);
      this.floatText('~*~ :)', '#f48fb1');
      if (sfx) sfx.play('happy');
      this.scene.tweens.add({
        targets: this.sprite, angle: -8, duration: 120, yoyo: true, repeat: 4, ease: 'Sine',
        onComplete: () => this.sprite.setAngle(0),
      });

    } else if (action === 'play') {
      if (m.energy < 20) {
        this.floatText('Too sleepy...', '#90a4ae');
        return false;
      }
      m.happiness = Math.min(100, m.happiness + 20);
      m.energy    = Math.max(0,  m.energy - 20);
      this.floatText('Wheee! *hop*', '#66bb6a');
      if (sfx) sfx.play('happy');
      this.scene.tweens.add({
        targets: this.sprite, scaleY: 1.6, scaleX: 2.4,
        duration: 140, yoyo: true, repeat: 3, ease: 'Cubic.Out',
        onComplete: () => this.sprite.setScale(2.0),
      });
    }

    this.checkSleepState();
    this.scene.registry.set('mooStats', { ...m });
    return true;
  }

  // ── helpers ────────────────────────────────────────────────────────────────

  floatText(text, color) {
    const t = this.scene.add.text(this.sprite.x, this.sprite.y - 36, text, {
      fontSize: '13px', color,
      stroke: '#000000', strokeThickness: 2,
      fontFamily: 'Arial, sans-serif',
    }).setOrigin(0.5).setDepth(10000);
    this.scene.tweens.add({
      targets: t, y: this.sprite.y - 90, alpha: 0,
      duration: 1200, ease: 'Cubic.Out',
      onComplete: () => t.destroy(),
    });
  }

  quickBob() {
    this.scene.tweens.add({
      targets: this.sprite, y: this.sprite.y - 10,
      duration: 180, yoyo: true, ease: 'Cubic.Out',
    });
  }

  update() {
    const sx = this.sprite.x, sy = this.sprite.y;
    this.indicator.setPosition(sx, sy - 58);
    this.nameTag.setPosition(sx, sy - 46);
    this.zzzText.setPosition(sx + 22, sy - 30);
    if (this.deadMsg) this.deadMsg.setPosition(sx, sy - 65);
    this.sprite.setDepth(sy);
    this.nameTag.setDepth(sy + 1);
    this.indicator.setDepth(sy + 2);
    if (this.deadMsg) this.deadMsg.setDepth(sy + 3);
  }
}
