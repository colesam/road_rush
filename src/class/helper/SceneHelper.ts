export default {
  dimensions: (
    scene: Phaser.Scene
  ): { gameWidth: number; gameHeight: number } => ({
    gameWidth: +scene.game.config.width,
    gameHeight: +scene.game.config.height
  })
};
