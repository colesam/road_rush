import { Component, ComponentClass } from "@Component/Component";

export default class Entity {
  // ID is assigned immediately when passed to EntityManager
  public id!: number;

  public components: object = {};

  public componentKeys: string[] = [];

  constructor(components: any[]) {
    components.forEach((component) => {
      this.addComponent(component);
    });
  }

  /**
   * Get a reference to the specified component. This method will throw an
   * error if the component does not exist.
   */
  public get<T extends Component>({ key }: ComponentClass<T>): T {
    if (!this.componentKeys.includes(key)) {
      throw new Error(`Component not found: ${key}`);
    }

    return this.components[key];
  }

  /**
   * Check if this entity has a class | classes by passing an object or
   * an array of objects containing component keys.
   */
  public has(componentClasses: { key: string } | { key: string }[]) {
    if (!Array.isArray(componentClasses)) {
      componentClasses = [componentClasses];
    }

    const originalLength = componentClasses.length;

    return (
      componentClasses.filter(({ key }) => this.componentKeys.includes(key))
        .length === originalLength
    );
  }

  /**
   * Add a component to be stored in this entity. Will throw an error if the
   * entity already has that component.
   */
  public addComponent(component: Component) {
    if (this.componentKeys.includes(component.key)) {
      throw new Error(`Component already exists: ${component.key}`);
    }
    this.componentKeys.push(component.key);
    this.components[component.key] = component;
  }

  /**
   * Remove a component from this entity. Will not throw an error if the
   * component does not exist.
   */
  public removeComponent<T extends Component>({ key }: ComponentClass<T>) {
    if (this.components.hasOwnProperty(key)) {
      this.componentKeys.splice(this.componentKeys.indexOf(key), 1);
      delete this.components[key];
    }
  }
}
