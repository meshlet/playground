/**
 * Typescript utility types.
 */

/**
 * For two types T1 and T2, it returns T1 if both T1 extends T2 and
 * T2 extends T1 (meaning T1 = T2), otherwise returns never.
 *
 * @note This utility can be used to ensure that only argument of a given
 * type can be passed to the function. For all other types, argument will
 * have never type causing compilation error.
 */
export type _Exact<T1, T2> = T1 extends T2 ? T2 extends T1 ? T1 : never : never;

/**
 * A type for an empty object, i.e. object with no properties.
 */
export type _EmptyObject = Record<string, never>;

/**
 * A type that will accept any type of function.
 */
export type _FunctionT = <T extends unknown[], R>(...args: T) => R;

/** For given array type, it returns the type of its elements. */
export type _ExtractArrayElemT<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

/**
 * Checks whether type T contains property key K, and if it does, returns
 * value type for that property in T.
 *
 * @note K can be a union of properties in which case a union of property
 * types are returned if T contains all of the keys in union K.
 */
export type _ContainsKeyT<T, K extends PropertyKey, RetTypeOfFalse = void> =
  T extends { [key in K]: unknown } ? T[K] : RetTypeOfFalse;

/**
 * Similar to _ContainsKeyT but lets caller specify the return types in
 * case T contains K and in case it doesn't.
 */
export type _ContainsKeyExtendedT<T, K extends PropertyKey, RetTypeIfTrue, RetTypeIfFalse = unknown> =
  T extends { [key in K]: unknown } ? RetTypeIfTrue : RetTypeIfFalse;

/**
 * A union of all possible typeof operator literals.
 */
export type _TypeOfLiterals =
  'bigint' | 'boolean' | 'number' | 'object' | 'string' | 'symbol' | 'undefined' | 'function';

/**
 * Maps TypeScript types into corresponding string literal produced
 * by the typeof operator.
 */
export type _TypeToTypeOfLiteral<T> =
  T extends bigint ? 'bigint' :
  T extends boolean ? 'boolean' :
  T extends number ? 'number' :
  T extends object ? 'object' :
  T extends string ? 'string' :
  T extends symbol ? 'symbol' :
  T extends _FunctionT ? 'function' :
  T extends undefined ? 'undefined' :
  never;

/**
 * Maps typeof string literal into corresponding TypeScript type.
 */
export type _TypeOfLiteralToType<T> =
  T extends 'bigint' ? bigint :
  T extends 'boolean' ? boolean :
  T extends 'number' ? number :
  T extends 'object' ? object :
  T extends 'string' ? string :
  T extends 'symbol' ? symbol :
  T extends 'function' ? _FunctionT :
  T extends 'undefined' ? undefined :
  never;
