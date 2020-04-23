export type ObstacleConfig = {
  assetKey: string;
  speed: number;
};

export default class Road {
  public static readonly key = "Road";

  public readonly key = Road.key;

  /**
   * Whether the road is currently moving
   */
  public isMoving: boolean = true;

  /**
   * Entity ID of current obstacle on road
   */
  public obstacleEntityId: number | null = null;

  constructor(
    /**
     * Entity ID of player controlled car
     */
    public carEntityId: number,

    /**
     * How fast the road is moving
     */
    public speed: number,

    /**
     * Asset keys of obstacles
     */
    public obstacleConfigs: ObstacleConfig[],

    /**
     * Number of pixels the center of a lane is from the road center
     */
    public laneOffset: number = 50
  ) {}
}
