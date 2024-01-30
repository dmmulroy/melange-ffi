import { Result } from "./result";

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
  (t1: T1, t2: never, t3: never, t4: T4): CurriedFunctionWithArity2<T2, T3, R>;
  (t1: never, t2: T2, t3: never, t4: T4): CurriedFunctionWithArity2<T1, T3, R>;
  (t1: never, t2: never, t3: T3, t4: T4): CurriedFunctionWithArity2<T1, T2, R>;
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
  (t1: never, t2: never, t3: T3): CurriedFunctionWithArity4<T1, T2, T4, T5, R>;
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
  (t1: T1, t2: T2, t3: T3, t4: never, t5: T5): CurriedFunctionWithArity1<T4, R>;
  (t1: T1, t2: T2, t3: never, t4: T4, t5: T5): CurriedFunctionWithArity1<T3, R>;
  (t1: T1, t2: never, t3: T3, t4: T4, t5: T5): CurriedFunctionWithArity1<T2, R>;
  (t1: never, t2: T2, t3: T3, t4: T4, t5: T5): CurriedFunctionWithArity1<T1, R>;
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
   * Returns the function passed in if there are no arguments
   * @template R The type of the result.
   * @returns {() => R} The curried function.
   */
  <R>(func: () => R): () => R;
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
const curry: Curry = (
  fn: (...args: any[]) => any,
): ((...args: any[]) => any) => {
  const curried = (...args: any[]) => {
    if (args.length >= fn.length) {
      return fn.apply(undefined, args);
    } else {
      return (...args2: any[]) => curried.apply(undefined, args.concat(args2));
    }
  };
  return curried;
};

/**
 * Flips the order of the arguments of a binary function.
 * @param {Function} fn The function to flip.
 * @returns {Function} A new function with the arguments flipped.
 *
 * @example
 * ```javascript
 * const numerator = 10;
 * const denominator = 2;
 *
 * const divide = (numerator, denominator) => numerator / denominator;
 * divide(numerator, denominator) // Returns 5
 *
 * const flippedDivide = flip(divide);
 * flippedDivide(denominator, numerator) // Returns 5
 */
function flip<T1, T2, R>(
  fn: (first: T1, second: T2) => R,
): (first: T2, second: T1) => R {
  return (first: T2, second: T1) => fn(second, first);
}

/**
 * Returns the value passed in.
 * @template T The type of the value.
 * @param {T} value The value to return.
 * @returns {T} The value passed in.
 */
function identity<T>(value: T): T {
  return value;
}

/**
 * Creates a function that returns the same value that is used as the
 * argument of the `constant` function.
 *
 * @template T The type of the value to be returned.
 * @param {T} value The value to be returned by the constant function.
 * @returns {Function} A function that, when called, always returns the
 *                     provided value, irrespective of the arguments it is passed.
 *
 * @example
 * ```javascript
 * const alwaysFive = constant(5);
 * alwaysFive(); // Returns 5
 * alwaysFive(10, 20); // Still returns 5, ignoring the arguments
 * ```
 */
function constant<T>(value: T): <U>(...args: U[]) => T {
  return (..._args) => value;
}

/**
 * Executes the provided function on a given value as a side effect and returns
 * the original value. This function is primarily used for executing side
 * effects within a pipeline. If the provided function is asynchronous, it is
 * called but not awaited. Errors thrown by the function, either synchronous or
 * asynchronous, are ignored, and the original value is still returned.
 *
 * @template T The type of the value being processed.
 * @param {(value: T) => void | Promise<void>} fn The function to execute as a side effect.
 * It should either return void or a Promise resolving to void.
 * @param {T} value The value to be passed to the function.
 * @returns {T} The original value, irrespective of any errors thrown by `fn`.
 */
function tap<T>(fn: (value: T) => void | Promise<void>, value: T): T {
  try {
    const result = fn(value);
    if (result instanceof Promise) {
      result.catch(() => {});
    }
    return value;
  } catch (_) {
    return value;
  }
}

/**
 * Represents a function that can be composed with other functions. It takes an
 * input of type `Input` and returns an output of type `Output`. It also
 * includes a `compose` method for chaining additional functions to create a new
 * `ComposableFunction`.
 *
 * @template Input The input type of the function.
 * @template Output The output type of the function.
 */
export interface ComposableFunction<Input, Output> {
  /**
   * The call signature for the `ComposableFunction`. When invoked, it takes an argument of type `Input`
   * and returns a result of type `Output`.
   *
   * @param {Input} arg The input argument for the function.
   * @returns {Output} The result of the function.
   */
  (arg: Input): Output;
  /**
   * Composes the current function with another function. The output of the current function
   * becomes the input of the next function, creating a new `ComposableFunction`.
   *
   * @template NextOutput The output type of the next function in the composition.
   * @param {(arg: Output) => NextOutput} fn The next function to compose with.
   * @returns {ComposableFunction<Input, NextOutput>} A new composable function combining the current
   * and next function.
   */
  compose<NextOutput>(
    fn: (arg: Output) => NextOutput,
  ): ComposableFunction<Input, NextOutput>;
}

/**
 * Creates a `ComposableFunction` from a given function.
 * This `ComposableFunction` can then be composed with other functions using its
 * `compose` method.
 *
 * @template Input The input type of the provided function.
 * @template Output The output type of the provided function.
 * @param {(arg: Input) => Output} fn The function to transform into a `ComposableFunction`.
 * @returns {ComposableFunction<Input, Output>} The created `ComposableFunction`.
 */
