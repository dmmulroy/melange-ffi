type Brand<T, B> = T & { [BRAND]: B };

/**
 * Represents a result of an operation, which can either be successful (Ok) or unsuccessful (Err).
 */
export type Result<O, E> = Ok<O> | Error<E>;

/** Unique symbol for distinguishing the Ok type. */
// export const OK: unique symbol;
//
// /** Unique symbol for distinguishing the Err type. */
// export const ERR: unique symbol;

/** Represents a successful result of an operation with a kind and value. */
export type Ok<A> = Readonly<{
  /** A unique identifier symbol indicating the type is `Ok`. */
  kind: typeof OK;

  /** The encapsulated value of the successful operation. */
  value: A;

  /**
   * Binds another operation to the Ok value.
   *
   * @param {(_: A) => Result<B, E>} fn - A function that produces a Result.
   * @returns {Result<B, E>} - The result of the bound operation.
   */
  bind<B, E>(fn: (_: A) => Result<B, E>): Result<B, E>;

  /**
   * Transforms the value of the Ok.
   *
   * @param {(_: A) => B} fn - The transformation function.
   * @returns {Ok<B>} - A new Ok instance with the transformed value.
   */
  map<B>(fn: (_: A) => B): Ok<B>;

  /**
   * Transforms an error which doesn't exist in this Ok instance. Typically used for type compatibility.
   *
   * @param {(_: never) => F} fn - The transformation function for the non-existent error.
   * @returns {Ok<A>} - Returns the same Ok instance as there's no error to map.
   */
  mapErr<F>(fn: (_: never) => F): Ok<A>;

  /**
   * Determines which function (ok or err) to call based on the Ok instance.
   *
   * @param {{ ok: (_: A) => B; err: (_: never) => B }} obj - Object with functions for handling Ok and Err cases.
   * @returns {B} - The result of the function called.
   */
  match<B>(obj: { ok: (_: A) => B; err: (_: never) => B }): B;

  /**
   * Retrieves the encapsulated value of the Ok instance.
   *
   * @returns {A} - The encapsulated value.
   */
  unwrap(_?: string): A;

  /**
   * Retrieves the encapsulated value of the Ok instance or returns the provided default if it was an Err (though it's never the case for Ok).
   *
   * @param {A} or - The default value to return in case of an Err, which will be ignored for Ok.
   * @returns {A} - The encapsulated value.
   */
  unwrapOr<_>(or: _): A;
}>;

/**
 * Represents an unsuccessful result of an operation with a kind and error.
 */
export type Err<E> = Readonly<{
  /** A unique identifier symbol indicating the type is `Err`. */
  kind: typeof Result.ERR;

  /** The encapsulated error value of the unsuccessful operation. */
  error: E;

  /**
   * Attempt to bind another operation to the Err (though Err remains unchanged).
   *
   * @param {(_: never) => Result<B, E>} fn - A function that produces a Result.
   * @returns {Err<E>} - The original Err since Err's error cannot bind to operations.
   */
  bind<B, _>(fn: (_: never) => Result<B, E>): Result<B, E>;

  /**
   * Determines which function (ok or err) to call based on the Err instance.
   *
   * @param {{ ok: (_: never) => B; err: (_: E) => B }} obj - Object with functions for handling Ok and Err cases.
   * @returns {B} - The result of the function called.
   */
  match<B>(obj: { ok: (_: never) => B; err: (_: E) => B }): B;

  /**
   * Attempt to transform the value of the Err (though Err remains unchanged).
   *
   * @param {(_: never) => B} fn - A transformation function.
   * @returns {Err<E>} - The original Err since Err's value cannot be transformed.
   */
  map<B>(fn: (_: never) => B): Err<E>;

  /**
   * Transforms the error of the Err to another type of error.
   *
   * @param {(_: E) => F} fn - The error transformation function.
   * @returns {Err<F>} - A new Err instance with the transformed error.
   */
  mapErr<F>(fn: (_: E) => F): Err<F>;

  /**
   * Attempts to retrieve the encapsulated value of the Err instance but results in a runtime error.
   *
   * @returns {never} - Always throws a runtime error as Err does not encapsulate a successful value.
   */
  unwrap(errorMsg?: string): never;

  /**
   * Retrieves the encapsulated value of the Ok instance or returns the provided default if it was an Err (though it's never the case for Ok).
   *
   * @param {A} or - The default value to return in case of an Err, which will be ignored for Ok.
   * @returns {A} - The encapsulated value.
   */
  unwrapOr<B>(or: B): B;
}>;

/**
 * Functions, utilities, and values for working with the a result of an operation,
 * which can either be successful (Ok) or unsuccessful (Err).
 */
export const Result = {
  /** Unique symbol for distinguishing the Ok type. */
  OK,

  /** Unique symbol for distinguishing the Err type. */
  ERR,

  /**
   * Creates an Err instance.
   *
   * @param {E} e - The error to be wrapped.
   * @returns {Err<E>} - An Err instance with the given error.
   */
  err<E>(e: E): Err<E> {
    const self: Err<E> = {
      kind: ERR,
      error: e,
      bind() {
        return self;
      },
      map() {
        return self;
      },
      mapErr(fn) {
        return Result.err(fn(e));
      },
      match(obj) {
        return obj.err(e);
      },
      unwrap(errorMsg?: string) {
        throw new Error(errorMsg ?? getErrorMessage(e));
      },
      unwrapOr(or) {
        return or;
      },
    };

    return self;
  },

  /**
   * Returns a Result containing the given value if it's defined, or an error Result with 'undefined' if the value is undefined.
   *
   * @param {A | undefined} a - The value to be checked.
   * @returns {Result<A, undefined>} - An `Ok` Result containing the value `a` if `a` is defined, or an `Err` Result with `undefined` if `a` is `undefined`.
   *
   * @example
   * errIfUndefined(5);       // Returns: Ok(5)
   * errIfUndefined(undefined);  // Returns: Err(undefined)
   */
  errIfUndefined<A, E = undefined>(
    a: A | undefined,
    err: E = undefined as E,
  ): Result<A, E> {
    return a === undefined ? Result.err(err) : Result.ok(a);
  },

  /**
   * Creates an Ok instance.
   *
   * @param {A} a - The value to be wrapped.
   * @returns {Ok<A>} - An Ok instance with the given value.
   */
  ok<A>(a: A): Ok<A> {
    return {
      kind: OK,
      value: a,
      bind(fn) {
        return fn(a);
      },
      map(fn) {
        return Result.ok(fn(a));
      },
      mapErr() {
        return this;
      },
      match(obj) {
        return obj.ok(a);
      },
      unwrap() {
        return a;
      },
      unwrapOr() {
        return a;
      },
    };
  },

  /**
   * Attempts to parse `value` with the given Zod `schema`, returning `Ok` if
   * parsing succeeded, or `Err` if parsing failed.
   */
  parse<A, B>(
    schema: ZodType<B, ZodTypeDef, A>,
    value: A,
  ): Result<B, ZodError<A>> {
    const parsed = schema.safeParse(value);

    if (parsed.success) return Result.ok(parsed.data);
    return Result.err(parsed.error);
  },
} as const;
