// note this is more focused on TypeScript/tsc than Jest itself

import type { BasicFromJSONSchema } from './basic';

describe('check scalar definitions', (): void => {
  it('boolean works', (): void => {
    const value: BasicFromJSONSchema<{ type: 'boolean' }> = true;
    type Expected = boolean;
    type T = typeof value extends Expected ? Expected : never;
    const check: T = value;
    expect(value).toBe(check);
  });

  it('null works', (): void => {
    const value: BasicFromJSONSchema<{ type: 'null' }> = null;
    type Expected = null;
    type T = typeof value extends Expected ? Expected : never;
    const check: T = value;
    expect(value).toBe(check);
  });

  it('integer works', (): void => {
    const value: BasicFromJSONSchema<{ type: 'integer' }> = 1;
    type Expected = number;
    type T = typeof value extends Expected ? Expected : never;
    const check: T = value;
    expect(value).toBe(check);
  });

  it('number works', (): void => {
    const value: BasicFromJSONSchema<{ type: 'number' }> = 1;
    type Expected = number;
    type T = typeof value extends Expected ? Expected : never;
    const check: T = value;
    expect(value).toBe(check);
  });

  it('string works', (): void => {
    const value: BasicFromJSONSchema<{ type: 'string' }> = 'hello';
    type Expected = string;
    type T = typeof value extends Expected ? Expected : never;
    const check: T = value;
    expect(value).toBe(check);
  });
});

describe('check defined values definitions', (): void => {
  it('const works', (): void => {
    // note value type must be '1' and not 'number'!
    const value: BasicFromJSONSchema<{ const: 1; type: 'number' }> = 1;
    type Expected = 1;
    type T = typeof value extends Expected ? Expected : never;
    const check: T = value;
    expect(value).toBe(check);
  });

  it('enum works', (): void => {
    const value: BasicFromJSONSchema<{
      enum: [1, 'hello'];
      type: 'string';
    }> = 'hello';
    type Expected = 1 | 'hello';
    type T = typeof value extends Expected ? Expected : never;
    const check: T = value;
    expect(value).toBe(check);
  });
});
