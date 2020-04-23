export default class Collidable {
  public static readonly key = "Collidable";

  public readonly key = Collidable.key;

  constructor(public width: number = 0, public height: number = 0) {}
}
