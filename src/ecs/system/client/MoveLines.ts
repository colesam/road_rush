import EventEmitter from "eventemitter3";
import System from "@System/System";
import EntityManager from "@Entity/EntityManager";
import Entity from "@Entity/Entity";
import Position from "@Component/Position";
import Road from "@Component/Road";
import RoadLine from "@/ecs/component/RoadLine";

/**
 * Move each road's lines backwards to make the road "go".
 *
 * NOTE: While this system does not depend on phaser, it is only applicable
 * to the client side because it has no bearing on the gameplay.
 */
export default class MoveLinesSystem implements System {
  constructor(
    public entityManager: EntityManager,
    public eventEmitter: EventEmitter
  ) {}

  protected getEntities(): Entity[] {
    return this.entityManager.getEntities((entity) => {
      if (entity.has(RoadLine)) {
        // Make sure road is moving
        const { roadEntityId } = entity.get(RoadLine);
        const { isMoving } = this.entityManager.find(roadEntityId).get(Road);
        return isMoving;
      }
      return false;
    });
  }

  public update(): void {
    const entities = this.getEntities();

    // Group by road id
    const roads = {};
    entities.forEach((entity) => {
      const { roadEntityId } = entity.get(RoadLine);

      if (!roads.hasOwnProperty(roadEntityId)) {
        roads[roadEntityId] = [];
      }

      roads[roadEntityId].push(entity);
    });

    for (let roadId in roads) {
      this.moveLines(roads[roadId]);
    }
  }

  protected moveLines(lines: Entity[]) {
    lines.forEach((line) => {
      const position = line.get(Position);
      const { startPos, resetAt } = line.get(RoadLine);

      position.y += 8; // hard code speed for now

      if (position.y >= startPos + resetAt) {
        position.y = startPos;
      }
    });
  }
}
