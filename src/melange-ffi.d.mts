export namespace Types {
  /**
   * A unique symbol used internally for creating branded types.
   * This symbol acts as a unique tag for the brand, ensuring that each branded type is distinct.
   *
   * @const BRAND
   */
  const BRAND: unique symbol;

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

  /**
   * Represents a nominal type.
   * Nominal types are a specific kind of branded type where the base type is `void`.
   * They are useful for creating types that have no runtime representation but are distinct at the type level.
   *
   * @template B The brand for the nominal type, typically a unique string literal.
   * @type {Nominal<B>}
   */
  export type Nominal<B> = Brand<void, B>;

  /**
   * Converts a given value to a branded type.
   * This function takes a value of type T and a brand of type B and returns a new value that is
   * of the branded type `Brand<T, B>`. The branded type ensures that the value is treated as unique
   * in the type system, even though it is structurally the same as the original type.
   *
   * @template T The type of the value to be branded.
   * @template B The type of the brand.
   * @param {T} value The value to be branded.
   * @param {B} _brand The brand to apply to the value. The underscore prefix indicates that this parameter is not used at runtime, but only for type inference.
   * @returns {Brand<T, B>} The value as a branded type.
   */
  export function toBrandedType<T, B>(value: T, _brand: B): Brand<T, B>;

  /**
   * Converts a given value to a nominal type.
   * This function takes a value of any type T and a typeName of type B, and returns a new value
   * of the nominal type `Nominal<B>`. Nominal types are used to create types that are distinct at
   * the type level but have no runtime representation. This is particularly useful for adding type
   * safety by distinguishing between different types that would otherwise be structurally identical.
   *
   * @template T The type of the value being converted.
   * @template B The type of the nominal type name.
   * @param {T} value The value to be converted. This parameter is not used at runtime but is necessary for type inference.
   * @param {B} typeName The name of the nominal type.
   * @returns {Nominal<B>} The value as a nominal type.
   */
  export function toNominalType<T, B>(value: T, typeName: B): Nominal<B>;
}

export namespace Function {
  /**
   * Represents a curried function with one argument.
   * This interface describes a function that can be invoked with no arguments, returning itself,
   * or with one argument of type T1, returning a result of type R.
   *
   * @template T1 The type of the first argument.
   * @template R The type of the result.
   */
  export interface CurriedFunctionWithArity1<T1, R> {
    (): CurriedFunctionWithArity1<T1, R>;
    (t1: T1): R;
  }

  /**
   * Represents a curried function with two arguments.
   * This interface describes a function that can be called with varying numbers of arguments.
   * It can be invoked with no arguments, returning itself, with one argument of type T1,
   * returning a function expecting the second argument of type T2, or with both arguments,
   * returning a result of type R.
   *
   * @template T1 The type of the first argument.
   * @template T2 The type of the second argument.
   * @template R The type of the result.
   */
  export interface CurriedFunctionWithArity2<T1, T2, R> {
    (): CurriedFunctionWithArity2<T1, T2, R>;
    (t1: T1): CurriedFunctionWithArity1<T2, R>;
    (t1: T1, t2: T2): CurriedFunctionWithArity1<T1, R>;
    (t1: T1, t2: T2): R;
  }

