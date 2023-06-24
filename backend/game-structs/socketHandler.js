class SocketHandler {
  constructor(io, game) {
    this.io = io;
    this.game = game;
    this.connections = 0;
    this.setupSocketEvents();
    // Current game loop
    setInterval(() => {
      this.game.updatePhysics();
      const playersData = this.game.getNetworkPlayers();
      this.io.emit("updatePlayers", playersData);

      for (let id in this.game.players) {
        let player = this.game.players[id];
        this.io.emit("playerMoved", {
          id: player.id,
          x: player.x,
          y: player.y,
        });
      }
    }, 1000 / 60);
  }

  setupSocketEvents() {
    this.io.on("connection", (socket) => {
      this.connections += 1;
      socket.on("joinGame", (playerName, playerClass) => {
        this.handleJoinGame(socket, playerName, playerClass);
      });

      socket.on("playerMovement", (movementData) => {
        this.handlePlayerMovement(movementData);
      });

      socket.on("disconnect", () => {
        this.connections -= 1;
        this.handlePlayerDisconnect(socket);
      });
    });
  }

  handleJoinGame(socket, playerData) {
    playerData.id = socket.id;
    this.game.addPlayer(playerData);
    const playersData = this.game.getNetworkPlayers();
    this.io.emit("updatePlayers", playersData);
  }

  handlePlayerDisconnect(socket) {
    this.game.removePlayer(socket.id);
  }

  handlePlayerMovement(movementData) {
    const player = this.game.players[movementData.id];
    if (!player) return;
    player.handleMovement(movementData);
  }
}

module.exports = SocketHandler;
