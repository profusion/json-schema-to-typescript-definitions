import type {
  JSONSchema7,
  JSONSchema7Definition,
  JSONSchema7Object,
  JSONSchema7Type,
} from 'json-schema';

import type { BasicJSONSchema, BasicFromJSONSchema } from './basic';

// -- Helpers
export type TypeFromJSONSchemaDefinitionFlag<T extends boolean> = T extends true
  ? JSONSchema7Type
  : never;

/* eslint-disable no-use-before-define */
export type TypeFromJSONSchemaOrPreserve<T> = T extends boolean
  ? TypeFromJSONSchemaDefinitionFlag<T>
  : T extends JSONSchema7
  ? TypeFromJSONSchema<T>
  : T;
/* eslint-enable no-use-before-define */

export type TypeFromJSONSchemaArray<T extends JSONSchema7Definition[]> = {
  [K in keyof T]: TypeFromJSONSchemaOrPreserve<T[K]>;
};

export type TypeFromJSONSchemaObjectProperties<
  T extends Record<string, JSONSchema7Definition>
> = {
  [K in keyof T]: TypeFromJSONSchemaOrPreserve<T[K]>;
};

// -- Combination
export type AllOfJSONSchema = { allOf: JSONSchema7[] };
export type AnyOfJSONSchema = { anyOf: JSONSchema7[] };
export type NotJSONSchema = { not: JSONSchema7 };
export type OneOfJSONSchema = { oneOf: JSONSchema7[] };

// Combination Union
export type CombinationJSONSchema =
  | AllOfJSONSchema
  | AnyOfJSONSchema
  | NotJSONSchema
  | OneOfJSONSchema;

// I couldn't find a way to produce a '&' of all types
// in order to produce 'never' when incompatible types
// are used, such as boolean & string. But since this
// would be unusable with JSON Schema anyway, then believe
// union will produce the correct result.
export type AllOfFromJSONSchema<
  T extends AllOfJSONSchema
> = TypeFromJSONSchemaArray<T['allOf']>[number];

export type AnyOfFromJSONSchema<
  T extends AnyOfJSONSchema
> = TypeFromJSONSchemaArray<T['anyOf']>[number];

export type NotFromJSONSchema<T extends NotJSONSchema> = Exclude<
  JSONSchema7Type,
  TypeFromJSONSchemaOrPreserve<T['not']>
>;

export type OneOfFromJSONSchema<
  T extends OneOfJSONSchema
> = TypeFromJSONSchemaArray<T['oneOf']>[number];

export type CombinationFromJSONSchema<
  T extends CombinationJSONSchema
> = T extends AllOfJSONSchema
  ? AllOfFromJSONSchema<T>
  : T extends AnyOfJSONSchema
  ? AnyOfFromJSONSchema<T>
  : T extends NotJSONSchema
  ? NotFromJSONSchema<T>
  : T extends OneOfJSONSchema
  ? OneOfFromJSONSchema<T>
  : never;

// -- Container
// Array
export type ArrayJSONSchema = { type: 'array' };
type ArrayHomogeneousJSONSchema = { items: JSONSchema7Definition };
type ArrayTupleJSONSchema = { items: JSONSchema7Definition[] };

type ArrayHomogeneousFromJSONSchema<
  T extends ArrayHomogeneousJSONSchema
> = TypeFromJSONSchemaOrPreserve<T['items']>[];

type ArrayTupleFromJSONSchema<
  T extends ArrayTupleJSONSchema
> = TypeFromJSONSchemaArray<T['items']>;

export type ArrayFromJSONSchema<
  T extends ArrayJSONSchema
> = T extends ArrayHomogeneousJSONSchema
  ? ArrayHomogeneousFromJSONSchema<T>
  : T extends ArrayTupleJSONSchema
  ? ArrayTupleFromJSONSchema<T>
  : JSONSchema7Type[];

