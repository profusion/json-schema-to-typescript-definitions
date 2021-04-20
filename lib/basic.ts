import { JSONSchema7Type } from './json-schema';

export type BooleanJSONSchemaType = 'boolean';
export type NullJSONSchemaType = 'null';
export type NumberJSONSchemaType = 'number' | 'integer';
export type StringJSONSchemaType = 'string';

export type ScalarJSONSchema = {
  type:
    | BooleanJSONSchemaType
    | NullJSONSchemaType
    | NumberJSONSchemaType
    | StringJSONSchemaType;
};

export type ScalarFromJSONSchema<
  T extends ScalarJSONSchema
> = T['type'] extends BooleanJSONSchemaType
  ? boolean
  : T['type'] extends NullJSONSchemaType
  ? null
  : T['type'] extends NumberJSONSchemaType
  ? number
  : T['type'] extends StringJSONSchemaType
  ? string
  : never;

export type ConstJSONSchema = { const: JSONSchema7Type };
export type EnumJSONSchema = { enum: readonly JSONSchema7Type[] };

export type DefinedValueJSONSchema = ConstJSONSchema | EnumJSONSchema;

export type ConstFromJSONSchema<T extends ConstJSONSchema> = T['const'];
export type EnumFromJSONSchema<T extends EnumJSONSchema> = T['enum'][number];

export type DefinedValueFromJSONSchema<
  T extends DefinedValueJSONSchema
> = T extends ConstJSONSchema
  ? ConstFromJSONSchema<T>
  : T extends EnumJSONSchema
  ? EnumFromJSONSchema<T>
  : never;

export type BasicJSONSchema = ScalarJSONSchema | DefinedValueJSONSchema;

// order is important, an element may define enum + string, the enum (literals) should be used!
export type BasicFromJSONSchema<
  T extends BasicJSONSchema
> = T extends DefinedValueJSONSchema
  ? DefinedValueFromJSONSchema<T>
  : T extends ScalarJSONSchema
  ? ScalarFromJSONSchema<T>
  : never;
