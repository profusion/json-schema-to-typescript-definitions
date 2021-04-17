// note this is more focused on TypeScript/tsc than Jest itself

// eslint-disable-next-line import/no-extraneous-dependencies
import { JSONSchema7Object, JSONSchema7Type } from 'json-schema';

import type { TypeFromJSONSchema } from './index';

// keep in sync with basic.d.test.ts
describe('basic definitions', (): void => {
  describe('check scalar definitions', (): void => {
    it('boolean works', (): void => {
      const value: TypeFromJSONSchema<{ type: 'boolean' }> = true;
      type Expected = boolean;
      type T = typeof value extends Expected ? Expected : never;
      const check: T = value;
      expect(value).toBe(check);
    });

    it('null works', (): void => {
      const value: TypeFromJSONSchema<{ type: 'null' }> = null;
      type Expected = null;
      type T = typeof value extends Expected ? Expected : never;
      const check: T = value;
      expect(value).toBe(check);
    });

    it('integer works', (): void => {
      const value: TypeFromJSONSchema<{ type: 'integer' }> = 1;
      type Expected = number;
      type T = typeof value extends Expected ? Expected : never;
      const check: T = value;
      expect(value).toBe(check);
    });

    it('number works', (): void => {
      const value: TypeFromJSONSchema<{ type: 'number' }> = 1;
      type Expected = number;
      type T = typeof value extends Expected ? Expected : never;
      const check: T = value;
      expect(value).toBe(check);
    });

    it('string works', (): void => {
      const value: TypeFromJSONSchema<{ type: 'string' }> = 'hello';
      type Expected = string;
      type T = typeof value extends Expected ? Expected : never;
      const check: T = value;
      expect(value).toBe(check);
    });
  });

  describe('check defined values definitions', (): void => {
    it('const works', (): void => {
      // note value type must be '1' and not 'number'!
      const value: TypeFromJSONSchema<{ const: 1; type: 'number' }> = 1;
      type Expected = 1;
      type T = typeof value extends Expected ? Expected : never;
      const check: T = value;
      expect(value).toBe(check);
    });

    it('enum works', (): void => {
      const value: TypeFromJSONSchema<{
        enum: [1, 'hello'];
        type: 'string';
      }> = 'hello';
      type Expected = 1 | 'hello';
      type T = typeof value extends Expected ? Expected : never;
      const check: T = value;
      expect(value).toBe(check);
    });
  });
});

describe('combination definitions', (): void => {
  it('allOf works', (): void => {
    const value: TypeFromJSONSchema<{
      allOf: [
        { type: 'string'; minLength: 1 },
        { type: 'string'; maxLength: 10 },
      ];
    }> = 'hello';
    type Expected = string;
    type T = typeof value extends Expected ? Expected : never;
    const check: T = value;
    expect(value).toBe(check);
  });

  it('anyOf works', (): void => {
    const value: TypeFromJSONSchema<{
      anyOf: [{ type: 'boolean' }, { type: 'string' }];
    }> = true;
    type Expected = boolean | string;
    type T = typeof value extends Expected ? Expected : never;
    const check: T = value;
    expect(value).toBe(check);
  });

  it('allOf works', (): void => {
    const value: TypeFromJSONSchema<{
      allOf: [{ type: 'boolean' }, { type: 'string' }];
    }> = true;
    type Expected = boolean | string;
    type T = typeof value extends Expected ? Expected : never;
    const check: T = value;
    expect(value).toBe(check);
  });

  describe('not works', (): void => {
    it('with basic type', (): void => {
      const value: TypeFromJSONSchema<{ not: { type: 'boolean' } }> = 1;
      type Expected = Exclude<JSONSchema7Type, boolean>;
      type T = typeof value extends Expected ? Expected : never;
      const check: T = value;
      expect(value).toBe(check);
    });

    it('with combination type', (): void => {
      const value: TypeFromJSONSchema<{
        not: { anyOf: [{ type: 'boolean' }, { type: 'string' }] };
      }> = 1;
      type Expected = Exclude<JSONSchema7Type, boolean | string>;
      type T = typeof value extends Expected ? Expected : never;
      const check: T = value;
      expect(value).toBe(check);
    });

    it('with container type', (): void => {
      const value: TypeFromJSONSchema<{
        not: { type: 'object'; properties: { a: { type: 'number' } } };
      }> = 1;
      type Expected = Exclude<JSONSchema7Type, boolean | string>;
      type T = typeof value extends Expected ? Expected : never;
      const check: T = value;
      expect(value).toBe(check);
    });
  });

  it('oneOf works', (): void => {
    const value: TypeFromJSONSchema<{
      oneOf: [{ type: 'boolean' }, { type: 'string' }];
    }> = true;
    type Expected = boolean | string;
    type T = typeof value extends Expected ? Expected : never;
    const check: T = value;
    expect(value).toBe(check);
  });
});

