/**
 * A unique symbol used internally for creating branded types.
 * This symbol acts as a unique tag for the brand, ensuring that each branded type is distinct.
 *
 * @const BRAND
 */
declare const BRAND: unique symbol;

/**
 * Represents a branded type.
 * A branded type is a base type (T) extended with a unique brand (B), making it distinct from the base type.
 * This is used for creating types that are structurally identical to a base type but are treated as unique by the type system.
 *
 * @template T The base type to be branded.
 * @template B The brand type, typically a string literal type that uniquely identifies the brand.
 * @type {Brand<T, B>}
 */
export type Brand<T, B> = T & { [BRAND]: B };