function compose<Input, Output>(
  fn: (arg: Input) => Output,
): ComposableFunction<Input, Output> {
  const composeFunction = (arg: Input) => fn(arg);

  composeFunction.compose = <NextOutput>(
    nextFn: (arg: Output) => NextOutput,
  ) => {
    return compose((input: Input) => nextFn(fn(input)));
  };

  return composeFunction;
}

/**
 * Executes a synchronous or asynchronous function and handles any errors that
 * it may throw, encapsulating the result or error in a `Result` object. It also
 * executes an `andFinally` block after the try-catch, if provided. The return
 * type of this function depends on whether the provided function `fn` is
 * synchronous or asynchronous.
 *
 * @template T The type of the result expected from the function `fn`.
 * @template F The type of the function to be executed. This can be a
 * synchronous function returning `T` or an asynchronous function returning
 * `Promise<T>`.
 * @param {F} fn The function to be executed. This function should either
 * return a value of type `T` or a `Promise<T>`.
 * @param {() => void} andFinally An optional finally block function that will
 * be executed after the
 * try-catch block, regardless of the outcome.
 * @returns {ReturnType<F> extends Promise<T> ? Promise<Result<T, string>> :
 * Result<T, string>} If `fn` returns a `Promise<T>`, this function returns
 * `Promise<Result<T, string>>`. If `fn` returns `T`, it returns
 * `Result<T, string>`. The result contains either the value returned by `fn` or
 * an error message if `fn` threw an error.
 */
function tryCatch<T, F extends (() => T) | (() => Promise<T>)>(
  fn: F,
  andFinally: () => void,
): ReturnType<F> extends Promise<T>
  ? Promise<Result<T, string>>
  : Result<T, string> {
  try {
    const result = fn();
    if (result instanceof Promise) {
      return result
        .then(Result.ok)
        .catch((err) =>
          Result.error(
            `The function provided to tryCatch threw an error: ${err}`,
          ),
        ) as ReturnType<F> extends Promise<T>
        ? Promise<Result<T, string>>
        : Result<T, string>;
    }
    return Result.ok(result) as ReturnType<F> extends Promise<T>
      ? Promise<Result<T, string>>
      : Result<T, string>;
  } catch (err) {
    return Result.error(
      `The function provided to tryCatch threw an error: ${err}`,
    ) as ReturnType<F> extends Promise<T>
      ? Promise<Result<T, string>>
      : Result<T, string>;
  } finally {
    andFinally?.();
  }
}

export const Fn = {
  /**
   * Creates a `ComposableFunction` from a given function.
   * This `ComposableFunction` can then be composed with other functions using its
   * `compose` method.
   *
   * @template Input The input type of the provided function.
   * @template Output The output type of the provided function.
   * @param {(arg: Input) => Output} fn The function to transform into a `ComposableFunction`.
   * @returns {ComposableFunction<Input, Output>} The created `ComposableFunction`.
   */
  compose,

  /**
   * Creates a function that returns the same value that is used as the
   * argument of the `constant` function.
   *
   * @template T The type of the value to be returned.
   * @param {T} value The value to be returned by the constant function.
   * @returns {Function} A function that, when called, always returns the
   *                     provided value, irrespective of the arguments it is passed.
   *
   * @example
   * ```javascript
   * const alwaysFive = constant(5);
   * alwaysFive(); // Returns 5
   * alwaysFive(10, 20); // Still returns 5, ignoring the arguments
   * ```
   */
  constant,

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
  curry,

  /**
   * Flips the order of the arguments of a binary function.
   * @param {Function} fn The function to flip.
   * @returns {Function} A new function with the arguments flipped.
   *
   * @example
   * ```javascript
   * const numerator = 10;
   * const denominator = 2;
   *
   * const divide = (numerator, denominator) => numerator / denominator;
   * divide(numerator, denominator) // Returns 5
   *
   * const flippedDivide = flip(divide);
   * flippedDivide(denominator, numerator) // Returns 5
   */
  flip,

  /**
   * Returns the value passed in.
   * @template T The type of the value.
   * @param {T} value The value to return.
   * @returns {T} The value passed in.
   */
  identity,

  /**
   * Executes the provided function on a given value as a side effect and returns
   * the original value. This function is primarily used for executing side
   * effects within a pipeline. If the provided function is asynchronous, it is
   * called but not awaited. Errors thrown by the function, either synchronous or
   * asynchronous, are ignored, and the original value is still returned.
   *
   * @template T The type of the value being processed.
   * @param {(value: T) => void | Promise<void>} fn The function to execute as a side effect.
   * It should either return void or a Promise resolving to void.
   * @param {T} value The value to be passed to the function.
   * @returns {T} The original value, irrespective of any errors thrown by `fn`.
   */
  tap,

  /**
   * Executes a synchronous or asynchronous function and handles any errors that
   * it may throw, encapsulating the result or error in a `Result` object. It also
   * executes an `andFinally` block after the try-catch, if provided. The return
   * type of this function depends on whether the provided function `fn` is
   * synchronous or asynchronous.
   *
   * @template T The type of the result expected from the function `fn`.
   * @template F The type of the function to be executed. This can be a
   * synchronous function returning `T` or an asynchronous function returning
   * `Promise<T>`.
   * @param {F} fn The function to be executed. This function should either
   * return a value of type `T` or a `Promise<T>`.
   * @param {() => void} andFinally An optional finally block function that will
   * be executed after the
   * try-catch block, regardless of the outcome.
   * @returns {ReturnType<F> extends Promise<T> ? Promise<Result<T, string>> :
   * Result<T, string>} If `fn` returns a `Promise<T>`, this function returns
   * `Promise<Result<T, string>>`. If `fn` returns `T`, it returns
   * `Result<T, string>`. The result contains either the value returned by `fn` or
   * an error message if `fn` threw an error.
   */
  tryCatch,
} as const;
