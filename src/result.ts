import * as Melange_result from "../vendor/melange/result.mjs";
import { Brand, toBrandedType } from "./brand";
import { Option } from "./option";

const OK = Symbol("Ok");
const ERROR = Symbol("Error");

/**
 * Represents a successful result.
 *
 * @template T The type of the successful value.
 */
export type Ok<T> = Brand<T, typeof OK>;

/**
 * Represents an error result.
 *
 * @template E The type of the error.
 */
export type Error<E> = Brand<E, typeof ERROR>;

/**
 * Represents a type that can either be a successful result (Ok) or an error result (Error).
 *
 * @template T The type of the successful value.
 * @template E The type of the error.
 */
export type Result<T, E> =
  | Brand<Ok<T>, typeof OK>
  | Brand<Error<E>, typeof ERROR>;

export const Result = {
  /**
   * Creates an Ok Result.
   *
   * @template T The type of the value.
   * @param {T} value The value to encapsulate in the Ok Result.
   * @returns {Ok<T>} An Ok Result containing the value.
   */
  ok<T>(value: T): Ok<T> {
    if (Result.isOk(value as Ok<T>)) {
      return value as Ok<T>;
    }
    return toBrandedType(Melange_result.ok(value), OK);
  },

  /**
   * Creates an Error Result.
   *
   * @template E The type of the error.
   * @param {E} value The error to encapsulate in the Error Result.
   * @returns {Error<E>} An Error Result containing the error.
   */
  error<E>(value: E): Error<E> {
    return toBrandedType(Melange_result.error(value), ERROR);
  },

  /**
   * Checks if a Result is an Ok.
   *
   * @template T The type of the value in the Result.
   * @template E The type of the error in the Result.
   * @param {Result<T, E>} result The Result to check.
   * @returns {boolean} True if the Result is an Ok, false otherwise.
   */
  isOk<T, E>(result: Result<T, E>): boolean {
    return Melange_result.is_ok(result);
  },

  /**
   * Checks if a Result is an Error.
   *
   * @template T The type of the value in the Result.
   * @template E The type of the error in the Result.
   * @param {Result<T, E>} result The Result to check.
   * @returns {boolean} True if the Result is an Error, false otherwise.
   */
  isError<T, E>(result: Result<T, E>): boolean {
    return Melange_result.is_error(result);
  },

  /**
   * Converts a Result to an Option, discarding the error if present.
   *
   * @template T The type of the value in the Result.
   * @template E The type of the error in the Result.
   * @param {Result<T, E>} result The Result to convert.
   * @returns {Option<T>} An Option containing the Ok value, or None if the Result is an Error.
   */
  toOption<T, E>(result: Result<T, E>): Option<T> {
    return Melange_result.to_option(result);
  },

  /**
   * Maps a Result to another using the provided function.
   *
   * @template T The type of the value in the original Result.
   * @template U The type of the value in the new Result.
   * @template E The type of the error in the Result.
   * @param {(value: T) => U} fn The mapping function.
   * @param {Result<T, E>} result The original Result.
   * @returns {Result<U, E>} The new Result after applying the mapping function.
   */
  map<T, U, E>(fn: (value: T) => U, result: Result<T, E>): Result<U, E> {
    return Melange_result.map(fn, result);
  },

  /**
   * Applies a function to a Result and flattens the result.
   *
   * @template T The type of the value in the original Result.
   * @template U The type of the value in the new Result.
   * @template E The type of the error in the Result.
   * @param {(value: T) => Result<U, E>} fn The function to apply.
   * @param {Result<T, E>} result The original Result.
   * @returns {Result<U, E>} The new Result after applying the function.
   */
  then<T, U, E>(
    fn: (value: T) => Result<U, E>,
    result: Result<T, E>,
  ): Result<U, E> {
    return Melange_result.bind(result, fn);
  },

  /**
   * Unwraps a Result, returning the default value if it is an Error.
   *
   * @template T The type of the value in the Result.
   * @template E The type of the error in the Result.
   * @param {Result<T, E>} result The Result to unwrap.
   * @param {T} defaultValue The default value to use if the Result is an Error.
   * @returns {T} The unwrapped value or the default value.
   */
  unwrapOr<T, E>(result: Result<T, E>, defaultValue: T): T {
    return Melange_result.value(result, defaultValue);
  },

  /**
   * Unwraps a Result, throwing an error if it is an Error.
   *
   * @template T The type of the value in the Result.
   * @template E The type of the error in the Result.
   * @param {Result<T, E>} result The Result to unwrap.
   * @returns {T} The unwrapped value.
   * @throws Will throw an error if the Result is an Error.
   */
  unwrap<T, E>(result: Result<T, E>): T {
    return Melange_result.get_ok(result);
  },
};

/**
 * Represents a chainable wrapper for a Result.
 *
 * @template T The type of the value in the Ok result.
 * @template E The type of the error in the Error result.
 */
export type ChainableResult<T, E> = ChainableOk<T> | ChainableError<E>;