describe('container definitions', (): void => {
  describe('array definitions', (): void => {
    it('homogeneous works', (): void => {
      const value: TypeFromJSONSchema<{
        type: 'array';
        items: { type: 'boolean' };
      }> = [true, false];
      type Expected = boolean[];
      type T = typeof value extends Expected ? Expected : never;
      const check: T = value;
      expect(value).toBe(check);
    });

    it('untyped homogeneous works', (): void => {
      const value: TypeFromJSONSchema<{
        type: 'array';
      }> = [true, false];
      type Expected = JSONSchema7Type[];
      type T = typeof value extends Expected ? Expected : never;
      const check: T = value;
      expect(value).toBe(check);
    });

    it('untyped homogeneous works (items: true)', (): void => {
      const value: TypeFromJSONSchema<{
        type: 'array';
        items: true;
      }> = [true, false];
      type Expected = JSONSchema7Type[];
      type T = typeof value extends Expected ? Expected : never;
      const check: T = value;
      expect(value).toBe(check);
    });

    it('tuple works', (): void => {
      const value: TypeFromJSONSchema<{
        type: 'array';
        items: [{ type: 'boolean' }, { type: 'string' }];
      }> = [true, 'hello'];
      type Expected = [boolean, string];
      type T = typeof value extends Expected ? Expected : never;
      const check: T = value;
      expect(value).toBe(check);
    });

    it('untyped tuple works', (): void => {
      const value: TypeFromJSONSchema<{
        type: 'array';
        items: [true, true];
      }> = [true, 'hello'];
      type Expected = [JSONSchema7Type, JSONSchema7Type];
      type T = typeof value extends Expected ? Expected : never;
      const check: T = value;
      expect(value).toBe(check);
    });
  });

  describe('object definitions', (): void => {
    it('defined properties works', (): void => {
      const value: TypeFromJSONSchema<{
        type: 'object';
        properties: {
          a: { type: 'boolean' };
          b: { type: 'string' };
          c: { type: 'number' };
        };
      }> = {
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
      const value: TypeFromJSONSchema<{
        type: 'object';
        properties: {
          a: { type: 'boolean' };
          b: { type: 'string' };
          c: { type: 'number' };
        };
        required: ['a', 'c'];
      }> = {
        a: true,
        c: 1,
        d: [1], // extra properties are allowed
      };
      type Expected = {
        a: boolean;
        b?: string;
        c: number;
      } & JSONSchema7Object;
      type T = typeof value extends Expected ? Expected : never;
      const check: T = value;
      expect(value).toBe(check);
    });

    it('defined properties works with required properties and no additional properties', (): void => {
      const value: TypeFromJSONSchema<{
        type: 'object';
        properties: {
          a: { type: 'boolean' };
          b: { type: 'string' };
          c: { type: 'number' };
        };
        required: ['a', 'c'];
        additionalProperties: false;
      }> = {
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
      const value: TypeFromJSONSchema<{
        type: 'object';
        properties: {
          a: { type: 'boolean' };
        };
        required: ['a'];
        additionalProperties: { type: 'number' };
      }> = {
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
      const value: TypeFromJSONSchema<{
        type: 'object';
        patternProperties: {
          ignoredKey: { type: 'boolean' };
          otherKey: { type: 'string' };
        };
      }> = {
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
