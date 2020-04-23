import EventEmitter from "eventemitter3";
import EntityManager from "@Entity/EntityManager";

export default interface System {
  entityManager: EntityManager;

  eventEmitter: EventEmitter;

  update(): void;
}
