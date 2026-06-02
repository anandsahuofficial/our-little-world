export default class Duck {
  constructor(scene, x, y, sfx) {
    this.scene  = scene;
    this.sfx    = sfx;
    this.homeX  = x;
    this.homeY  = y;
    this.isScattered = false;
    this.quackCooldown = 0;
    this.feedCooldown  = 0;

    this.sprite = scene.add.image(x, y, 'duck').setDepth(501);

    this.bobTween = this._startBob();
  }

  _startBob() {
    return this.scene.tweens.add({
      targets: this.sprite,
      y: this.sprite.y + 4,
      duration: 1200 + Math.floor(this.homeX * 0.31) % 400,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  // Called every frame from WorldScene.update()
  update(px, py) {
    if (this.quackCooldown > 0) this.quackCooldown--;
    if (this.feedCooldown  > 0) this.feedCooldown--;

    const dist = Phaser.Math.Distance.Between(px, py, this.sprite.x, this.sprite.y);

    // Scatter if player gets too close
    if (dist < 60 && !this.isScattered) {
      this._scatter(px, py);
    }

    // Random quack when player is approaching (not already scattered)
    if (dist < 130 && !this.isScattered && this.quackCooldown === 0) {
      if (Math.random() < 0.012) {
        this._quack();
        this.quackCooldown = 110;
      }
    }

    // Return home when player walks away
    if (dist > 260 && this.isScattered) {
      this._returnHome();
    }
  }

  // Player tapped near this duck
  feed() {
    if (this.feedCooldown > 0) return;
    this.feedCooldown = 90;

    this._quack();
    if (this.sfx) this.sfx.play('nom');

    // Excited bob
    this.scene.tweens.killTweensOf(this.sprite);
    this.scene.tweens.add({
      targets: this.sprite,
      scaleY: 1.5, scaleX: 0.75,
      duration: 120,
      yoyo: true,
      repeat: 3,
      ease: 'Cubic.Out',
      onComplete: () => {
        this.sprite.setScale(1);
        if (!this.isScattered) this.bobTween = this._startBob();
      },
    });

    // Drift slightly toward player position (attracted by bread)
    const angle = Math.atan2(
      this.scene.player.sprite.y - this.sprite.y,
      this.scene.player.sprite.x - this.sprite.x
    );
    this.scene.tweens.add({
      targets: this.sprite,
      x: this.sprite.x + Math.cos(angle) * 25,
      y: this.sprite.y + Math.sin(angle) * 20,
      duration: 600,
      ease: 'Sine.easeOut',
    });

    this._floatText('nom!', '#ffeb3b');
  }

  _scatter(fromX, fromY) {
    this.isScattered = true;
    this.scene.tweens.killTweensOf(this.sprite);

    const angle = Math.atan2(this.sprite.y - fromY, this.sprite.x - fromX);
    const tx = Phaser.Math.Clamp(this.sprite.x + Math.cos(angle) * 90, 650, 1290);
    const ty = Phaser.Math.Clamp(this.sprite.y + Math.sin(angle) * 65, 520, 890);

    this._quack();

    // Wing-flap scale pulse
    this.scene.tweens.add({
      targets: this.sprite,
      scaleX: 1.4, scaleY: 0.65,
      duration: 90,
      yoyo: true,
      repeat: 4,
      ease: 'Sine',
    });

    this.scene.tweens.add({
      targets: this.sprite,
      x: tx, y: ty,
      duration: 650,
      ease: 'Cubic.Out',
    });
  }

  _returnHome() {
    this.isScattered = false;
    this.scene.tweens.killTweensOf(this.sprite);

    this.scene.tweens.add({
      targets: this.sprite,
      x: this.homeX,
      y: this.homeY,
      duration: 2200,
      ease: 'Sine.easeInOut',
      onComplete: () => { this.bobTween = this._startBob(); },
    });
  }

  _quack() {
    if (this.sfx) this.sfx.play('quack');
    this._floatText('quack!', '#ffffff');
  }

  _floatText(text, color) {
    const t = this.scene.add.text(this.sprite.x, this.sprite.y - 16, text, {
      fontSize: '9px',
      color,
      stroke: '#000000',
      strokeThickness: 2,
      fontFamily: 'Arial, sans-serif',
    }).setOrigin(0.5).setDepth(9000);

    this.scene.tweens.add({
      targets: t,
      y: t.y - 22,
      alpha: 0,
      duration: 900,
      ease: 'Cubic.Out',
      onComplete: () => t.destroy(),
    });
  }
}
