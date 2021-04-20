// note this is more focused on TypeScript/tsc than Jest itself

import { JSONSchema7Object, JSONSchema7Type } from './json-schema';

import type { TypeFromJSONSchema } from './index';

// keep in sync with basic.d.test.ts
describe('basic definitions', (): void => {
  describe('check scalar definitions', (): void => {
    it('boolean works', (): void => {
      const schema = { type: 'boolean' } as const;
      type S = typeof schema;
      const value: TypeFromJSONSchema<S> = true;
      type Expected = boolean;
      type T = typeof value extends Expected ? Expected : never;
      const check: T = value;
      expect(value).toBe(check);
    });

    it('null works', (): void => {
      const schema = { type: 'null' } as const;
      type S = typeof schema;
      const value: TypeFromJSONSchema<S> = null;
      type Expected = null;
      type T = typeof value extends Expected ? Expected : never;
      const check: T = value;
      expect(value).toBe(check);
    });

    it('integer works', (): void => {
      const schema = { type: 'integer' } as const;
      type S = typeof schema;
      const value: TypeFromJSONSchema<S> = 1;
      type Expected = number;
      type T = typeof value extends Expected ? Expected : never;
      const check: T = value;
      expect(value).toBe(check);
    });

    it('number works', (): void => {
      const schema = { type: 'number' } as const;
      type S = typeof schema;
      const value: TypeFromJSONSchema<S> = 1;
      type Expected = number;
      type T = typeof value extends Expected ? Expected : never;
      const check: T = value;
      expect(value).toBe(check);
    });

    it('string works', (): void => {
      const schema = { type: 'string' } as const;
      type S = typeof schema;
      const value: TypeFromJSONSchema<S> = 'hello';
      type Expected = string;
      type T = typeof value extends Expected ? Expected : never;
      const check: T = value;
      expect(value).toBe(check);
    });
  });

  describe('check defined values definitions', (): void => {
    it('const works', (): void => {
      // note value type must be '1' and not 'number'!
      const schema = { const: 1, type: 'number' } as const;
      type S = typeof schema;
      const value: TypeFromJSONSchema<S> = 1;
      type Expected = 1;
      type T = typeof value extends Expected ? Expected : never;
      const check: T = value;
      expect(value).toBe(check);
    });

    it('const array works', (): void => {
      const schema = { const: [1, 2] } as const;
      type S = typeof schema;
      // note value type must be '1' and not 'number'!
      const value: TypeFromJSONSchema<S> = [1, 2] as const;
      type Expected = readonly [1, 2];
      type T = typeof value extends Expected ? Expected : never;
      const check: T = value;
      expect(value).toBe(check);
    });

    it('enum works', (): void => {
      const schema = {
        enum: [1, 'hello'],
        type: 'string',
      } as const;
      type S = typeof schema;
      const value: TypeFromJSONSchema<S> = 'hello';
      type Expected = 1 | 'hello';
      type T = typeof value extends Expected ? Expected : never;
      const check: T = value;
      expect(value).toBe(check);
    });

    it('enum of complex data works', (): void => {
      const schema = {
        enum: [[1, 2], 'hello'],
        type: 'string',
      } as const;
      type S = typeof schema;
      const value: TypeFromJSONSchema<S> = [1, 2] as const;
      type Expected = readonly [1, 2] | 'hello';
      type T = typeof value extends Expected ? Expected : never;
      const check: T = value;
      expect(value).toBe(check);
    });
  });
});