  /**
   * Represents a curried function with three arguments.
   * This interface allows for a function to be called with a varying number of arguments up to three.
   * Each call with less than three arguments returns a new function expecting the remaining arguments.
   * Calls can be made with any combination of arguments by specifying 'never' for skipped arguments.
   *
   * @template T1 The type of the first argument.
   * @template T2 The type of the second argument.
   * @template T3 The type of the third argument.
   * @template R The type of the result.
   */
  export interface CurriedFunctionWithArity3<T1, T2, T3, R> {
    (): CurriedFunctionWithArity3<T1, T2, T3, R>;
    (t1: T1): CurriedFunctionWithArity2<T2, T3, R>;
    (t1: never, t2: T2): CurriedFunctionWithArity2<T1, T3, R>;
    (t1: T1, t2: T2): CurriedFunctionWithArity1<T3, R>;
    (t1: never, t2: never, t3: T3): CurriedFunctionWithArity2<T1, T2, R>;
    (t1: T1, t2: never, t3: T3): CurriedFunctionWithArity1<T2, R>;
    (t1: never, t2: T2, t3: T3): CurriedFunctionWithArity1<T1, R>;
    (t1: T1, t2: T2, t3: T3): R;
  }
  /**
   * Represents a curried function with four arguments.
   * This interface describes a function that can be invoked with varying numbers of arguments up to four.
   * Each invocation with fewer than four arguments returns a new function expecting the remaining arguments.
   * It allows for omitting arguments by specifying 'never', which returns a function expecting the non-omitted arguments.
   *
   * @template T1 The type of the first argument.
   * @template T2 The type of the second argument.
   * @template T3 The type of the third argument.
   * @template T4 The type of the fourth argument.
   * @template R The type of the result.
   */
  export interface CurriedFunctionWithArity4<T1, T2, T3, T4, R> {
    (): CurriedFunctionWithArity4<T1, T2, T3, T4, R>;
    (t1: T1): CurriedFunctionWithArity3<T2, T3, T4, R>;
    (t1: never, t2: T2): CurriedFunctionWithArity3<T1, T3, T4, R>;
    (t1: T1, t2: T2): CurriedFunctionWithArity2<T3, T4, R>;
    (t1: never, t2: never, t3: T3): CurriedFunctionWithArity3<T1, T2, T4, R>;
    (t1: never, t2: never, t3: T3): CurriedFunctionWithArity2<T2, T4, R>;
    (t1: never, t2: T2, t3: T3): CurriedFunctionWithArity2<T1, T4, R>;
    (t1: T1, t2: T2, t3: T3): CurriedFunctionWithArity1<T4, R>;
    (
      t1: never,
      t2: never,
      t3: never,
      t4: T4,
    ): CurriedFunctionWithArity3<T1, T2, T3, R>;
    (
      t1: T1,
      t2: never,
      t3: never,
      t4: T4,
    ): CurriedFunctionWithArity2<T2, T3, R>;
    (
      t1: never,
      t2: T2,
      t3: never,
      t4: T4,
    ): CurriedFunctionWithArity2<T1, T3, R>;
    (
      t1: never,
      t2: never,
      t3: T3,
      t4: T4,
    ): CurriedFunctionWithArity2<T1, T2, R>;
    (t1: T1, t2: T2, t3: never, t4: T4): CurriedFunctionWithArity1<T3, R>;
    (t1: T1, t2: never, t3: T3, t4: T4): CurriedFunctionWithArity1<T2, R>;
    (t1: never, t2: T2, t3: T3, t4: T4): CurriedFunctionWithArity1<T1, R>;
    (t1: T1, t2: T2, t3: T3, t4: T4): R;
  }
  /**
   * Represents a curried function with five arguments.
   * Similar to CurriedFunctionWithArity4, this interface extends the concept to functions with five arguments.
   * It provides flexibility in how the arguments are passed, allowing for any combination of arguments to be omitted.
   * Each partial application returns a new function that accepts the remaining arguments until all are provided.
   *
   * @template T1 The type of the first argument.
   * @template T2 The type of the second argument.
   * @template T3 The type of the third argument.
   * @template T4 The type of the fourth argument.
   * @template T5 The type of the fifth argument.
   * @template R The type of the result.
   */
  export interface CurriedFunctionWithArity5<T1, T2, T3, T4, T5, R> {
    (): CurriedFunctionWithArity5<T1, T2, T3, T4, T5, R>;
    (t1: T1): CurriedFunctionWithArity4<T2, T3, T4, T5, R>;
    (t1: never, t2: T2): CurriedFunctionWithArity4<T1, T3, T4, T5, R>;
    (t1: T1, t2: T2): CurriedFunctionWithArity3<T3, T4, T5, R>;
    (
      t1: never,
      t2: never,
      t3: T3,
    ): CurriedFunctionWithArity4<T1, T2, T4, T5, R>;
    (t1: T1, t2: never, t3: T3): CurriedFunctionWithArity3<T2, T4, T5, R>;
    (t1: never, t2: T2, t3: T3): CurriedFunctionWithArity3<T1, T4, T5, R>;
    (t1: T1, t2: T2, t3: T3): CurriedFunctionWithArity2<T4, T5, R>;
    (
      t1: never,
      t2: never,
      t3: never,
      t4: T4,
    ): CurriedFunctionWithArity4<T1, T2, T3, T5, R>;
    (
      t1: T1,
      t2: never,
      t3: never,
      t4: T4,
    ): CurriedFunctionWithArity3<T2, T3, T5, R>;
    (
      t1: never,
      t2: T2,
      t3: never,
      t4: T4,
    ): CurriedFunctionWithArity3<T1, T3, T5, R>;
    (
      t1: never,
      t2: never,
      t3: T3,
      t4: T4,
    ): CurriedFunctionWithArity3<T1, T2, T5, R>;
    (t1: T1, t2: T2, t3: never, t4: T4): CurriedFunctionWithArity2<T3, T5, R>;
    (t1: T1, t2: never, t3: T3, t4: T4): CurriedFunctionWithArity2<T2, T5, R>;
    (t1: never, t2: T2, t3: T3, t4: T4): CurriedFunctionWithArity2<T1, T5, R>;
    (t1: T1, t2: T2, t3: T3, t4: T4): CurriedFunctionWithArity1<T5, R>;
    (
      t1: never,
      t2: never,
      t3: never,
      t4: never,
      t5: T5,
    ): CurriedFunctionWithArity4<T1, T2, T3, T4, R>;
    (
      t1: T1,
      t2: never,
      t3: never,
      t4: never,
      t5: T5,
    ): CurriedFunctionWithArity3<T2, T3, T4, R>;
    (
      t1: never,
      t2: T2,
      t3: never,
      t4: never,
      t5: T5,
    ): CurriedFunctionWithArity3<T1, T3, T4, R>;
    (
      t1: never,
      t2: never,
      t3: T3,
      t4: never,
      t5: T5,
    ): CurriedFunctionWithArity3<T1, T2, T4, R>;
    (
      t1: never,
      t2: never,
      t3: never,
      t4: T4,
      t5: T5,
    ): CurriedFunctionWithArity3<T1, T2, T3, R>;
    (
      t1: T1,
      t2: T2,
      t3: never,
      t4: never,
      t5: T5,
    ): CurriedFunctionWithArity2<T3, T4, R>;
    (
      t1: T1,
      t2: never,
      t3: T3,
      t4: never,
      t5: T5,
    ): CurriedFunctionWithArity2<T2, T4, R>;
    (
      t1: T1,
      t2: never,
      t3: never,
      t4: T4,
      t5: T5,
    ): CurriedFunctionWithArity2<T2, T3, R>;
    (
      t1: never,
      t2: T2,
      t3: T3,
      t4: never,
      t5: T5,
    ): CurriedFunctionWithArity2<T1, T4, R>;
    (
      t1: never,
      t2: T2,
      t3: never,
      t4: T4,
      t5: T5,
    ): CurriedFunctionWithArity2<T1, T3, R>;
    (
      t1: never,
      t2: never,
      t3: T3,
      t4: T4,
      t5: T5,
    ): CurriedFunctionWithArity2<T1, T2, R>;
    (
      t1: T1,
      t2: T2,
      t3: T3,
      t4: never,
      t5: T5,
    ): CurriedFunctionWithArity1<T4, R>;
    (
      t1: T1,
      t2: T2,
      t3: never,
      t4: T4,
      t5: T5,
    ): CurriedFunctionWithArity1<T3, R>;
    (
      t1: T1,
      t2: never,
      t3: T3,
      t4: T4,
      t5: T5,
    ): CurriedFunctionWithArity1<T2, R>;
    (
      t1: never,
      t2: T2,
      t3: T3,
      t4: T4,
      t5: T5,
    ): CurriedFunctionWithArity1<T1, R>;
    (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5): R;
  }

