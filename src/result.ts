import * as Melange_result from "../vendor/melange/result.mjs";
import { Nominal } from "./nominal";
import { Option } from "./option";

declare const OK: unique symbol;
declare const ERROR: unique symbol;

/**
 * Represents a successful result.
 * @template T The type of the successful value.
 */
export type Ok<T> = Nominal<T, typeof OK>;

/**
 * Represents an error result.
 * @template E The type of the error.
 */
export type Error<E> = Nominal<E, typeof ERROR>;

/**
 * Represents a type that can either be a successful result (Ok) or an error result (Error).
 * @template T The type of the successful value.
 * @template E The type of the error.
 */
export type Result<T, E> = Ok<T> | Error<E>;

/**
 * Creates an Ok Result.
 * @template T The type of the value.
 * @param {T} value The value to encapsulate in the Ok Result.
 * @returns {Ok<T>} An Ok Result containing the value.
 */
function ok<T>(value: T): Ok<T> {
  return Melange_result.ok(value) as unknown as Ok<T>;
}

/**
 * Creates an Error Result.
 * @template E The type of the error.
 * @param {E} value The error to encapsulate in the Error Result.
 * @returns {Error<E>} An Error Result containing the error.
 */
function error<E>(value: E): Error<E> {
  return Melange_result.error(value) as unknown as Error<E>;
}

/**
 * Checks if a Result is an Ok.
 * @template T The type of the value in the Result.
 * @template E The type of the error in the Result.
 * @param {Result<T, E>} result The Result to check.
 * @returns {boolean} True if the Result is an Ok, false otherwise.
 */
function isOk<T, E>(result: Result<T, E>): result is Ok<T> {
  return Melange_result.is_ok(result);
}

/**
 * Checks if a Result is an Error.
 * @template T The type of the value in the Result.
 * @template E The type of the error in the Result.
 * @param {Result<T, E>} value The Result to check.
 * @returns {boolean} True if the Result is an Error, false otherwise.
 */
function isError<T, E>(value: Result<T, E>): boolean {
  return Melange_result.is_error(value);
}

/**
 * Converts a Result to an Option, discarding the error if present.
 * @template T The type of the value in the Result.
 * @template E The type of the error in the Result.
 * @param {Result<T, E>} result The Result to convert.
 * @returns {Option<T>} An Option containing the Ok value, or None if the Result is an Error.
 */
function toOption<T, E>(result: Result<T, E>): Option<T> {
  return Melange_result.to_option(result);
}

/**
 * Maps a Result to another using the provided function.
 * @template T The type of the value in the original Result.
 * @template U The type of the value in the new Result.
 * @template E The type of the error in the Result.
 * @param {Result<T, E>} result The original Result.
 * @param {(value: T) => U} fn The mapping function.
 * @returns {Result<U, E>} The new Result after applying the mapping function.
 */
function map<T, U, E>(result: Result<T, E>, fn: (value: T) => U): Result<U, E> {
  return Melange_result.map(fn, result);
}

/**
 * Applies a function to a Result and flattens the result.
 * @template T The type of the value in the original Result.
 * @template U The type of the value in the new Result.
 * @template E The type of the error in the Result.
 * @param {Result<T, E>} result The original Result.
 * @param {(value: T) => Result<U, E>} fn The function to apply.
 * @returns {Result<U, E>} The new Result after applying the function.
 */
function then<T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => Result<U, E>,
): Result<U, E> {
  return Melange_result.bind(result, fn);
}

/**
 * Transforms the error value of a Result using a provided function.
 * If the Result is Ok, it is returned as is. If the Result is an Error,
 * the error is transformed using the provided function.
 *
 * @template T The type of the value in the original Result.
 * @template E The type of the error in the original Result.
 * @template F The type of the error in the new Result after applying the function.
 * @param {Result<T, E>} result The original Result to be transformed.
 * @param {(error: E) => F} fn A function that takes the original error value and returns a new error value.
 * @returns {Result<T, F>} A new Result with the transformed error if the original Result was an Error, or the original Result if it was Ok.
 */
function mapError<T, E, F>(
  result: Result<T, E>,
  fn: (error: E) => F,
): Result<T, F> {
  return Melange_result.map_error(fn, result);
}

/**
 * Unwraps the error value from a Result. If the Result is Ok, it returns the
 * provided default error value.
 *
 * @template T The type of the value in the Result.
 * @template E The type of the error in the Result.
 * @param {Result<T, E>} result The Result to unwrap.
 * @param {E} defaultValue The default error value to return if the Result is Ok.
 * @returns {E} The error value from the Result if it's an Error; otherwise, the default error value.
 */
function unwrapError<T, E>(result: Result<T, E>, defaultValue: E): E {
  try {
    return Melange_result.get_error(result);
  } catch (_) {
    return defaultValue;
  }
}

