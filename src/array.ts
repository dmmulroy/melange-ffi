type UnionToIntersection<Union> = (
  Union extends any ? (argument: Union) => void : never
) extends (argument: infer Intersection) => void
  ? Intersection
  : never;

type IsSingleType<T> = [T] extends [UnionToIntersection<T>] ? true : false;

/**
 * Represents a single type that iss not a union of multiple types.
 * @template T The tyoe of the single type.
 */
export type SingleTypeOf<T> = IsSingleType<T> extends true ? T : never;

/**
 * Represents an array of a single type.
 * @template T The type of elements in the array.
 */
export type ArrayOf<T> = Array<SingleTypeOf<T>>;

/**
 * Represents an array of a single type or another array of the same type.
 * @template T The type of elements in the array and or nested array.
 *
 * @example
 * const nestedNumberArray = [1, 2, [3, [4, 5]]]
 */
export type NestableArrayOf<T> = Array<SingleTypeOf<T> | NestableArrayOf<T>>;
