# TypeScript from JSON Schema

This is a TypeScript definitions that can automatically generate
TypeScript types given JSON Schema definitions **without** the
need of any code generator.

The caveat is that the JSON Schema must be declared using string
literals instead of generic strings, this is achieved by declaring the
objects `as const`.

The associated helper files will aid that task with some constants
and functions that returns properly typed constructions.

## Install

```sh
yarn add @profusion/json-schema-to-typescript-definitions
```

If you don't use our `commonSchemas` or `schemaHelpers`, you can
use it as a `--dev` dependency since the TypeScript checks are
done only in compile time.

## Usage

```ts
import type { TypeFromJSONSchema } from '@profusion/json-schema-to-typescript-definitions';

type MyObject = TypeFromJSONSchema<{
  type: 'object';
  properties: {
    a: { type: 'boolean' };
  };
  additionalProperties: false;
}>;
const o: MyObject = { a: true };
```

One can also use the function helpers to get properly typed objects:

```ts
import { commonSchemas, schemaHelpers } from '@profusion/json-schema-to-typescript-definitions';

// declares an actual schema object, you can use with Ajv and others
const schema = schemaHelpers.object({
  properties: {
    a: commonSchemas.boolean,
  },
});
const o: TypeFromJSONSchema<typeof schema> = { a: true };
```

## Similar Packages

This package is similar to
[json-schema-to-typescript](https://www.npmjs.com/package/json-schema-to-typescript),
however that one uses a code-generator that can work out JSON files.

This package requires `as const` so strings are kept as literals, but
requires no code generation. If you define your JSON schemas using
TypeScript, then you can avoid that code generation burden.

## License

Open source - [MIT](https://opensource.org/licenses/MIT).
