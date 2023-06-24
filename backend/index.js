const { io, server } = require("./server.js");
const Game = require("./game-structs/game.js");
const SocketHandler = require("./game-structs/socketHandler.js");

const game = new Game();
const port = 3000;
server.listen(port, () => {
  new SocketHandler(io, game);
  console.log(`Server listening on port ${port}`);
});
