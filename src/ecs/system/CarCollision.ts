import EventEmitter from "eventemitter3";
import System from "@System/System";
import EntityManager from "@Entity/EntityManager";
import Entity from "@Entity/Entity";
import Car from "@Component/Car";
import Position from "@Component/Position";
import Collidable from "@Component/Collidable";
import GameOver from "@Component/GameOver";

type CollisionData = {
  collidable: Collidable;
  position: Position;
};

/**
 * Check for collisions between player's car and obstacles. If car is collided,
 * attach a GameOver component to it.
 */
export default class CarCollisionSystem implements System {
  constructor(
    public entityManager: EntityManager,
    public eventEmitter: EventEmitter
  ) {}

  protected getEntities(): Entity[] {
    return this.entityManager.getEntities((entity) =>
      entity.has([Car, Position, Collidable])
    );
  }

  public update(): void {
    const carEntities = this.getEntities();
    const collidableEntities = this.entityManager.getEntities(
      (entity) => entity.has([Position, Collidable]) && !entity.has(Car)
    );

    carEntities.forEach((carEntity) => {
      const car = {
        collidable: carEntity.get(Collidable),
        position: carEntity.get(Position),
      };

      collidableEntities.forEach((entity) => {
        const collisionObj = {
          collidable: entity.get(Collidable),
          position: entity.get(Position),
        };

        if (this.isCollided(car, collisionObj)) {
          carEntity.addComponent(new GameOver());
        }
      });
    });
  }

  public isCollided(a: CollisionData, b: CollisionData) {
    const distX = Math.abs(a.position.x - b.position.x);
    const distY = Math.abs(a.position.y - b.position.y);

    return distX < a.collidable.width && distY < a.collidable.height;
  }
}