  /**
   * Represents a utility for transforming a function into its curried equivalent.
   * This interface defines multiple signatures for the 'curry' utility function, allowing it to handle functions with varying numbers of arguments.
   * It takes a function and returns a curried version of it, which can be called with fewer arguments than it expects.
   * The curried version will return a new function that takes the remaining arguments.
   * Overloads are provided for functions with up to five arguments. For functions with more than five arguments, a generic signature is used.
   *
   * @export
   * @interface Curry
   */
  export interface Curry {
    /**
     * Transforms a function with one argument into a curried version.
     * @template T1 The type of the first argument.
     * @template R The type of the result.
     * @param {(t1: T1) => R} func The function to curry.
     * @returns {CurriedFunctionWithArity1<T1, R>} The curried function.
     */
    <T1, R>(func: (t1: T1) => R): CurriedFunctionWithArity1<T1, R>;

    /**
     * Transforms a function with two arguments into a curried version.
     * @template T1 The type of the first argument.
     * @template T2 The type of the second argument.
     * @template R The type of the result.
     * @param {(t1: T1, t2: T2) => R} func The function to curry.
     * @returns {CurriedFunctionWithArity2<T1, T2, R>} The curried function.
     */
    <T1, T2, R>(
      func: (t1: T1, t2: T2) => R,
    ): CurriedFunctionWithArity2<T1, T2, R>;

