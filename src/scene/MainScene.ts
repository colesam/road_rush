import EventEmitter from "eventemitter3";
import SceneHelper from "@/class/helper/SceneHelper";
import ImageAssets from "@/const/asset/ImageAsset";
import SpriteAssets from "@/const/asset/SpriteAsset";
import EntityManager from "@Entity/EntityManager";
import Entity from "@Entity/Entity";
import PhaserGameObject from "@Component/PhaserGameObject";
import Position from "@Component/Position";
import Clickable from "@Component/Clickable";
import LaneSwitch from "@Component/LaneSwitch";
import RoadLine from "@Component/RoadLine";
import Road from "@Component/Road";
import Collidable from "@Component/Collidable";
import Car from "@Component/Car";
import System from "@System/System";
import VelocitySystem from "@System/Velocity";
import LaneSwitchSystem from "@System/LaneSwitch";
import Destroy from "@System/Destroy";
import ObstacleGenerateSystem from "@System/ObstacleGenerate";
import CarPosition from "@System/CarPosition";
import CarCollision from "@System/CarCollision";
import GameOver from "@System/GameOver";
import PositionSystem from "@System/client/Position";
import PhaserRender from "@System/client/PhaserRender";
import PhaserClickSystem from "@System/client/PhaserClick";
import MoveLines from "@System/client/MoveLines";
import GameOverEvent from "@/class/event/GameOverEvent";

const { ROAD, LINE, POLICE_1, POLICE_2 } = ImageAssets;

const { CARS } = SpriteAssets;

const { dimensions } = SceneHelper;

export default class MainScene extends Phaser.Scene {
  protected entityManager!: EntityManager;

  protected systems!: System[];

  protected run: boolean = true;

  constructor() {
    super("MainScene");
  }

  /**
   * Load images into the Game's cache
   */
  preload() {
    this.load.image(ROAD.key, ROAD.src);
    this.load.image(LINE.key, LINE.src);
    this.load.image(POLICE_1.key, POLICE_1.src);
    this.load.image(POLICE_2.key, POLICE_2.src);
    this.load.spritesheet(CARS.key, CARS.src, CARS.config);
  }

  /**
   * Create image objects
   */
  create() {
    this.entityManager = new EntityManager();

    const eventEmitter = new EventEmitter();

    this.systems = [
      new PhaserRender(this.entityManager, eventEmitter, this),
      new CarPosition(this.entityManager, eventEmitter),
      new PositionSystem(this.entityManager, eventEmitter),
      new VelocitySystem(this.entityManager, eventEmitter),
      new PhaserClickSystem(this.entityManager, eventEmitter),
      new MoveLines(this.entityManager, eventEmitter),
      new LaneSwitchSystem(this.entityManager, eventEmitter),
      new ObstacleGenerateSystem(this.entityManager, eventEmitter),
      new CarCollision(this.entityManager, eventEmitter),
      new GameOver(this.entityManager, eventEmitter),
      new Destroy(this.entityManager, eventEmitter),
    ];

    const roadSpeed = 8;
    const { gameWidth, gameHeight } = dimensions(this);

    // Setup player-controlled car
    const carSprite = this.add.sprite(0, gameHeight * 0.9, CARS.key);

    const carEntity = new Entity([
      new PhaserGameObject(carSprite),
      new Position(carSprite.x, carSprite.y),
      new Collidable(carSprite.width, carSprite.height),
    ]);

    this.entityManager.addEntity(carEntity);

    // Set up road
    const roadImage = this.add.image(gameWidth / 2, 0, ROAD.key);
    roadImage.depth = -10;
    roadImage.displayWidth = gameWidth / 2;
    roadImage.scaleY = roadImage.scaleX;

    const roadEntity = new Entity([
      new Road(carEntity.id, roadSpeed, [
        { assetKey: POLICE_1.key, speed: 4 },
        { assetKey: POLICE_2.key, speed: 8 },
      ]),
      new PhaserGameObject(roadImage),
      new Position(roadImage.x, roadImage.y),
      new Clickable(),
      new LaneSwitch(),
    ]);

    this.entityManager.addEntity(roadEntity);

    // Link car entity to its road
    carEntity.addComponent(new Car(roadEntity.id));

    // Set up lines
    const lineSpace = gameHeight / 8;

    for (let i = 0; i < 15; i++) {
      const lineImage = this.add.image(roadImage.x, lineSpace * i, LINE.key);
      this.entityManager.addEntity(
        new Entity([
          new PhaserGameObject(lineImage),
          new Position(lineImage.x, lineImage.y),
          new RoadLine(roadEntity.id, lineImage.y, lineSpace),
        ])
      );
    }

    // Text rendering is slow, create it beforehand and make invisible
    const gameOverText = this.add.text(0, 0, "Game Over", {
      font: "bold 50px Arial",
      color: "#ea0909",
    });

    gameOverText.setOrigin(0.5, 0.5);
    gameOverText.x = gameWidth / 2;
    gameOverText.y = gameHeight / 6;

    gameOverText.alpha = 0;

    eventEmitter.on(GameOverEvent.KEY, () => {
      this.run = false;
      gameOverText.alpha = 1;
    });
  }

  /**
   * Update loop
   */
  update() {
    if (this.run) {
      this.entityManager.runQueries();
      this.systems.forEach((system) => system.update());
    }
  }
}
