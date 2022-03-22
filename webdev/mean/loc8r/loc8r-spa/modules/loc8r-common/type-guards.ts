import {
  _TypeOfLiteralToType as TypeOfLiteralToType,
  _TypeOfLiterals as TypeOfLiterals
} from './util-types';

/**
 * @file Typescript type-guards.
 */

/**
 * Asserts that given value is a Record<PropertyKey, unknown>.
 */
export function _isRecord(value: unknown): value is Record<PropertyKey, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Asserts that given value is a Record<PropertyKey, ValueT>.
 *
 * This variant of the type guard actually checks whether the value
 * of every property of the given object matches the desired type.
 * This is done using the runtime typeof operator that compares the
 * runtime typeof string of the property's value with expected typeof
 * literal passes as a second argument. The TypeOfLiteralToType
 * type is used to map typeof literal to the concrete TypeScript type.
 *
 * @note Guard doesn't allow function because confirming that value
 * is a function is not enough - the number and types of parameters
 * would also have to be checked as well as the return value type.
 * This is impossible to do at runtime without some metaprogramming.
 *
 * @warning Significant care must be taken when passing user-input
 * to this guard. Passing an object with many properties could lead
 * to long processing times, hence can be seen as a type of DoD
 * attack. At the very least, verify that number of properties in
 * in the user-specified object is expected before passing it here.
 */
export function _isRecordGeneric<T extends Exclude<TypeOfLiterals, 'function'>>(
  value: unknown, expectedTypeOf: T)
: value is Record<PropertyKey, TypeOfLiteralToType<T>> {
  if (!_isRecord(value)) {
    return false;
  }
  for (const prop in value) {
    if (typeof value[prop] !== expectedTypeOf) {
      return false;
    }
  }
  return true;
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

/**
 * Asserts that object contains a given property at runtime.
 *
 * Note the return signature of this type guard `obj is T & Record<K, unknown>`
 * meaning that `obj` contains all properties of T plus property K whose type
 * is unknown. This allows calling code to access K on obj.
 */
export function _hasOwnProperty<T extends { [key in PropertyKey ]: unknown}, K extends PropertyKey>(
  obj: T, prop: K): obj is T & Record<K, unknown> {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