    /**
     * Transforms a function with three arguments into a curried version.
     * @template T1 The type of the first argument.
     * @template T2 The type of the second argument.
     * @template T3 The type of the third argument.
     * @template R The type of the result.
     * @param {(t1: T1, t2: T2, t3: T3) => R} func The function to curry.
     * @returns {CurriedFunctionWithArity3<T1, T2, T3, R>} The curried function.
     */
    <T1, T2, T3, R>(
      func: (t1: T1, t2: T2, t3: T3) => R,
    ): CurriedFunctionWithArity3<T1, T2, T3, R>;

    /**
     * Transforms a function with four arguments into a curried version.
     * @template T1 The type of the first argument.
     * @template T2 The type of the second argument.
     * @template T3 The type of the third argument.
     * @template T4 The type of the fourth argument.
     * @template R The type of the result.
     * @param {(t1: T1, t2: T2, t3: T3, t4: T4) => R} func The function to curry.
     * @returns {CurriedFunctionWithArity4<T1, T2, T3, T4, R>} The curried function.
     */
    <T1, T2, T3, T4, R>(
      func: (t1: T1, t2: T2, t3: T3, t4: T4) => R,
    ): CurriedFunctionWithArity4<T1, T2, T3, T4, R>;

    /**
     * Transforms a function with five arguments into a curried version.
     * @template T1 The type of the first argument.
     * @template T2 The type of the second argument.
     * @template T3 The type of the third argument.
     * @template T4 The type of the fourth argument.
     * @template T5 The type of the fifth argument.
     * @template R The type of the result.
     * @param {(t1: T1, t2: T2, t3: T3, t4: T4, t5: T5) => R} func The function to curry.
     * @returns {CurriedFunctionWithArity5<T1, T2, T3, T4, T5, R>} The curried function.
     */
    <T1, T2, T3, T4, T5, R>(
      func: (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5) => R,
    ): CurriedFunctionWithArity5<T1, T2, T3, T4, T5, R>;

    /**
     * Transforms a function with an arbitrary number of arguments into a curried version.
     * This generic version is used for functions with more than five arguments.
     * @param {(...args: unknown[]) => unknown} func The function to curry.
     * @returns {(...args: unknown[]) => unknown} The curried function.
     */
    (func: (...args: unknown[]) => unknown): (...args: unknown[]) => unknown;
  }

  /**
   * Transforms a function into a curried version of itself. This allows a
   * function with multiple arguments to be called as a sequence of functions,
   * each with a single argument. Depending on the number of parameters
   * of the input function, it returns a corresponding curried function. It
   * supports functions with up to five parameters, with a generic version for
   * functions with more than five arguments.
   *
   * Usage of this function enables partial application of arguments, allowing a
   * function to be called with
   * fewer arguments than it expects initially.
   *
   * @param {Function} fn - The function to be curried.
   * @returns {Function} A curried version of the input function.
   *
   * @example
   * ```javascript
   * const add = (a, b) => a + b;
   * const curriedAdd = curry(add);
   * curriedAdd(1)(2) // Returns 3
   * ```
   */
  export const curry: Curry;
}

/**
 * Represents an option type, encapsulating an optional value.
 * @template T The type of the value.
 */
export type Some<T> = Types.Brand<T, "Some">;

/**
 * Represents the absence of a value.
 */
export type None = Types.Brand<undefined | null, "None">;

/**
 * Represents an option which can either be Some or None.
 * @template T The type of the value.
 */
export type Option<T> = Some<T> | None;

