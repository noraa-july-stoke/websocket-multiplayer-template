// Player.js
const p2 = require("p2");

class Player {
  constructor(id, name, playerClass, x = 0, y = 0) {
    this.id = id;
    this.name = name;
    this.playerClass = playerClass;
    this.x = x;
    this.y = y;
    this.speed = 200;
    this.speedMultiplier = 1;

    // Create physics body
    const boxShape = new p2.Box({ width: 1, height: 1 });
    this.body = new p2.Body({
      mass: 1,
      position: [x, y],
    });
    this.body.addShape(boxShape);
  }

  handleMovement(movementData) {
    const keysDown = movementData.keysDown;

    if (!keysDown) {
      this.body.velocity[0] = 0;
      this.body.velocity[1] = 0;
      return;
    } // return if no key is pressed

    this.body.velocity[0] = 0; // reset horizontal velocity
    this.body.velocity[1] = 0; // reset vertical velocity

    if (keysDown.w) {
      this.body.velocity[1] -= this.speed * this.speedMultiplier; // move up
    }
    if (keysDown.s) {
      this.body.velocity[1] += this.speed * this.speedMultiplier; // move down
    }
    if (keysDown.a) {
      this.body.velocity[0] -= this.speed * this.speedMultiplier; // move left
    }
    if (keysDown.d) {
      this.body.velocity[0] += this.speed * this.speedMultiplier; // move right
    }

    // Update the player's position
    this.x = this.body.position[0];
    this.y = this.body.position[1];
  }
}

module.exports = Player;
