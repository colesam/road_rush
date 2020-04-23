import EventEmitter from "eventemitter3";
import System from "@System/System";
import EntityManager from "@Entity/EntityManager";
import ClickEvent from "@/class/event/ClickEvent";
import Road from "@Component/Road";
import Position from "@Component/Position";
import Car from "@Component/Car";
import LaneSwitch from "@Component/LaneSwitch";

/**
 * Capture a road's click event and switch the current lane of that road's car.
 */
export default class LaneSwitchSystem implements System {
  constructor(
    public entityManager: EntityManager,
    public eventEmitter: EventEmitter
  ) {
    // Register query
    this.entityManager.registerQuery("LANE_SWITCH", {
      resetOnUpdate: false,
      resetOnGet: true,
    });

    // Listen for click event
    this.eventEmitter.on(ClickEvent.KEY, ({ entityId }: ClickEvent) => {
      const entity = this.entityManager.find(entityId);

      if (entity.has([Road, Position]) && entity.get(Road).isMoving) {
        this.entityManager.pushQueryResult("LANE_SWITCH", entity.id);
      }
    });
  }

  public update(): void {
    const entities = this.entityManager.getQueryResult("LANE_SWITCH");

    entities.forEach((entity) => {
      const laneSwitch = entity.get(LaneSwitch);
      const { carEntityId } = entity.get(Road);

      const carEntity = this.entityManager.find(carEntityId);

      if (!carEntity.has(Car)) {
        throw new Error(
          "Road's linked car entity does not have Car component!"
        );
      }

      const car = carEntity.get(Car);

      car.currentLane = -1 * car.currentLane;

      laneSwitch.switchLanes = false;
    });
  }
}
