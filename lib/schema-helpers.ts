// we just want type-checking on JSONSchema7
import type {
  JSONSchema7,
  JSONSchema7Definition,
  JSONSchema7Type,
} from 'json-schema';

import type { NumberJSONSchemaType } from './basic';

type ArrayItemsParam = {
  items?: JSONSchema7Definition | JSONSchema7Definition[];
  additionalItems?: JSONSchema7Definition;
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
  contains?: JSONSchema7;
};

type NumberRangeParam = {
  exclusiveMaximum?: number;
  exclusiveMinimum?: number;
  maximum?: number;
  minimum?: number;
};

type ObjectPropertiesParam = {
  maxProperties?: number;
  minProperties?: number;
  required?: string[];
  properties?: {
    [key: string]: JSONSchema7Definition;
  };
  patternProperties?: {
    [key: string]: JSONSchema7Definition;
  };
  additionalProperties?: JSONSchema7Definition;
  dependencies?: {
    [key: string]: JSONSchema7Definition | string[];
  };
  propertyNames?: JSONSchema7Definition;
};

type StringLengthParam = {
  maxLength?: number;
  minLength?: number;
};

export default {
  allOf: <T extends JSONSchema7Definition[]>(
    ...schemas: T
  ): Readonly<{ allOf: T }> => ({
    allOf: schemas,
  }),
  anyOf: <T extends JSONSchema7Definition[]>(
    ...schemas: T
  ): Readonly<{ anyOf: T }> => ({
    anyOf: schemas,
  }),
  array: <T extends ArrayItemsParam>(
    param: T,
  ): Readonly<T & { type: 'array' }> => ({
    ...param,
    type: 'array',
  }),
  const: <T extends JSONSchema7Type>(value: T): Readonly<{ const: T }> => ({
    const: value,
  }),
  enum: <T extends JSONSchema7Type[]>(
    ...schemas: T
  ): Readonly<{ enum: T }> => ({
    enum: schemas,
  }),
  number: {
    multipleOf: <T extends NumberJSONSchemaType = 'number'>(
      multipleOf: number,
      type?: T,
    ): Readonly<{ multipleOf: number; type: T }> => ({
      multipleOf,
      type: (type || 'number') as T,
    }),
    range: <
      P extends NumberRangeParam,
      T extends NumberJSONSchemaType = 'number'
    >(
      param: P,
      type?: T,
    ): Readonly<P & { type: T }> => ({
      ...param,
      type: (type || 'number') as T,
    }),
  },
  object: <T extends ObjectPropertiesParam>(
    param: T,
  ): Readonly<T & { type: 'object' }> => ({
    ...param,
    type: 'object',
  }),
  oneOf: <T extends JSONSchema7Definition[]>(
    ...schemas: T
  ): Readonly<{ oneOf: T }> => ({
    oneOf: schemas,
  }),
  orNull: <T extends JSONSchema7Definition>(
    schema: T,
  ): Readonly<{ anyOf: [T, { type: 'null' }] }> => ({
    anyOf: [schema, { type: 'null' }],
  }),
  schema: <T extends JSONSchema7>(schema: T): Readonly<T> => schema, // easy typing
  string: {
    format: <F extends string>(
      format: F,
    ): Readonly<{ format: F; type: 'string' }> => ({
      format,
      type: 'string',
    }),
    length: <T extends StringLengthParam>(
      param: T,
    ): Readonly<T & { type: 'string' }> => ({
      ...param,
      type: 'string',
    }),
    pattern: <T extends StringLengthParam>(
      pattern: string,
      length?: T,
    ): Readonly<T & { pattern: string; type: 'string' }> => ({
      ...(length as T),
      pattern,
      type: 'string',
    }),
  },
} as const;
