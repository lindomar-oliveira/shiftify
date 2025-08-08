export type TransformFunction = (
  input: any,
  context?: Record<string, any>
) => any;

export type Shiftify = {
  shift: (input: Record<string, any>) => Record<string, any>;
  shiftMany: (inputs: Record<string, any>[]) => Record<string, any>[];
  extend: (...schemas: Schema[]) => Shiftify;
};

export type FieldDescriptor =
  | true
  | string
  | { from?: string; transform?: TransformFunction; default?: any }
  | { from?: string; schema: Schema | Shiftify; default?: any };

export type Schema = Record<string, FieldDescriptor>;

export type SchemaOptions = {
  mode?: 'explicit' | 'passthrough';
  strict?: boolean;
};