export namespace Option {
  /**
   * Creates an Option with a value.
   * @template T The type of the value.
   * @param {T} value The value to be encapsulated.
   * @returns {Option<T>} An Option containing the value.
   */
  function some<T>(value: T): Option<T>;

  /**
   * Checks if the Option is a Some.
   * @template T The type of the value in Option.
   * @param {Option<T>} value The Option to check.
   * @returns {boolean} True if the Option is Some, false otherwise.
   */
  function isSome<T>(value: Option<T>): boolean;

  /**
   * Checks if the Option is a None.
   * @template T The type of the value in Option.
   * @param {Option<T>} value The Option to check.
   * @returns {boolean} True if the Option is None, false otherwise.
   */
  function isNone<T>(value: Option<T>): boolean;

  /**
   * Creates an Option with no value (None).
   * @template T The type for the None Option.
   * @returns {Option<T>} An Option representing None.
   */
  function none<T>(): Option<T>;

  /**
   * Checks if a value is an Option.
   * @template T The type of the value in Option.
   * @param {Option<T>} value The value to check.
   * @returns {boolean} True if the value is an Option, false otherwise.
   */
  function isOption<T>(value: Option<T>): boolean;

  /**
   * Maps an Option to another using the provided function.
   * @template T The type of the value in the original Option.
   * @template U The type of the value in the new Option.
   * @param {(value: T) => U} fn The mapping function.
   * @param {Option<T>} option The original Option.
   * @returns {Option<U>} The new Option after applying the mapping function.
   */
  function map<T, U>(fn: (value: T) => U, option: Option<T>): Option<U>;

  /**
   * Applies a function to an Option and flattens the result.
   * @template T The type of the value in the original Option.
   * @template U The type of the value in the new Option.
   * @param {(value: T) => Option<U>} fn The function to apply.
   * @param {Option<T>} option The original Option.
   * @returns {Option<U>} The new Option after applying the function.
   */
  function then<T, U>(
    fn: (value: T) => Option<U>,
    option: Option<T>,
  ): Option<U>;

  /**
   * Unwraps an Option, returning the default value if it is None.
   * @template T The type of the value, constrained to number.
   * @param {T} defaultValue The default value to return if Option is None.
   * @param {Option<T>} option The Option to unwrap.
   * @returns {T} The unwrapped value or the default value.
   */
  function unwrapOr<T extends number>(defaultValue: T, option: Option<T>): T;

  /**
   * Unwraps an Option, throwing an error if it is None.
   * @template T The type of the value in the Option.
   * @param {Option<T>} option The Option to unwrap.
   * @returns {T} The unwrapped value.
   * @throws Will throw an error if the Option is None.
   */
  function unwrap<T>(option: Option<T>): T;

  /**
   * Converts an Option to a Result.
   * @template T The type of the value in the Option.
   * @template E The type of the error in the Result.
   * @param {Option<T>} value The Option to convert.
   * @param {E} error The error value to use in case of None.
   * @returns {Result<T, E>} The resulting Result object.
   */
  function toResult<T, E>(value: Option<T>, error: E): Result<T, E>;
}

/**
 * Represents a successful result.
 * @template T The type of the successful value.
 */
export type Ok<T> = Types.Brand<T, "Ok">;

/**
 * Represents an error result.
 * @template E The type of the error.
 */
export type Error<E> = Types.Brand<E, "Error">;

/**
 * Represents a type that can either be a successful result (Ok) or an error result (Error).
 * @template T The type of the successful value.
 * @template E The type of the error.
 */
export type Result<T, E> =
  | Types.Brand<Ok<T>, "Ok">
  | Types.Brand<Error<E>, "Error">;

export namespace Result {
  /**
   * Creates an Ok Result.
   * @template T The type of the value.
   * @param {T} value The value to encapsulate in the Ok Result.
   * @returns {Ok<T>} An Ok Result containing the value.
   */
  function ok<T>(value: T): Ok<T>;

  /**
   * Creates an Error Result.
   * @template E The type of the error.
   * @param {E} value The error to encapsulate in the Error Result.
   * @returns {Error<E>} An Error Result containing the error.
   */
  function error<E>(value: E): Error<E>;

