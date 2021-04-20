// Redeclare 'json-schema' in a `as const` friendly way

import type {
  JSONSchema7 as RWJSONSchema7,
  JSONSchema7Definition as RWJSONSchema7Definition,
  JSONSchema7Object as RWJSONSchema7Object,
  JSONSchema7Type as RWJSONSchema7Type,
} from 'json-schema';

export type DeepReadonly<T> = T extends
  | boolean
  | number
  | string
  | null
  | undefined
  ? T
  : T extends Array<infer U>
  ? ReadonlyArray<DeepReadonly<U>>
  : { readonly [P in keyof T]: DeepReadonly<T[P]> };

export type JSONSchema7 = DeepReadonly<RWJSONSchema7>;
export type JSONSchema7Definition = DeepReadonly<RWJSONSchema7Definition>;
export type JSONSchema7Object = DeepReadonly<RWJSONSchema7Object>;
export type JSONSchema7Type = DeepReadonly<RWJSONSchema7Type>;
