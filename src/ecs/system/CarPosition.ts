import EventEmitter from "eventemitter3";
import System from "@System/System";
import EntityManager from "@Entity/EntityManager";
import Entity from "@Entity/Entity";
import Road from "@Component/Road";
import Car from "@Component/Car";
import Position from "@Component/Position";

/**
 * Calculate and modify car's position using road's position, lane offset,
 * and car's current lane.
 */
export default class CarPositionSystem implements System {
  constructor(
    public entityManager: EntityManager,
    public eventEmitter: EventEmitter
  ) {}

  public update(): void {
    const entities = this.getEntities();

    entities.forEach((entity) => {
      const car = entity.get(Car);
      const carPos: Position = entity.get(Position);

      const roadEntity = this.entityManager.find(car.roadEntityId);
      const road = roadEntity.get(Road);
      const roadPos = roadEntity.get(Position);

      carPos.x = car.currentLane * road.laneOffset + roadPos.x;
    });
  }

  protected getEntities(): Entity[] {
    return this.entityManager.getEntities((entity) =>
      entity.has([Car, Position])
    );
  }
}