  /**
   * Checks if a Result is an Ok.
   * @template T The type of the value in the Result.
   * @template E The type of the error in the Result.
   * @param {Result<T, E>} result The Result to check.
   * @returns {boolean} True if the Result is an Ok, false otherwise.
   */
  function isOk<T, E>(result: Result<T, E>): boolean;

  /**
   * Checks if a Result is an Error.
   * @template T The type of the value in the Result.
   * @template E The type of the error in the Result.
   * @param {Result<T, E>} value The Result to check.
   * @returns {boolean} True if the Result is an Error, false otherwise.
   */
  function isError<T, E>(value: Result<T, E>): boolean;

  /**
   * Checks if a value is a Result.
   * @template T The type of the value in the Result.
   * @template E The type of the error in the Result.
   * @param {Result<T, E>} value The value to check.
   * @returns {boolean} True if the value is a Result, false otherwise.
   */
  function isResult<T, E>(value: Result<T, E>): boolean;

  /**
   * Converts a Result to an Option, discarding the error if present.
   * @template T The type of the value in the Result.
   * @template E The type of the error in the Result.
   * @param {Result<T, E>} result The Result to convert.
   * @returns {Option<T>} An Option containing the Ok value, or None if the Result is an Error.
   */
  function toOption<T, E>(result: Result<T, E>): Option<T>;

  /**
   * Maps a Result to another using the provided function.
   * @template T The type of the value in the original Result.
   * @template U The type of the value in the new Result.
   * @template E The type of the error in the Result.
   * @param {(value: T) => U} fn The mapping function.
   * @param {Result<T, E>} result The original Result.
   * @returns {Result<U, E>} The new Result after applying the mapping function.
   */
  function map<T, U, E>(
    fn: (value: T) => U,
    result: Result<T, E>,
  ): Result<U, E>;

  /**
   * Applies a function to a Result and flattens the result.
   * @template T The type of the value in the original Result.
   * @template U The type of the value in the new Result.
   * @template E The type of the error in the Result.
   * @param {(value: T) => Result<U, E>} fn The function to apply.
   * @param {Result<T, E>} result The original Result.
   * @returns {Result<U, E>} The new Result after applying the function.
   */
  function then<T, U, E>(
    fn: (value: T) => Result<U, E>,
    result: Result<T, E>,
  ): Result<U, E>;

  /**
   * Unwraps a Result, returning the default value if it is an Error.
   * @template T The type of the value in the Result.
   * @template E The type of the error in the Result.
   * @param {Result<T, E>} result The Result to unwrap.
   * @param {T} defaultValue The default value to use if the Result is an Error.
   * @returns {T} The unwrapped value or the default value.
   */
  function unwrapOr<T, E>(result: Result<T, E>, defaultValue: T): T;

  /**
   * Unwraps a Result, throwing an error if it is an Error.
   * @template T The type of the value in the Result.
   * @template E The type of the error in the Result.
   * @param {Result<T, E>} result The Result to unwrap.
   * @returns {T} The unwrapped value.
   * @throws Will throw an error if the Result is an Error.
   */
  function unwrap<T, E>(result: Result<T, E>): T;
}

type UnionToIntersection<Union> = (
  Union extends any ? (argument: Union) => void : never
) extends (argument: infer Intersection) => void
  ? Intersection
  : never;

type IsSingleType<T> = [T] extends [UnionToIntersection<T>] ? true : false;

type SingleTypeOf<T> = IsSingleType<T> extends true ? T : never;

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

/**
 * Represents a linked list type.
 * @template T The type of elements in the list.
 */
export type List<T> = Types.Brand<T, "List">;

export namespace List {
  /**
   * Gets the length of the list.
   * @template T The type of elements in the list.
   * @param {List<T>} list The list to get the length of.
   * @returns {number} The length of the list.
   */
  function length<T>(list: List<T>): number;

  /**
   * Creates a List from an array.
   * @template T The type of elements in the array.
   * @param {T[]} array The array to convert.
   * @returns {List<T>} A new List containing the elements of the array.
   */
  function ofArray<T>(array: ArrayOf<T>[]): List<T>;

  /**
   * Converts a List to an array.
   * @template T The type of elements in the list.
   * @param {List<T>} list The list to convert.
   * @returns {T[]} An array containing the elements of the list.
   */
  function toArray<T>(list: List<T>): T[];