describe('combination definitions', (): void => {
  it('allOf works', (): void => {
    const schema = {
      allOf: [
        { minLength: 1, type: 'string' },
        { maxLength: 10, type: 'string' },
      ],
    } as const;
    type S = typeof schema;
    const value: TypeFromJSONSchema<S> = 'hello';
    type Expected = string;
    type T = typeof value extends Expected ? Expected : never;
    const check: T = value;
    expect(value).toBe(check);
  });

  it('anyOf works', (): void => {
    const schema = {
      anyOf: [{ type: 'boolean' }, { type: 'string' }],
    } as const;
    type S = typeof schema;
    const value: TypeFromJSONSchema<S> = true;
    type Expected = boolean | string;
    type T = typeof value extends Expected ? Expected : never;
    const check: T = value;
    expect(value).toBe(check);
  });

  it('allOf works', (): void => {
    const schema = {
      allOf: [{ type: 'boolean' }, { type: 'string' }],
    } as const;
    type S = typeof schema;
    const value: TypeFromJSONSchema<S> = true;
    type Expected = boolean | string;
    type T = typeof value extends Expected ? Expected : never;
    const check: T = value;
    expect(value).toBe(check);
  });

  describe('not works', (): void => {
    it('with basic type', (): void => {
      const schema = { not: { type: 'boolean' } } as const;
      type S = typeof schema;
      const value: TypeFromJSONSchema<S> = 1;
      type Expected = Exclude<JSONSchema7Type, boolean>;
      type T = typeof value extends Expected ? Expected : never;
      const check: T = value;
      expect(value).toBe(check);
    });

    it('with combination type', (): void => {
      const schema = {
        not: { anyOf: [{ type: 'boolean' }, { type: 'string' }] },
      } as const;
      type S = typeof schema;
      const value: TypeFromJSONSchema<S> = 1;
      type Expected = Exclude<JSONSchema7Type, boolean | string>;
      type T = typeof value extends Expected ? Expected : never;
      const check: T = value;
      expect(value).toBe(check);
    });

    it('with container type', (): void => {
      const schema = {
        not: { properties: { a: { type: 'number' } }, type: 'object' },
      } as const;
      type S = typeof schema;
      const value: TypeFromJSONSchema<S> = 1;
      type Expected = Exclude<JSONSchema7Type, boolean | string>;
      type T = typeof value extends Expected ? Expected : never;
      const check: T = value;
      expect(value).toBe(check);
    });
  });

  it('oneOf works', (): void => {
    const schema = {
      oneOf: [{ type: 'boolean' }, { type: 'string' }],
    } as const;
    type S = typeof schema;
    const value: TypeFromJSONSchema<S> = true;
    type Expected = boolean | string;
    type T = typeof value extends Expected ? Expected : never;
    const check: T = value;
    expect(value).toBe(check);
  });
});

