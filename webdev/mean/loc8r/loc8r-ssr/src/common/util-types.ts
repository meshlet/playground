/**
 * Typescript utility types.
 */

/**
 * For two types T1 and T2, it returns T1 if both T1 extends T2 and
 * T2 extends T1 (meaning T1 = T2), otherwise returns never.
 *
 * @note This utility can be used to ensure that only argument of a given
 * type can be passed to the function. For all other types, argument will
 * have never causing compilation error.
 */
export type _Exact<T1, T2> = T1 extends T2 ? T2 extends T1 ? T1 : never : never;

/**
 * A type for an empty object, i.e. object with no properties.
 */
export type _EmptyObject = Record<string, never>;
