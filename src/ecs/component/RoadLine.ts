export default class RoadLine {
  public static readonly key = "RoadLine";

  public readonly key = RoadLine.key;

  constructor(
    public roadEntityId: number,
    public startPos: number,
    public resetAt: number
  ) {}
}
