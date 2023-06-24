const p2 = require("p2");
const Player = require("./player.js");

class Game {
  constructor() {
    this.players = {};
    this.world = new p2.World({ gravity: [0, 0] });
    this.gravity = 0;
    // this.world.step(1 / 60);
  }

  addPlayer(playerData) {
    const { id, name, playerClass, canvasWidth, canvasHeight } = playerData;
    const player = new Player(
      id,
      name,
      playerClass,
      canvasWidth / 2,
      canvasHeight / 2
    );

    this.players[player.id] = player;
    this.world.addBody(player.body);
  }

  removePlayer(id) {
    if (!this.players[id]) return;
    this.world.removeBody(this.players[id].body);
    delete this.players[id];
  }

  getNetworkPlayers() {
    return Object.values(this.players).map((player) => ({
      id: player.id,
      name: player.name,
      playerClass: player.playerClass,
      x: player.x,
      y: player.y,
    }));
  }

  // add other methods here as needed
  updatePhysics() {
    this.world.step(1 / 60); // step the physics simulation forward
    // update players positions from physics bodies
    for (let id in this.players) {
      this.players[id].x = this.players[id].body.position[0];
      this.players[id].y = this.players[id].body.position[1];
    }
  }
}

module.exports = Game;
