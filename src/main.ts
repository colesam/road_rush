import Phaser from "phaser";
import MainScene from "@/scene/MainScene";

let game: Phaser.Game | null = null;

window.onload = function() {
  const config = {
    type: Phaser.AUTO,
    width: 480,
    height: 640,
    parent: "phaser-game",
    scene: [MainScene],
  };

  game = new Phaser.Game(config);

  console.log(game);
};
