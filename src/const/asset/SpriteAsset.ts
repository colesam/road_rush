export default {
  CARS: {
    src: "sprite/cars.png",
    key: "sprite/cars.png",
    config: { frameWidth: 60, frameHeight: 126 }
  }
};

export type SpriteAssetType = {
  src: string;
  key: string;
  config: { frameWidth: number; frameHeight: number };
};
