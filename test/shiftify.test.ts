import { defineSchema } from '~/index';

describe('shiftify', () => {
  it('should map fields directly (true descriptor)', () => {
    const schema = defineSchema({ name: true, age: true });
    const input = { name: 'Alice', age: 30 };

    expect(schema.shift(input)).toEqual({ name: 'Alice', age: 30 });
  });

  it('should map fields using string descriptor', () => {
    const schema = defineSchema({ username: 'user.name' });
    const input = { user: { name: 'Bob' } };

    expect(schema.shift(input)).toEqual({ username: 'Bob' });
  });

  it('should apply transform function', () => {
    const schema = defineSchema({
      upper: { from: 'text', transform: (v: string) => v.toUpperCase() },
      lower: { transform: (v: string) => v.toLowerCase() }
    });
    const input = { text: 'hello', lower: 'WORLD' };

    expect(schema.shift(input)).toEqual({ upper: 'HELLO', lower: 'world' });
  });

  it('should use default value if missing', () => {
    const schema = defineSchema({
      city: { from: 'address.city', default: 'Unknown' }
    });
    const input = { address: {} };

    expect(schema.shift(input)).toEqual({ city: 'Unknown' });
  });

  it('should keep null as a valid value and only use default for undefined', () => {
    const schema = defineSchema({
      field: { from: 'value', default: 'default' }
    });
    expect(schema.shift({ value: null })).toEqual({ field: null });
    expect(schema.shift({})).toEqual({ field: 'default' });
  });

  it('should pass through extra fields in passthrough mode', () => {
    const schema = defineSchema({ id: true }, { mode: 'passthrough' });
    const input = { id: 1, extra: 'keep me' };

    expect(schema.shift(input)).toEqual({ id: 1, extra: 'keep me' });
  });

  it('should shift many objects', () => {
    const schema = defineSchema({ name: true });
    const input = [{ name: 'A' }, { name: 'B' }];

    expect(schema.shiftMany(input)).toEqual([{ name: 'A' }, { name: 'B' }]);
  });

  it('should extend schemas', () => {
    const base = defineSchema({ a: true });
    const extended = base.extend({ b: true });

    expect(extended.shift({ a: 1, b: 2 })).toEqual({ a: 1, b: 2 });
  });

  describe('nested schemas', () => {
    it('should handle inline schemas', () => {
      const schema = defineSchema({
        name: true,
        address: {
          schema: {
            city: true,
            country: { default: 'Brazil' }
          }
        }
      });

      const input = {
        name: 'Charlie',
        address: {
          city: 'Rio de Janeiro'
        }
      };

      expect(schema.shift(input)).toEqual({
        name: 'Charlie',
        address: {
          city: 'Rio de Janeiro',
          country: 'Brazil'
        }
      });
    });

    it('should handle nested object schemas', () => {
      const userSchema = defineSchema({
        id: true,
        name: true
      });

      const postSchema = defineSchema({
        title: true,
        author: { from: 'user', schema: userSchema }
      });

      const input = {
        title: 'Hello World',
        user: { id: 1, name: 'Alice' }
      };

      expect(postSchema.shift(input)).toEqual({
        title: 'Hello World',
        author: { id: 1, name: 'Alice' }
      });
    });

    it('should handle nested array schemas', () => {
      const tagSchema = defineSchema({
        name: true,
        color: { default: 'blue' }
      });

      const postSchema = defineSchema({
        title: true,
        tags: { schema: tagSchema }
      });

      const input = {
        title: 'My Post',
        tags: [{ name: 'javascript' }, { name: 'typescript', color: 'red' }]
      };

      expect(postSchema.shift(input)).toEqual({
        title: 'My Post',
        tags: [
          { name: 'javascript', color: 'blue' },
          { name: 'typescript', color: 'red' }
        ]
      });
    });
  });
});
