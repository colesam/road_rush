// Create interface that combines needed methods/properties from both sprites and images
export interface GameObject
  extends Phaser.GameObjects.GameObject,
    Phaser.GameObjects.Components.Alpha,
    Phaser.GameObjects.Components.Transform {}

export default class PhaserGameObject {
  public static readonly key = "PhaserGameObject";

  public readonly key = PhaserGameObject.key;

  public interactive = false;

  constructor(public gameObject: GameObject) {}
}
