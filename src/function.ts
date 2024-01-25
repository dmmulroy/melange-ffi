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

export const Function = {
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
} as const;
