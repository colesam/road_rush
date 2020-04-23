import EventEmitter from "eventemitter3";
import System from "@System/System";
import EntityManager from "@Entity/EntityManager";
import Entity from "@Entity/Entity";
import Car from "@Component/Car";
import Road from "@Component/Road";
import Velocity from "@Component/Velocity";
import GameOver from "@Component/GameOver";
import PhaserGameObject from "@Component/PhaserGameObject";
import GameOverEvent from "@/class/event/GameOverEvent";

/**
 * Apply game over logic to any relevant entities.
 */
export default class GameOverSystem implements System {
  constructor(
    public entityManager: EntityManager,
    public eventEmitter: EventEmitter
  ) {}

  protected getEntities(): Entity[] {
    return this.entityManager.getEntities((entity) =>
      entity.has([Car, GameOver])
    );
  }

  public update(): void {
    const carEntities = this.getEntities();

    carEntities.forEach((carEntity) => {
      const { roadEntityId }: Car = carEntity.get(Car);

      // Freeze road
      const roadEntity = this.entityManager.find(roadEntityId);
      const road: Road = roadEntity.get(Road);
      road.isMoving = false;

      // Freeze obstacle
      if (road.obstacleEntityId !== null) {
        const obstacleEntity = this.entityManager.find(road.obstacleEntityId);
        const velocity: Velocity = obstacleEntity.get(Velocity);
        velocity.y = 0;
      }

      // Dim car if on client side
      if (carEntity.has(PhaserGameObject)) {
        const { gameObject } = carEntity.get(PhaserGameObject);
        gameObject.alpha = 0.5;
      }

      // Emit GameOverEvent
      this.eventEmitter.emit(GameOverEvent.KEY);
    });
  }
}
