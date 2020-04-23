import EventEmitter from "eventemitter3";
import System from "@System/System";
import EntityManager from "@Entity/EntityManager";
import Entity from "@Entity/Entity";
import Position from "@Component/Position";
import PhaserGameObject from "@Component/PhaserGameObject";

/**
 * Update the rendered position of PhaserGameObject components based off of the
 * entity's Position component.
 *
 * NOTE: This system is dependent on the Phaser framework and can only be used
 * client side.
 */
export default class PositionSystem implements System {
  constructor(
    public entityManager: EntityManager,
    public eventEmitter: EventEmitter
  ) {}

  protected getEntities(): Entity[] {
    return this.entityManager.getEntities((entity) => {
      return entity.has([Position]);
    });
  }

  public update(): void {
    const entities = this.getEntities();

    entities.forEach((entity) => {
      const { x, y } = entity.get(Position);

      if (entity.has(PhaserGameObject)) {
        const { gameObject }: PhaserGameObject = entity.get(PhaserGameObject);
        gameObject.x = x;
        gameObject.y = y;
      }
    });
  }
}