/**
 * Represents a chainable wrapper for a successful result.
 *
 * @template A The type of the value in the Ok result.
 */
type ChainableOk<A> = Readonly<{
  /**
   * Checks if the ChainableResult is an Ok.
   *
   * @returns {true} Always true for ChainableOk.
   */
  isOk(): true;

  /**
   * Checks if the ChainableResult is an Error.
   *
   * @returns {false} Always false for ChainableOk.
   */
  isError(): false;

  /**
   * Maps a ChainableOk to another using the provided function.
   *
   * @template B The type of the value in the new ChainableOk.
   * @param {(value: A) => B} fn The mapping function.
   * @returns {ChainableOk<B>} A new ChainableOk with the value transformed by the function.
   */
  map<B>(fn: (value: A) => B): ChainableOk<B>;

  /**
   * Applies a function to a ChainableOk and flattens the result.
   *
   * @template B The type of the value in the new ChainableResult.
   * @template E The type of the error in the new ChainableResult.
   * @param {(value: A) => ChainableResult<B, E>} fn The function to apply.
   * @returns {ChainableResult<B, E>} The new ChainableResult after applying the function.
   */
  then<B, E>(fn: (value: A) => ChainableResult<B, E>): ChainableResult<B, E>;

  /**
   * Maps an error in a ChainableOk, which is ineffective as ChainableOk does not contain an error.
   *
   * @template F The type of the error in the new ChainableOk.
   * @param {(error: never) => F} fn The mapping function.
   * @returns {ChainableOk<A>} The original ChainableOk, unaffected by the mapping function.
   */
  mapError<F>(fn: (error: never) => F): ChainableOk<A>;

  /**
   * Converts the ChainableOk to a ChainableOption.
   */
  // toChainableOption(): void;

  /**
   * Converts the ChainableOk to an Option.
   */
  // toOption(): void;

  /**
   * Returns the Ok value of the ChainableOk.
   *
   * @returns {Ok<A>} The Ok value.
   */
  endChain(): Ok<A>;
}>;

/**
 * Represents a chainable wrapper for an error result.
 *
 * @template E The type of the error.
 */
type ChainableError<E> = Readonly<{
  /**
   * Checks if the ChainableResult is an Ok.
   *
   * @returns {false} Always false for ChainableError.
   */
  isOk(): false;

  /**
   * Checks if the ChainableResult is an Error.
   *
   * @returns {true} Always true for ChainableError.
   */
  isError(): true;

  /**
   * Maps a ChainableError, which is ineffective as ChainableError does not contain a value.
   *
   * @template B The type of the value in the new ChainableError.
   * @param {(value: never) => B} fn The mapping function.
   * @returns {ChainableError<E>} The original ChainableError, unaffected by the mapping function.
   */
  map(fn: never): ChainableError<E>;

  /**
   * Applies a function to a ChainableError, which is ineffective as ChainableError does not contain a value.
   *
   * @template B The type of the value in the new ChainableResult.
   * @template E The type of the error in the new ChainableResult.
   * @param {(value: never) => ChainableResult<B, E>} fn The function to apply.
   * @returns {ChainableError<E>} The original ChainableError, unaffected by the function.
   */
  then(fn: never): ChainableError<E>;

  /**
   * Maps an error in a ChainableError using the provided function.
   *
   * @template F The type of the error in the new ChainableError.
   * @param {(error: E) => F} fn The mapping function.
   * @returns {ChainableError<F>} A new ChainableError with the error transformed by the function.
   */
  mapError<F>(fn: (error: E) => F): ChainableError<F>;

  /**
   * Converts the ChainableError to a ChainableOption.
   */
  // toChainableOption(): void;

  /**
   * Converts the ChainableError to an Option.
   */
  // toOption(): void;

  /**
   * Returns the Error value of the ChainableError.
   *
   * @returns {Error<E>} The Error value.
   */
  endChain(): Error<E>;
}>;

export const ChainableResult = {
  isOk<T, E>(result: ChainableResult<T, E>): boolean {
    return result.isOk();
  },
  isError<T, E>(result: ChainableResult<T, E>): boolean {
    return result.isError();
  },
  error<E>(error: E): ChainableError<E> {
    const self: ChainableError<E> = {
      isOk() {
        return false;
      },
      isError() {
        return true;
      },
      map() {
        return self;
      },
      then() {
        return self;
      },
      mapError(fn) {
        return ChainableResult.error(fn(error));
      },
      endChain() {
        if (Result.isError(error as Error<E>)) {
          return error as Error<E>;
        }

        return Result.error(error);
      },
    };

    return self;
  },
  ok<A>(value: A): ChainableOk<A> {
    const self: ChainableOk<A> = {
      isOk() {
        return true;
      },
      isError() {
        return false;
      },
      map(fn) {
        return ChainableResult.ok(fn(value));
      },
      then(fn) {
        return fn(value);
      },
      mapError() {
        return self;
      },
      endChain() {
        if (Result.isOk(value as Ok<A>)) {
          return value as Ok<A>;
        }

        return Result.ok(value);
      },
    };

    return self;
  },
};
