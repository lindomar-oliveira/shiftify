# Shiftify

**Shiftify** is flexible schema-based object transformer for JavaScript/TypeScript. It allows developers to define schemas for mapping and transforming object structures, with support for nested fields, default values, and more.

## Installation

Install via npm:

```bash
npm install shiftify
```

## Usage

### Basic Mapping

Map fields directly from an input object:

```javascript
import { defineSchema } from 'shiftify';

const schema = defineSchema({
  name: true, // Direct mapping
  age: true
});

const input = { name: 'Alice', age: 30 };
const output = schema.shift(input);
console.log(output); // { name: 'Alice', age: 30 }
```

### Nested Fields

Access nested properties using dot notation:

```javascript
const schema = defineSchema({
  username: 'user.name' // Maps from nested path
});

const input = { user: { name: 'Bob' } };
const output = schema.shift(input);
console.log(output); // { username: 'Bob' }
```

### Custom Transformation

Apply a transformation function to a field:

```javascript
const schema = defineSchema({
  upper: { 
    from: 'text', 
    transform: (v) => v.toUpperCase() // Custom transform
  }
});

const input = { text: 'hello' };
const output = schema.shift(input);
console.log(output); // { upper: 'HELLO' }
```

### Default Values

Provide a default value for missing fields:

```javascript
const schema = defineSchema({
  city: { 
    from: 'address.city', 
    default: 'Unknown' // Default if missing
  }
});

const input = { address: {} };
const output = schema.shift(input);
console.log(output); // { city: 'Unknown' }
```

### Passthrough Mode

Include unmapped fields in the output:

```javascript
const schema = defineSchema(
  { id: true },
  { mode: 'passthrough' } // Keep extra fields
);

const input = { id: 1, extra: 'keep me' };
const output = schema.shift(input);
console.log(output); // { id: 1, extra: 'keep me' }
```

### Batch Transformation

Transform an array of objects:

```javascript
const schema = defineSchema({ name: true });
const inputs = [{ name: 'A' }, { name: 'B' }];
const outputs = schema.shiftMany(inputs);
console.log(outputs); // [{ name: 'A' }, { name: 'B' }]
```

### Extending Schemas

Combine multiple schemas:

```javascript
const base = defineSchema({ a: true });
const extended = base.extend({ b: true });

const input = { a: 1, b: 2 };
const output = extended.shift(input);
console.log(output); // { a: 1, b: 2 }
```

## Options

When defining a schema, you can pass an options object:

- **mode**: `'explicit'` (default) or `'passthrough'` - Determines whether unmapped fields are included in the output.
- **strict**: `true` (default) or `false` - Logs warnings for missing values in strict mode.

```javascript
const schema = defineSchema(
  { name: true },
  { mode: 'explicit', strict: true }
);
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on [GitHub](https://github.com/lindomar-oliveira/shiftify).

## Author

- Lindomar Oliveira ([@lindomar-oliveira](https://github.com/lindomar-oliveira))