  /**
   * Creates an empty List.
   * @template T The type for the elements of the list.
   * @returns {List<T>} An empty List.
   */
  function empty<T>(): List<T>;

  /**
   * Checks if a List is empty.
   * @template T The type of elements in the list.
   * @param {List<T>} list The list to check.
   * @returns {boolean} True if the list is empty, false otherwise.
   */
  function isEmpty<T>(list: List<T>): boolean;

  /**
   * Checks if a value is a List.
   * @template T The type of elements in the list.
   * @param {unknown} maybeList The value to check.
   * @returns {boolean} True if the value is a List, false otherwise.
   */
  function isList(maybeList: unknown): boolean;

  /**
   * Retrieves the first element of the list.
   * @template T The type of elements in the list.
   * @param {List<T>} list The list to retrieve the head from.
   * @returns {T} The first element of the list.
   */
  function head<T>(list: List<T>): T;

  /**
   * Retrieves all elements of the list except the first.
   * @template T The type of elements in the list.
   * @param {List<T>} list The list to retrieve the tail from.
   * @returns {List<T>} A new list containing all elements except the first.
   */
  function tail<T>(list: List<T>): List<T>;

  /**
   * Prepends a value to the list.
   * @template T The type of elements in the list.
   * @param {T} value The value to prepend.
   * @param {List<T>} list The list to prepend the value to.
   * @returns {List<T>} A new list with the value prepended.
   */
  function prepend<T>(value: T, list: List<T>): List<T>;

  /**
   * Appends a value to the list.
   * @template T The type of elements in the list.
   * @param {T} value The value to append.
   * @param {List<T>} list The list to append the value to.
   * @returns {List<T>} A new list with the value appended.
   */
  function append<T>(value: T, list: List<T>): List<T>;

  /**
   * Retrieves the element at a specified index in the list.
   * @template T The type of elements in the list.
   * @param {number} index The index of the element to retrieve.
   * @param {List<T>} list The list to retrieve the element from.
   * @returns {Result<T, string>} A Result containing the element or an error message.
   */
  function at<T>(index: number, list: List<T>): Result<T, string>;

  /**
   * Finds an element in the list that satisfies a predicate.
   * @template T The type of elements in the list.
   * @param {(value: T) => boolean} predicate The function to test each element.
   * @param {List<T>} list The list to search.
   * @returns {Result<T, string>} A Result containing the found element or an error message.
   */
  function find<T>(
    predicate: (value: T) => boolean,
    list: List<T>,
  ): Result<T, string>;

  /**
   * Transforms the elements in the list using a function.
   * @template T The type of elements in the original list.
   * @template U The type of elements in the new list.
   * @param {(value: T, index: number) => U} fn The function to apply to each element.
   * @param {List<T>} list The original list.
   * @returns {List<U>} A new list with transformed elements.
   */
  function map<T, U>(
    fn: (value: T, index: number) => U,
    list: List<T>,
  ): List<U>;

  /**
   * Filters the elements in the list based on a predicate.
   * @template T The type of elements in the list.
   * @param {(value: T, index: number) => boolean} predicate The function to test each element.
   * @param {List<T>} list The original list.
   * @returns {List<T>} A new list with elements that satisfy the predicate.
   */
  function filter<T>(
    predicate: (value: T, index: number) => boolean,
    list: List<T>,
  ): List<T>;

  /**
   * Applies a function to each element in the list and filters out null results.
   * @template T The type of elements in the original list.
   * @template U The type of elements in the new list.
   * @param {(value: T) => U | null} fn The function to apply to each element.
   * @param {List<T>} list The original list.
   * @returns {List<U>} A new list with non-null transformed elements.
   */
  function filterMap<T, U>(fn: (value: T) => U | null, list: List<T>): List<U>;

  /**
   * Reduces the list to a single value by applying a function to each element and accumulating the results.
   * @template T The type of elements in the list.
   * @template U The type of the accumulator/result.
   * @param {(acc: U, value: T, index: number) => U} fn The reducer function.
   * @param {U} acc The initial accumulator value.
   * @param {List<T>} list The list to reduce.
   * @returns {U} The reduced value.
   */
  function reduce<T, U>(
    fn: (acc: U, value: T, index: number) => U,
    acc: U,
    list: List<T>,
  ): U;
}
