import EventEmitter from "eventemitter3";
import System from "@System/System";
import EntityManager from "@Entity/EntityManager";
import Entity from "@Entity/Entity";
import ClickEvent from "@/class/event/ClickEvent";
import Clickable from "@Component/Clickable";
import PhaserGameObject from "@Component/PhaserGameObject";

/**
 * Capture phaser click event and emit a generic click event over the system
 * event emitter.
 *
 * NOTE: This system is dependent on the Phaser framework and can only be used
 * client side.
 */
export default class ClickSystem implements System {
  constructor(
    public entityManager: EntityManager,
    public eventEmitter: EventEmitter
  ) {}

  protected getEntities(): Entity[] {
    return this.entityManager.getEntities((entity) => {
      return entity.has([Clickable, PhaserGameObject]);
    });
  }

  public update(): void {
    const entities = this.getEntities();

    entities.forEach((entity) => {
      const phaserGameObject = entity.get(PhaserGameObject);

      if (!phaserGameObject.interactive) {
        phaserGameObject.interactive = true;
        phaserGameObject.gameObject.setInteractive();
        phaserGameObject.gameObject.on("pointerdown", () => {
          this.eventEmitter.emit(ClickEvent.KEY, new ClickEvent(entity.id));
        });
      }
    });
  }
}
