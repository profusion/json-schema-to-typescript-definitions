import schemaHelpers from './schema-helpers';

// https://json-schema.org/understanding-json-schema/reference/string.html#format
export default {
  boolean: { type: 'boolean' },
  byte: schemaHelpers.string.format('byte'),
  date: schemaHelpers.string.format('date'),
  dateTime: schemaHelpers.string.format('date-time'),
  duration: schemaHelpers.string.format('duration'),
  email: schemaHelpers.string.format('email'),
  hostname: schemaHelpers.string.format('hostname'),
  integer: { type: 'integer' },
  integerNegative: schemaHelpers.number.range({ maximum: 0 }, 'integer'),
  integerPositive: schemaHelpers.number.range({ minimum: 0 }, 'integer'),
  ip: schemaHelpers.anyOf(
    schemaHelpers.string.format('ipv4'),
    schemaHelpers.string.format('ipv6'),
  ),
  ipOrHostname: schemaHelpers.anyOf(
    schemaHelpers.string.format('ipv4'),
    schemaHelpers.string.format('ipv6'),
    schemaHelpers.string.format('hostname'),
  ),
  ipv4: schemaHelpers.string.format('ipv4'),
  ipv6: schemaHelpers.string.format('ipv6'),
  nonEmptyString: schemaHelpers.string.length({ minLength: 1 }),
  null: { type: 'null' },
  number: { type: 'number' },
  numberNegative: schemaHelpers.number.range({ maximum: 0 }),
  numberPositive: schemaHelpers.number.range({ minimum: 0 }),
  regex: schemaHelpers.string.format('regex'),
  string: { type: 'string' },
  time: schemaHelpers.string.format('time'),
  uri: schemaHelpers.string.format('uri'),
  uriReference: schemaHelpers.string.format('uri-reference'),
  uuid: schemaHelpers.string.format('uuid'),
} as const;