// Object
export type ObjectJSONSchema = { type: 'object' };
type ObjectAdditionalPropertiesJSONSchema = {
  additionalProperties?: JSONSchema7Definition;
};
type ObjectDefinedPropertiesJSONSchema = {
  properties: { [key: string]: JSONSchema7Definition };
  required?: string[];
};
type ObjectPatternPropertiesJSONSchema = {
  patternProperties: { [key: string]: JSONSchema7Definition };
};

// NOTE: in theory A & B would work, but typescript
// doesn't allow objects to be generated, thus this would be correct yet useless.
type MergeDifferentSignatures<A, B extends Record<string, unknown>> = Record<
  string,
  A[keyof A] | B[string]
>;

type ObjectAdditionalPropertiesFromJSONSchema<
  T extends ObjectAdditionalPropertiesJSONSchema,
  O extends JSONSchema7Object
> = T['additionalProperties'] extends false
  ? O
  : T['additionalProperties'] extends JSONSchema7
  ? MergeDifferentSignatures<
      O,
      Record<string, TypeFromJSONSchemaOrPreserve<T['additionalProperties']>>
    >
  : O & JSONSchema7Object;

type FilterRequired<T, R extends string[] | undefined> = R extends string[]
  ? Pick<T, Extract<R[number], keyof T>> &
      Partial<Omit<T, Extract<R[number], keyof T>>>
  : Partial<T>;

type ObjectDefinedPropertiesFromJSONSchema<
  T extends ObjectDefinedPropertiesJSONSchema
> = FilterRequired<
  TypeFromJSONSchemaObjectProperties<T['properties']>,
  T['required']
>;

// Patterns still unsupported in TS, so mapped as Record<string, UnionOfAllTypes>
type ObjectPatternPropertiesFromJSONSchema<
  T extends ObjectPatternPropertiesJSONSchema
> = Record<
  string,
  TypeFromJSONSchemaObjectProperties<
    T['patternProperties']
  >[keyof T['patternProperties']]
>;

type ObjectPropertiesFromJSONSchema<
  T
> = T extends ObjectDefinedPropertiesJSONSchema
  ? ObjectDefinedPropertiesFromJSONSchema<T>
  : T extends ObjectPatternPropertiesJSONSchema
  ? ObjectPatternPropertiesFromJSONSchema<T>
  : JSONSchema7Object;

export type ObjectFromJSONSchema<
  T extends ObjectJSONSchema
> = ObjectPropertiesFromJSONSchema<T> &
  (T extends ObjectAdditionalPropertiesJSONSchema // should always be true, but TS is not that smart
    ? ObjectAdditionalPropertiesFromJSONSchema<
        T,
        ObjectPropertiesFromJSONSchema<T>
      >
    : ObjectPropertiesFromJSONSchema<T> & JSONSchema7Object);

// Container Union
export type ContainerJSONSchema = ArrayJSONSchema | ObjectJSONSchema;

type ContainerFromJSONSchema<
  T extends ContainerJSONSchema
> = T extends ArrayJSONSchema
  ? ArrayFromJSONSchema<T>
  : T extends ObjectJSONSchema
  ? ObjectFromJSONSchema<T>
  : never;

// -- Convert from all types
export type TypeFromJSONSchema<
  T extends JSONSchema7
> = T extends BasicJSONSchema
  ? BasicFromJSONSchema<T>
  : T extends CombinationJSONSchema
  ? CombinationFromJSONSchema<T>
  : T extends ContainerJSONSchema
  ? ContainerFromJSONSchema<T>
  : JSONSchema7Type;

type IsOptionalTypeFromJSONSchema<
  T extends JSONSchema7Type,
  DefaultValueType extends JSONSchema7Type | undefined
> = DefaultValueType extends JSONSchema7Type ? T : T | undefined;

// If optional (not required) without a default value,
// then it becomes TypeFromJSONSchema<Type> | undefined
export type OptionalTypeFromJSONSchema<
  T extends JSONSchema7Type,
  IsOptionalType extends boolean | undefined,
  DefaultValueType extends JSONSchema7Type | undefined
> = IsOptionalType extends true
  ? IsOptionalTypeFromJSONSchema<T, DefaultValueType>
  : T;