/**
 * Unwraps a Result, returning the default value if it is an Error.
 * @template T The type of the value in the Result.
 * @template E The type of the error in the Result.
 * @param {Result<T, E>} result The Result to unwrap.
 * @param {T} defaultValue The default value to use if the Result is an Error.
 * @returns {T} The unwrapped value or the default value.
 */
function unwrapOr<T, E>(result: Result<T, E>, defaultValue: T): T {
  return Melange_result.value(result, defaultValue);
}

/**
 * Unwraps a Result, throwing an error if it is an Error.
 * @template T The type of the value in the Result.
 * @template E The type of the error in the Result.
 * @param {Result<T, E>} result The Result to unwrap.
 * @param {string} [errorMessage] An optional error message used if the Result is an Error
 * @returns {T} The unwrapped value.
 * @throws Will throw an error if the Result is an Error.
 */
function unwrap<T, E>(result: Result<T, E>, errorMessage?: string): T {
  try {
    return Melange_result.get_ok(result);
  } catch (error) {
    if (errorMessage) {
      throw new Error(errorMessage, { cause: error });
    }
    throw error;
  }
}

/**
 * Represents a type that can either be a successful result (Ok) or an error
 * result (Error), with chainable operations.
 *
 * @template T The type of the successful value.
 * @template E The type of the error.
 */
export type ChainableResult<T, E> = Readonly<{
  /**
   * Checks if the ChainableResult is an Ok.
   * @returns {boolean} True if the ChainableResult is an Ok, false otherwise.
   */
  isOk(): boolean;

  /**
   * Checks if the ChainableResult is an Error.
   * @returns {boolean} True if the ChainableResult is an Error, false otherwise.
   */
  isError(): boolean;

  /**
   * Applies a mapping function to the value of an Ok result.
   * @template U The type of the value after applying the mapping function.
   * @param { (value: T) => U } fn The mapping function to apply to the Ok value.
   * @returns { ChainableResult<U, E> } A new ChainableResult with the mapped value if the original result was Ok.
   */
  map<U>(fn: (value: T) => U): ChainableResult<U, E>;

  /**
   * Applies a function to the value of an Ok result and chains another result.
   * @template U The type of the value in the new Result.
   * @param { (value: T) => Result<U, E> } fn The function to apply to the Ok value.
   * @returns { ChainableResult<U, E> } A new ChainableResult from the result of the function.
   */
  then<U>(fn: (value: T) => Result<U, E>): ChainableResult<U, E>;

  /**
   * Applies a mapping function to the error of an Error result.
   * @template F The type of the error after applying the mapping function.
   * @param { (error: E) => F } fn The mapping function to apply to the Error value.
   * @returns { ChainableResult<T, F> } A new ChainableResult with the mapped error if the original result was Error.
   */
  mapError<F>(fn: (error: E) => F): ChainableResult<T, F>;

  /**
   * Unwraps a ChainableResult, returning a default value if it is an Error.
   * @param {T} or The default value to return if the result is an Error.
   * @returns {T} The value if the result is Ok, or the default value if it is an Error.
   */
  unwrapOr(or: T): T;

  /**
   * Unwraps a ChainableResult, throwing an error if it is an Error.
   * @param {string} [errorMessage] An optional error message to use if the result is an Error.
   * @returns {T} The value if the result is Ok.
   * @throws Will throw an error if the result is an Error.
   */
  unwrap(errorMessage?: string): T;

  /**
   * Unwraps the error value from a ChainableResult. If the ChainableResult is
   * Ok, it returns the provided default error value. This method is useful for
   * extracting the error from a ChainableResult when you expect it to be an Error,
   * or providing a fallback error value if it unexpectedly turns out to be Ok.
   *
   * @template T The type of the value in the ChainableResult.
   * @template E The type of the error in the ChainableResult.
   * @param {E} defaultValue The default error value to return if the ChainableResult is Ok.
   * @returns {E} The error value from the ChainableResult if it's an Error; otherwise, the default error value.
   */
  unwrapError(defaultValue: E): E;

  /**
   * Converts the ChainableResult to an Option, discarding the error if present.
   * @returns {Option<T>} An Option containing the Ok value, or None if the result is an Error.
   */
  toOption(): Option<T>;

  /**
   * Converts the ChainableResult back to a regular Result.
   * @returns {Result<T, E>} The original Result, either Ok or Error.
   */
  toResult(): Result<T, E>;
}>;

/**
 * Converts a Result into a ChainableResult, enabling chainable operations.
 * This function allows for fluent method chaining on Result types, such as
 * map, then, mapError, and more.
 *
 * @template T The type of the value in the original Result for successful case.
 * @template E The type of the error in the original Result for error case.
 * @param {Result<T, E>} result The original Result to be converted into a ChainableResult.
 * @returns {ChainableResult<T, E>} A ChainableResult, encapsulating the original Result and providing chainable methods.
 */
