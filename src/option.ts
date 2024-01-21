import { Brand } from "./brand";

/**
 * Represents an option type, encapsulating an optional value.
 * @template T The type of the value.
 */
export type Some<T> = Brand<T, "Some">;

/**
 * Represents the absence of a value.
 */
export type None = Brand<undefined | null, "None">;

/**
 * Represents an option which can either be Some or None.
 * @template T The type of the value.
 */
export type Option<T> = Some<T> | None;
