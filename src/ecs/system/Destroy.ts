import EventEmitter from "eventemitter3";
import System from "@System/System";
import EntityManager from "@Entity/EntityManager";
import Entity from "@Entity/Entity";
import Component from "@Component/Destroy";
import PhaserGameObject from "@Component/PhaserGameObject";

/**
 * Safely destroy an entity.
 */
export default class DestroySystem implements System {
  constructor(
    public entityManager: EntityManager,
    public eventEmitter: EventEmitter
  ) {}

  protected getEntities(): Entity[] {
    return this.entityManager.getEntities((entity) => {
      return entity.has(Component);
    });
  }

  public update(): void {
    const entities = this.getEntities();

    entities.forEach((entity) => {
      if (entity.has(PhaserGameObject)) {
        const { gameObject } = entity.get(PhaserGameObject);
        gameObject.destroy();
      }

      this.entityManager.destroyEntity(entity.id);
    });
  }
}