describe('container definitions', (): void => {
  describe('array definitions', (): void => {
    it('homogeneous works', (): void => {
      const schema = {
        items: { type: 'boolean' },
        type: 'array',
      } as const;
      type S = typeof schema;
      const value: TypeFromJSONSchema<S> = [true, false];
      type Expected = boolean[];
      type T = typeof value extends Expected ? Expected : never;
      const check: T = value;
      expect(value).toBe(check);
    });

    it('untyped homogeneous works', (): void => {
      const schema = { type: 'array' } as const;
      type S = typeof schema;
      const value: TypeFromJSONSchema<S> = [true, false];
      type Expected = JSONSchema7Type[];
      type T = typeof value extends Expected ? Expected : never;
      const check: T = value;
      expect(value).toBe(check);
    });

    it('untyped homogeneous works (items: true)', (): void => {
      const schema = { items: true, type: 'array' } as const;
      type S = typeof schema;
      const value: TypeFromJSONSchema<S> = [true, false];
      type Expected = JSONSchema7Type[];
      type T = typeof value extends Expected ? Expected : never;
      const check: T = value;
      expect(value).toBe(check);
    });

    it('tuple works', (): void => {
      const schema = {
        items: [{ type: 'boolean' }, { type: 'string' }],
        type: 'array',
      } as const;
      type S = typeof schema;
      const value: TypeFromJSONSchema<S> = [true, 'hello'];
      type Expected = [boolean, string];
      type T = typeof value extends Expected ? Expected : never;
      const check: T = value;
      expect(value).toBe(check);
    });

    it('untyped tuple works', (): void => {
      const schema = {
        items: [true, true],
        type: 'array',
      } as const;
      type S = typeof schema;
      const value: TypeFromJSONSchema<S> = [true, 'hello'];
      type Expected = [JSONSchema7Type, JSONSchema7Type];
      type T = typeof value extends Expected ? Expected : never;
      const check: T = value;
      expect(value).toBe(check);
    });
  });

  describe('object definitions', (): void => {
    it('defined properties works', (): void => {
      const schema = {
        properties: {
          a: { type: 'boolean' },
          b: { type: 'string' },
          c: { type: 'number' },
        },
        type: 'object',
      } as const;
      type S = typeof schema;
      const value: TypeFromJSONSchema<S> = {
        a: true,
        c: 1,
        d: [1], // extra properties are allowed
      };
      type Expected = {
        a?: boolean;
        b?: string;
        c?: number;
      } & JSONSchema7Object;
      type T = typeof value extends Expected ? Expected : never;
      const check: T = value;
      expect(value).toBe(check);
    });

    it('defined properties works with required properties', (): void => {
      const schema = {
        properties: {
          a: { type: 'boolean' },
          b: { type: 'string' },
          c: { type: 'number' },
          t: {
            items: [{ type: 'string' }, { type: 'boolean' }],
            type: 'array',
          },
        },
        required: ['a', 'c'],
        type: 'object',
      } as const;
      type S = typeof schema;
      const value: TypeFromJSONSchema<S> = {
        a: true,
        c: 1,
        d: [1], // extra properties are allowed
      };
      type Expected = {
        a: boolean;
        b?: string;
        c: number;
        t?: [string, boolean];
      } & JSONSchema7Object;
      type T = typeof value extends Expected ? Expected : never;
      const check: T = value;
      expect(value).toBe(check);
    });

    it('defined properties works with required properties and no additional properties', (): void => {
      const schema = {
        additionalProperties: false,
        properties: {
          a: { type: 'boolean' },
          b: { type: 'string' },
          c: { type: 'number' },
        },
        required: ['a', 'c'],
        type: 'object',
      } as const;
      type S = typeof schema;
      const value: TypeFromJSONSchema<S> = {
        a: true,
        c: 1,
      };
      type Expected = {
        a: boolean;
        b?: string;
        c: number;
      };
      type T = typeof value extends Expected ? Expected : never;
      const check: T = value;
      expect(value).toBe(check);
    });

    it('defined properties works with required properties and no additional number properties', (): void => {
      const schema = {
        additionalProperties: { type: 'number' },
        properties: {
          a: { type: 'boolean' },
        },
        required: ['a'],
        type: 'object',
      } as const;
      type S = typeof schema;
      const value: TypeFromJSONSchema<S> = {
        a: true,
        b: 1,
        c: 2,
      };
      // NOTE: MergeDifferentSignatures:
      // this would be the expected signature, but typescript doesn't allow to create such object:
      // >> error TS2322: Type '{ a: true; b: number; }' is not assignable to type 'Expected'.
      // >> Type '{ a: true; b: number; }' is not assignable to type '{ [x: string]: number; }'.
      // >>   Property 'a' is incompatible with index signature.
      // >>     Type 'boolean' is not assignable to type 'number'.
      // type Expected = { a: boolean } & { [x: string]: number };
      // const test: Expected = { a: true, b: 1 };
      type Expected = Record<string, boolean | number>;
      type T = typeof value extends Expected ? Expected : never;
      const check: T = value;
      expect(value).toBe(check);
    });

    it('pattern properties works', (): void => {
      const schema = {
        patternProperties: {
          ignoredKey: { type: 'boolean' },
          otherKey: { type: 'string' },
        },
        type: 'object',
      } as const;
      type S = typeof schema;
      const value: TypeFromJSONSchema<S> = {
        a: true,
        b: 'hello',
      };
      type Expected = {
        [x: string]: boolean | string;
      };
      type T = typeof value extends Expected ? Expected : never;
      const check: T = value;
      expect(value).toBe(check);
    });
  });
});
