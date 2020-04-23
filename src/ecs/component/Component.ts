export interface Component {
  readonly key: string;
}

export type ComponentClass<T extends Component> = (new (
  ...args: any[]
) => T) & {
  key: string;
};
