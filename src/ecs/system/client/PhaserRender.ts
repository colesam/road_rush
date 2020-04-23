import EventEmitter from "eventemitter3";
import System from "@System/System";
import EntityManager from "@Entity/EntityManager";
import Entity from "@Entity/Entity";
import ImageAsset from "@Component/ImageAsset";
import SpriteAsset from "@Component/SpriteAsset";
import Position from "@Component/Position";
import PhaserGameObject from "@/ecs/component/PhaserGameObject";

/**
 * Replace an entity's ImageAsset component with a rendered PhaserGameObject
 * component.
 *
 * NOTE: This system is dependent on the Phaser framework and can only be used
 * client side.
 */
export default class PhaserRenderSystem implements System {
  constructor(
    public entityManager: EntityManager,
    public eventEmitter: EventEmitter,
    public scene: Phaser.Scene
  ) {}

  protected getEntities(): Entity[] {
    return this.entityManager.getEntities(
      (entity) => entity.has(ImageAsset) || entity.has(SpriteAsset)
    );
  }

  /**
   * TODO: Figure out how to combine sprites' and images' common behavior into
   * a single component to avoid duplicate logic.
   */
  public update(): void {
    const entities = this.getEntities();

    entities.forEach((entity) => {
      let x = 0;
      let y = 0;

      if (entity.has(Position)) {
        const position: Position = entity.get(Position);
        x = position.x;
        y = position.y;
      }

      // Convert image assets into game objects
      if (entity.has(ImageAsset)) {
        const imageAsset: ImageAsset = entity.get(ImageAsset);

        entity.addComponent(
          new PhaserGameObject(this.scene.add.image(x, y, imageAsset.assetKey))
        );

        entity.removeComponent(ImageAsset);
      }

      // Convert sprite assets into game objects
      if (entity.has(SpriteAsset)) {
        const spriteAsset: SpriteAsset = entity.get(SpriteAsset);

        entity.addComponent(
          new PhaserGameObject(
            this.scene.add.sprite(x, y, spriteAsset.assetKey)
          )
        );
      }
    });
  }
}
