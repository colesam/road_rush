import Entity from "@Entity/Entity";

type QueryConfig = {
  resetOnUpdate?: boolean;
  resetOnGet?: boolean;
};

type QueryFunction = (e: Entity) => boolean;

type Query = {
  config: QueryConfig;
  fn: QueryFunction | null;
  result: number[];
};

export default class EntityManager {
  public entities: { [key: number]: Entity } = {};

  public queries: { [key: string]: Query } = {};

  protected idCounter = 1000;

  public addEntity(entity) {
    if (entity.id != null) {
      throw new Error("Cannot add entity that has already been initialized!");
    }

    entity.id = this.idCounter;
    this.idCounter++;
    this.entities[entity.id] = entity;
  }

  /**
   * Return a list of entities that include each of the specified components
   */
  public getEntities(queryFn: QueryFunction) {
    return Object.values(this.entities).filter(queryFn);
  }

  public find(entityId: number): Entity {
    if (!this.entities.hasOwnProperty(entityId)) {
      throw new Error("Unknown entityID: ${entityId}!");
    }

    return this.entities[entityId];
  }

  public destroyEntity(entityId: number) {
    delete this.entities[entityId];
  }

  public runQueries() {
    Object.values(this.queries).forEach((query) => {
      if (query.config.resetOnUpdate) {
        query.result = [];
      }
    });
  }

  public registerQuery(
    key: string,
    config: QueryConfig = {},
    queryFn: QueryFunction | null = null
  ) {
    if (this.queries.hasOwnProperty(key)) {
      console.warn(`Duplicate query registered: ${key}`);
    }

    const defaultConfig = {
      resetOnUpdate: true,
      resetOnRetrieve: false,
    };

    this.queries[key] = {
      config: { ...defaultConfig, ...config },
      fn: queryFn,
      result: [],
    };
  }

  public getQueryResult(key: string): Entity[] {
    if (!this.queries.hasOwnProperty(key)) {
      throw new Error(`Query not found: ${key}`);
    }

    const query = this.queries[key];

    const result = query.result
      .filter((entityId) => this.entities.hasOwnProperty(entityId))
      .map((entityId) => this.entities[entityId]);

    if (query.config.resetOnGet) {
      query.result = [];
    }

    return result;
  }

  public pushQueryResult(key: string, entityId: number) {
    if (!this.queries.hasOwnProperty(key)) {
      throw new Error(`Query not found: ${key}`);
    }

    const { result } = this.queries[key];

    if (!result.includes(entityId)) {
      result.push(entityId);
    }
  }
}
