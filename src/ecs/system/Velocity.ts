import EventEmitter from "eventemitter3";
import System from "@System/System";
import EntityManager from "@Entity/EntityManager";
import Entity from "@Entity/Entity";
import Position from "@Component/Position";
import Velocity from "@Component/Velocity";

/**
 * Adjust an entity's position based off of its velocity component.
 *
 * NOTE: This system is dependent on the Phaser framework and can only be used
 * client side.
 */
export default class VelocitySystem implements System {
  constructor(
    public entityManager: EntityManager,
    public eventEmitter: EventEmitter
  ) {}

  public update(): void {
    const entities = this.getEntities();

    entities.forEach((entity) => {
      const { x, y } = entity.get(Velocity);
      const position = entity.get(Position);

      position.x += x;
      position.y += y;
    });
  }

  protected getEntities(): Entity[] {
    return this.entityManager.getEntities((entity) => {
      return entity.has([Velocity, Position]);
    });
  }
}
