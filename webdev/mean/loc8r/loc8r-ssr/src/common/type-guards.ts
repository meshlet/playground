/**
 * @file Typescript type-guards.
 */

/**
 * Asserts that given value is a Record<K, V>.
 */
export function _isRecord<K extends PropertyKey = string, V = unknown>(value: unknown)
: value is Record<K, V> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Asserts that a given key exists in an object.
 */
export function _isKeyOf<T>(key: PropertyKey, obj: T): key is keyof T {
  return key in obj;
}

/**
 * Asserts that typeof returns the same value for arg1 and arg2.
 *
 * This is intended to be used to narrow types in case where TypeScript's
 * narrowing via typeof doesn't give desired results. For example,
 * typeof obj[string] === typeof variable, doesn't necessarily make it
 * valid to assing variable to obj[string].
 */
export function _typeofMatches<T>(arg1: unknown, arg2: T): arg1 is T {
  return typeof arg1 === typeof arg2;
}
