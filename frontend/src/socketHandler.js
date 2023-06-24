class SocketHandler {
    constructor(game) {
        this.game = game;
        this.socket = io("http://localhost:3000", {withCredentials: true});
        this.keysDown = {};
        this.setupSocket();

    }
}
