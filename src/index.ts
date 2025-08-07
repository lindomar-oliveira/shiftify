import { Schema, SchemaOptions, TransformFunction } from '~/types';

function getValueByPath(obj: Record<string, any>, path: string) {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
}

export function defineSchema(
  schema: Schema,
  options: SchemaOptions = { mode: 'explicit', strict: true }
) {
  function shift(input: Record<string, any>) {
    const result: Record<string, any> = {};

    for (const [key, descriptor] of Object.entries(schema)) {
      let path: string;
      let transformFn: TransformFunction | undefined;
      let defaultValue: any;

      if (descriptor === true) {
        path = key;
      } else if (typeof descriptor === 'string') {
        path = descriptor;
      } else {
        path = descriptor.from;
        transformFn = descriptor.transform;
        defaultValue = descriptor.default;
      }

      const rawValue = getValueByPath(input, path);
      const valueOrDefault = rawValue === undefined ? defaultValue : rawValue;
      const valueToUse = transformFn
        ? transformFn(valueOrDefault)
        : valueOrDefault;

      if (options.strict && valueToUse === undefined) {
        console.warn(`[shiftify] Missing value for "${key}" (from "${path}")`);
      }

      result[key] = valueToUse;
    }

    if (options.mode === 'passthrough') {
      for (const [key, value] of Object.entries(input)) {
        if (!(key in result)) {
          result[key] = value;
        }
      }
    }

    return result;
  }

  function shiftMany(inputs: Record<string, any>[]) {
    return inputs.map(shift);
  }

  function extend(...schemas: Schema[]) {
    const mergedSchema = Object.assign({}, schema, ...schemas);
    return defineSchema(mergedSchema, options);
  }

  return { shift, shiftMany, extend };
}
