import * as PIXI from "pixi.js";

class Player {
  constructor(playerData) {
    this.name = playerData.name;
    this.spriteSheetPath = "./assets/wizard.png";
    this.sprite = this.createAnimatedSprite();
    this.move(playerData.x, playerData.y);
  }

  createAnimatedSprite() {
    const baseTexture = PIXI.BaseTexture.from(this.spriteSheetPath);
    const textures = this.createTexturesFromSpritesheet(baseTexture);
    const animatedSprite = new PIXI.AnimatedSprite(textures);
    animatedSprite.animationSpeed = 0.1;
    animatedSprite.play();
    return animatedSprite;
  }

  createTexturesFromSpritesheet(baseTexture) {
    const textures = [];
    const frameSize = 64;
    const framesPerRow = 4;

    for (let i = 0; i < framesPerRow; i++) {
      let rectangle = new PIXI.Rectangle(
        i * frameSize,
        0,
        frameSize,
        frameSize
      );
      let texture = new PIXI.Texture(baseTexture, rectangle);
      textures.push(texture);
    }

    return textures;
  }

  move(x, y) {
    this.sprite.x = x;
    this.sprite.y = y;
  }
}

export default Player;
