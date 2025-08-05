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
      upper: { from: 'text', transform: (v: string) => v.toUpperCase() }
    });
    const input = { text: 'hello' };

    expect(schema.shift(input)).toEqual({ upper: 'HELLO' });
  });

  it('should use default value if missing', () => {
    const schema = defineSchema({
      city: { from: 'address.city', default: 'Unknown' }
    });
    const input = { address: {} };

    expect(schema.shift(input)).toEqual({ city: 'Unknown' });
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

  it('should handle nested transform and default', () => {
    const schema = defineSchema({
      score: {
        from: 'stats.points',
        transform: (v: number) => v * 2,
        default: 10
      }
    });

    expect(schema.shift({ stats: { points: 5 } })).toEqual({ score: 10 });
    expect(schema.shift({ stats: {} })).toEqual({ score: 20 });
  });
});
