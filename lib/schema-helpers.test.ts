import schemaHelpers from './schema-helpers';
import commonSchemas from './common-schemas';

describe('schemaHelpers', (): void => {
  it('allOf works', (): void => {
    const value = schemaHelpers.allOf(
      { maxItems: 10, minItems: 1 },
      { pattern: '[a-z]' },
    );
    type Expected = {
      readonly allOf: readonly [
        {
          maxItems: number;
          minItems: number;
        },
        { pattern: string },
      ];
    };
    type T = typeof value extends Expected ? Expected : never;
    const check: T = value;
    expect(check).toEqual({
      allOf: [{ maxItems: 10, minItems: 1 }, { pattern: '[a-z]' }],
    });
  });

  it('anyOf works', (): void => {
    const value = schemaHelpers.anyOf(
      { maxItems: 10, minItems: 1 },
      { pattern: '[a-z]' },
    );
    type Expected = {
      readonly anyOf: readonly [
        {
          readonly maxItems: number;
          readonly minItems: number;
        },
        { readonly pattern: string },
      ];
    };
    type T = typeof value extends Expected ? Expected : never;
    const check: T = value;
    expect(check).toEqual({
      anyOf: [{ maxItems: 10, minItems: 1 }, { pattern: '[a-z]' }],
    });
  });

  it('const works', (): void => {
    const value = schemaHelpers.const('apple');
    type Expected = { readonly const: 'apple' };
    type T = typeof value extends Expected ? Expected : never;
    const check: T = value;
    expect(check).toEqual({ const: 'apple' });
  });

  it('enum works', (): void => {
    const value = schemaHelpers.enum('apple', 1);
    type Expected = { readonly enum: readonly ['apple', 1] };
    type T = typeof value extends Expected ? Expected : never;
    const check: T = value;
    expect(check).toEqual({ enum: ['apple', 1] });
  });

  it('array works', (): void => {
    const value = schemaHelpers.array({ maxItems: 10, minItems: 1 });
    type Expected = {
      readonly maxItems: number;
      readonly minItems: number;
      readonly type: 'array';
    };
    type T = typeof value extends Expected ? Expected : never;
    const check: T = value;
    expect(check).toEqual({
      maxItems: 10,
      minItems: 1,
      type: 'array',
    });
  });

  describe('number works', (): void => {
    it('multipleOf works (integer)', (): void => {
      const value = schemaHelpers.number.multipleOf(5, 'integer');
      type Expected = {
        readonly multipleOf: number;
        readonly type: 'integer';
      };
      type T = typeof value extends Expected ? Expected : never;
      const check: T = value;
      expect(check).toEqual({
        multipleOf: 5,
        type: 'integer',
      });
    });
    it('multipleOf works (default)', (): void => {
      const value = schemaHelpers.number.multipleOf(5);
      type Expected = {
        readonly multipleOf: number;
        readonly type: 'number';
      };
      type T = typeof value extends Expected ? Expected : never;
      const check: T = value;
      expect(check).toEqual({
        multipleOf: 5,
        type: 'number',
      });
    });

    it('range works (integer)', (): void => {
      const value = schemaHelpers.number.range(
        { maximum: 10, minimum: 1 },
        'integer',
      );
      type Expected = {
        readonly maximum: number;
        readonly minimum: number;
        readonly type: 'integer';
      };
      type T = typeof value extends Expected ? Expected : never;
      const check: T = value;
      expect(check).toEqual({
        maximum: 10,
        minimum: 1,
        type: 'integer',
      });
    });

    it('range works', (): void => {
      const value = schemaHelpers.number.range({ maximum: 10, minimum: 1 });
      type Expected = { maximum: number; minimum: number; type: 'number' };
      type T = typeof value extends Expected ? Expected : never;
      const check: T = value;
      expect(check).toEqual({
        maximum: 10,
        minimum: 1,
        type: 'number',
      });
    });
  });

  it('object works', (): void => {
    const value = schemaHelpers.object({
      properties: { p1: commonSchemas.string },
    });
    type Expected = { properties: { p1: { type: 'string' } }; type: 'object' };
    type T = typeof value extends Expected ? Expected : never;
    const check: T = value;
    expect(check).toEqual({
      properties: { p1: commonSchemas.string },
      type: 'object',
    });
  });

  it('oneOf works', (): void => {
    const value = schemaHelpers.oneOf(
      commonSchemas.string,
      commonSchemas.number,
    );
    type Expected = {
      readonly oneOf: readonly [{ type: 'string' }, { type: 'number' }];
    };
    type T = typeof value extends Expected ? Expected : never;
    const check: T = value;
    expect(check).toEqual({
      oneOf: [commonSchemas.string, commonSchemas.number],
    });
  });

  it('orNull works', (): void => {
    const value = schemaHelpers.orNull(commonSchemas.string);
    type Expected = {
      readonly anyOf: readonly [{ type: 'string' }, { type: 'null' }];
    };
    type T = typeof value extends Expected ? Expected : never;
    const check: T = value;
    expect(check).toEqual({
      anyOf: [commonSchemas.string, commonSchemas.null],
    });
  });

  it('schema works', (): void => {
    const value = schemaHelpers.schema({ type: 'string' });
    type Expected = { readonly type: 'string' };
    type T = typeof value extends Expected ? Expected : never;
    const check: T = value;
    expect(check).toEqual({ type: 'string' });
  });

  describe('string works', (): void => {
    it('format works', (): void => {
      const value = schemaHelpers.string.format('uri');
      type Expected = { readonly type: 'string' };
      type T = typeof value extends Expected ? Expected : never;
      const check: T = value;
      expect(check).toEqual({ format: 'uri', type: 'string' });
    });

    it('length works', (): void => {
      const value = schemaHelpers.string.length({
        maxLength: 10,
        minLength: 1,
      });
      type Expected = {
        readonly type: 'string';
        readonly maxLength: number;
        readonly minLength: number;
      };
      type T = typeof value extends Expected ? Expected : never;
      const check: T = value;
      expect(check).toEqual({
        maxLength: 10,
        minLength: 1,
        type: 'string',
      });
    });

    describe('pattern works', (): void => {
      it('simple works', (): void => {
        const value = schemaHelpers.string.pattern('[a-z]+');
        type Expected = {
          readonly type: 'string';
          readonly pattern: string;
        };
        type T = typeof value extends Expected ? Expected : never;
        const check: T = value;
        expect(check).toEqual({ pattern: '[a-z]+', type: 'string' });
      });

      it('with length works', (): void => {
        const value = schemaHelpers.string.pattern('[a-z]+', {
          maxLength: 10,
          minLength: 1,
        });
        type Expected = {
          readonly type: 'string';
          readonly pattern: string;
          readonly maxLength: number;
          readonly minLength: number;
        };
        type T = typeof value extends Expected ? Expected : never;
        const check: T = value;
        expect(check).toEqual({
          maxLength: 10,
          minLength: 1,
          pattern: '[a-z]+',
          type: 'string',
        });
      });
    });
  });
});
