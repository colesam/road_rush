export default class Car {
  public static readonly key = "Car";

  public readonly key = Car.key;

  constructor(
    public roadEntityId: number,

    /**
     * Multiplied by road's lane offset property to determine position of car
     *
     * -1 = Left lane
     * +1 = Right lane
     */
    public currentLane = 1
  ) {}
}
