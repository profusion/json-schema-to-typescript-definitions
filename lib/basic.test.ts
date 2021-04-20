// note this is more focused on TypeScript/tsc than Jest itself

import type { BasicFromJSONSchema } from './basic';

describe('check scalar definitions', (): void => {
  it('boolean works', (): void => {
    const schema = { type: 'boolean' } as const;
    type S = typeof schema;
    const value: BasicFromJSONSchema<S> = true;
    type Expected = boolean;
    type T = typeof value extends Expected ? Expected : never;
    const check: T = value;
    expect(value).toBe(check);
  });

  it('null works', (): void => {
    const schema = { type: 'null' } as const;
    type S = typeof schema;
    const value: BasicFromJSONSchema<S> = null;
    type Expected = null;
    type T = typeof value extends Expected ? Expected : never;
    const check: T = value;
    expect(value).toBe(check);
  });

  it('integer works', (): void => {
    const schema = { type: 'integer' } as const;
    type S = typeof schema;
    const value: BasicFromJSONSchema<S> = 1;
    type Expected = number;
    type T = typeof value extends Expected ? Expected : never;
    const check: T = value;
    expect(value).toBe(check);
  });

  it('number works', (): void => {
    const schema = { type: 'number' } as const;
    type S = typeof schema;
    const value: BasicFromJSONSchema<S> = 1;
    type Expected = number;
    type T = typeof value extends Expected ? Expected : never;
    const check: T = value;
    expect(value).toBe(check);
  });

  it('string works', (): void => {
    const schema = { type: 'string' } as const;
    type S = typeof schema;
    const value: BasicFromJSONSchema<S> = 'hello';
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
    const value: BasicFromJSONSchema<S> = 1;
    type Expected = 1;
    type T = typeof value extends Expected ? Expected : never;
    const check: T = value;
    expect(value).toBe(check);
  });

  it('const array works', (): void => {
    const schema = { const: [1, 2] } as const;
    type S = typeof schema;
    // note value type must be '1' and not 'number'!
    const value: BasicFromJSONSchema<S> = [1, 2] as const;
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
    const value: BasicFromJSONSchema<S> = 'hello';
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
    const value: BasicFromJSONSchema<S> = [1, 2] as const;
    type Expected = readonly [1, 2] | 'hello';
    type T = typeof value extends Expected ? Expected : never;
    const check: T = value;
    expect(value).toBe(check);
  });
});