function chain<T, E>(result: Result<T, E>): ChainableResult<T, E> {
  return {
    isOk() {
      return Result.isOk(result);
    },
    isError() {
      return Result.isError(result);
    },
    map(fn) {
      return Result.chain(Result.map(result, fn));
    },
    then(fn) {
      return Result.chain(Result.then(result, fn));
    },
    mapError(fn) {
      return Result.chain(Result.mapError(result, fn));
    },
    unwrapOr(or) {
      return Result.unwrapOr(result, or);
    },
    unwrap(errorMessage) {
      return Result.unwrap(result, errorMessage);
    },
    unwrapError(defaultValue) {
      return Result.unwrapError(result, defaultValue);
    },
    toOption() {
      return Result.toOption(result);
    },
    toResult() {
      return result;
    },
  } as const satisfies ChainableResult<T, E>;
}

export const Result = {
  /**
   * Creates an Ok Result.
   * @template T The type of the value.
   * @param {T} value The value to encapsulate in the Ok Result.
   * @returns {Ok<T>} An Ok Result containing the value.
   */
  ok,
  /**
   * Creates an Error Result.
   * @template E The type of the error.
   * @param {E} value The error to encapsulate in the Error Result.
   * @returns {Error<E>} An Error Result containing the error.
   */
  error,
  /**
   * Checks if a Result is an Ok.
   * @template T The type of the value in the Result.
   * @template E The type of the error in the Result.
   * @param {Result<T, E>} result The Result to check.
   * @returns {boolean} True if the Result is an Ok, false otherwise.
   */
  isOk,
  /**
   * Checks if a Result is an Error.
   * @template T The type of the value in the Result.
   * @template E The type of the error in the Result.
   * @param {Result<T, E>} value The Result to check.
   * @returns {boolean} True if the Result is an Error, false otherwise.
   */
  isError,
  /**
   * Converts a Result into a ChainableResult, enabling chainable operations.
   * This function allows for fluent method chaining on Result types, such as
   * map, then, mapError, and more.
   *
   * @template T The type of the value in the original Result for successful case.
   * @template E The type of the error in the original Result for error case.
   * @param {Result<T, E>} result The original Result to be converted into a ChainableResult.
   * @returns {ChainableResult<T, E>} A ChainableResult, encapsulating the original Result and providing chainable methods.
   */
  chain,
  /**
   * Converts a Result to an Option, discarding the error if present.
   * @template T The type of the value in the Result.
   * @template E The type of the error in the Result.
   * @param {Result<T, E>} result The Result to convert.
   * @returns {Option<T>} An Option containing the Ok value, or None if the Result is an Error.
   */
  toOption,
  /**
   * Maps a Result to another using the provided function.
   * @template T The type of the value in the original Result.
   * @template U The type of the value in the new Result.
   * @template E The type of the error in the Result.
   * @param {Result<T, E>} result The original Result.
   * @param {(value: T) => U} fn The mapping function.
   * @returns {Result<U, E>} The new Result after applying the mapping function.
   */
  map,
  /**
   * Applies a function to a Result and flattens the result.
   * @template T The type of the value in the original Result.
   * @template U The type of the value in the new Result.
   * @template E The type of the error in the Result.
   * @param {Result<T, E>} result The original Result.
   * @param {(value: T) => Result<U, E>} fn The function to apply.
   * @returns {Result<U, E>} The new Result after applying the function.
   */
  then,
  /**
   * Transforms the error value of a Result using a provided function.
   * If the Result is Ok, it is returned as is. If the Result is an Error,
   * the error is transformed using the provided function.
   *
   * @template T The type of the value in the original Result.
   * @template E The type of the error in the original Result.
   * @template F The type of the error in the new Result after applying the function.
   * @param {Result<T, E>} result The original Result to be transformed.
   * @param {(error: E) => F} fn A function that takes the original error value and returns a new error value.
   * @returns {Result<T, F>} A new Result with the transformed error if the original Result was an Error, or the original Result if it was Ok.
   */
  mapError,
  /**
   * Unwraps a Result, returning the default value if it is an Error.
   * @template T The type of the value in the Result.
   * @template E The type of the error in the Result.
   * @param {Result<T, E>} result The Result to unwrap.
   * @param {T} defaultValue The default value to use if the Result is an Error.
   * @returns {T} The unwrapped value or the default value.
   */
  unwrapOr,
  /**
   * Unwraps a Result, throwing an error if it is an Error.
   * @template T The type of the value in the Result.
   * @template E The type of the error in the Result.
   * @param {Result<T, E>} result The Result to unwrap.
   * @param {string} [errorMessage] An optional error message used if the Result is an Error
   * @returns {T} The unwrapped value.
   * @throws Will throw an error if the Result is an Error.
   */
  unwrap,
  /**
   * Unwraps the error value from a Result. If the Result is Ok, it returns the
   * provided default error value.
   *
   * @template T The type of the value in the Result.
   * @template E The type of the error in the Result.
   * @param {Result<T, E>} result The Result to unwrap.
   * @param {E} defaultValue The default error value to return if the Result is Ok.
   * @returns {E} The error value from the Result if it's an Error; otherwise, the default error value.
   */
  unwrapError,
} as const;
