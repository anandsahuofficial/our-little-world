export default class Player {
  constructor(scene, x, y) {
    this.scene = scene;
    this.speed = 130;
    this.targetX = x;
    this.targetY = y;
    this.moving = false;

    this.sprite = scene.physics.add.sprite(x, y, 'player')
      .setScale(2.5)
      .setCollideWorldBounds(true)
      .setDepth(y);

    this.keys = scene.input.keyboard.addKeys({
      up:    Phaser.Input.Keyboard.KeyCodes.W,
      down:  Phaser.Input.Keyboard.KeyCodes.S,
      left:  Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      up2:    Phaser.Input.Keyboard.KeyCodes.UP,
      down2:  Phaser.Input.Keyboard.KeyCodes.DOWN,
      left2:  Phaser.Input.Keyboard.KeyCodes.LEFT,
      right2: Phaser.Input.Keyboard.KeyCodes.RIGHT,
    });
  }

  moveTo(x, y) {
    this.targetX = x;
    this.targetY = y;
    this.moving = true;
  }

  update() {
    const { sprite, keys, speed } = this;
    let vx = 0, vy = 0;

    if (keys.left.isDown || keys.left2.isDown)   { vx = -speed; this.moving = false; }
    else if (keys.right.isDown || keys.right2.isDown) { vx = speed; this.moving = false; }
    if (keys.up.isDown || keys.up2.isDown)     { vy = -speed; this.moving = false; }
    else if (keys.down.isDown || keys.down2.isDown)  { vy = speed; this.moving = false; }

    if (this.moving && vx === 0 && vy === 0) {
      const dx = this.targetX - sprite.x;
      const dy = this.targetY - sprite.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 6) {
        vx = (dx / dist) * speed;
        vy = (dy / dist) * speed;
      } else {
        this.moving = false;
        sprite.setVelocity(0, 0);
        return;
      }
    }

    sprite.setVelocity(vx, vy);

    // Depth sort: lower on screen = in front
    sprite.setDepth(sprite.y);

    if (vx < 0) sprite.setFlipX(true);
    else if (vx > 0) sprite.setFlipX(false);
  }
}
