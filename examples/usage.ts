/* eslint-disable no-console */
import type { TypeFromJSONSchema } from '../lib'; // or '@profusion/json-schema-to-typescript-definitions';

// these utilities are provided in separate files
import { commonSchemas, schemaHelpers } from '../lib';

type MyObject = TypeFromJSONSchema<{
  type: 'object';
  properties: {
    a: { type: 'boolean' };
  };
  additionalProperties: false;
}>;
const o1: MyObject = { a: true };
console.log(o1);

const schema = schemaHelpers.object({
  properties: {
    a: commonSchemas.boolean,
  },
});
const o2: TypeFromJSONSchema<typeof schema> = { a: true };
console.log(o2);
