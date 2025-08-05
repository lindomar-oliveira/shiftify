export type TransformFunction = (input: any) => any;

export type FieldDescriptor =
  | true
  | string
  | { from: string; transform?: TransformFunction; default?: any };

export type Schema = Record<string, FieldDescriptor>;

export type SchemaOptions = {
  mode?: 'explicit' | 'passthrough';
  strict?: boolean;
};
