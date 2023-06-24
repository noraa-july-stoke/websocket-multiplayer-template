import * as PIXI from "pixi.js";
import io from "socket.io-client";
import Player from "./player.js";

class Game {
  constructor() {
    this.players = {};
    this.socket = io("http://localhost:3000", { withCredentials: true });
    this.keysDown = {};

    this.setupPixi();
    this.setupSocket();
    this.setupEventListeners();
    this.startSendingMovementData();
  }

  setupPixi() {
    this.app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundAlpha: 0,
      backgroundColor: 0x000000,
    });
    document.querySelector(".scene").appendChild(this.app.view);
  }

  setupSocket() {
    this.socket.on("updatePlayers", this.updatePlayers.bind(this));
    this.socket.on("playerMoved", this.movePlayer.bind(this));
    this.socket.on("playerDisconnected", this.removePlayer.bind(this));
  }

  setupEventListeners() {
    window.addEventListener("keydown", (event) => {
      this.keysDown[event.key] = true;
      this.currentDirection = event.key;
    });

    window.addEventListener("keyup", (event) => {
      this.keysDown[event.key] = false;
      if (this.currentDirection === event.key) this.currentDirection = null;
    });

    document
      .getElementById("nameForm")
      .addEventListener("submit", this.joinGame.bind(this));
  }

  joinGame(event) {
    event.preventDefault();
    const name = document.getElementById("nameInput").value;
    const playerClass = document.getElementById("classInput").value;
    const canvasWidth = this.app.view.width;
    const canvasHeight = this.app.view.height;
    this.socket.emit("joinGame", {
      name,
      playerClass,
      canvasWidth,
      canvasHeight,
    });
    document.getElementById("nameForm").style.display = "none";
  }

  startSendingMovementData() {
    setInterval(() => {
      // Send all keysDown instead of just the currentDirection
      const movementData = {
        id: this.socket.id,
        keysDown: this.keysDown,
      };
      this.socket.emit("playerMovement", movementData);
    }, 50); // send movement data 20 times per second
  }

  updatePlayers(players) {
    Object.entries(players).forEach(([id, player]) => {
      if (!this.players[id]) {
        this.addNewPlayer(player);
      } else {
        this.players[id].move(player.x, player.y);
      }
    });
  }

  addNewPlayer(playerData) {
    if (!this.players[playerData.id]) {
      this.players[playerData.id] = new Player(playerData);
      this.app.stage.addChild(this.players[playerData.id].sprite);
    }
  }

  movePlayer(movementData) {
    const player = this.players[movementData.id];
    if (player) {
      player.move(movementData.x, movementData.y);
    }
  }

  removePlayer(playerId) {
    this.app.stage.removeChild(this.players[playerId].sprite);
    delete this.players[playerId];
  }
}


document.addEventListener("DOMContentLoaded", () => new Game());
