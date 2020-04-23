import EventEmitter from "eventemitter3";
import System from "@System/System";
import EntityManager from "@Entity/EntityManager";
import Entity from "@Entity/Entity";
import Position from "@Component/Position";
import Velocity from "@Component/Velocity";
import Destroy from "@Component/Destroy";
import Road, { ObstacleConfig } from "@Component/Road";
import Collidable from "@Component/Collidable";
import ImageAsset from "@Component/ImageAsset";
import ArrayHelper from "@/class/helper/ArrayHelper";

const { getRandom } = ArrayHelper;

/**
 * Generate random obstacles on the road.
 */
export default class ObstacleGenerateSystem implements System {
  constructor(
    public entityManager: EntityManager,
    public eventEmitter: EventEmitter
  ) {}

  public update(): void {
    const entities = this.getEntities();

    entities.forEach((roadEntity) => {
      const {
        speed,
        isMoving,
        obstacleEntityId,
        obstacleConfigs,
        laneOffset,
      }: Road = roadEntity.get(Road);

      const roadPos = roadEntity.get(Position);

      if (obstacleEntityId === null) {
        if (isMoving && Math.random() > 0.97) {
          roadEntity.get(Road).obstacleEntityId = this.addObstacle(
            roadPos,
            laneOffset,
            speed,
            obstacleConfigs
          );
        }
      } else {
        const obstacle = this.entityManager.find(obstacleEntityId);

        if (!obstacle.has(Position)) {
          throw new Error("Obstacle entity is missing a Position component!");
        }

        const position = obstacle.get(Position);

        if (position.y > 1000) {
          roadEntity.get(Road).obstacleEntityId = null;
          obstacle.addComponent(new Destroy());
        }
      }
    });
  }

  protected addObstacle(
    roadPos: Position,
    laneOffset: number,
    roadSpeed: number,
    obstacleConfigs: ObstacleConfig[]
  ): number {
    const { assetKey, speed } = getRandom(obstacleConfigs);
    const offset = getRandom([-laneOffset, laneOffset]);

    const obstacle = new Entity([
      new Position(roadPos.x + offset, 0),
      new Velocity(0, roadSpeed + speed),
      new ImageAsset(assetKey),
      new Collidable(),
    ]);

    this.entityManager.addEntity(obstacle);

    return obstacle.id;
  }

  protected getEntities(): Entity[] {
    return this.entityManager.getEntities((entity) =>
      entity.has([Road, Position])
    );
  }
}
