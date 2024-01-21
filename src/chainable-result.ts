type MelangeOkResult<T> = Readonly<{
  TAG: 0;
  _0: T;
}>;

type MelangeErrorResult<E> = Readonly<{
  TAG: 1;
  _0: E;
}>;

type MelangeResult<T, E> = MelangeOkResult<T> | MelangeErrorResult<E>;

export type ChainableResult<T, E> = Ok<T> | ChainableError<E>;

type Ok<A> = Readonly<{
  isOk<E>(): true;
  isError<E>(): false;
  map<B>(fn: (value: A) => B): Ok<B>;
  then<B, E>(fn: (value: A) => ChainableResult<B, E>): ChainableResult<B, E>;
  mapError<F>(fn: (error: never) => F): Ok<A>;
  unwrapOr(or: A): A;
  unwrap(message?: string): A;
  toOption(): void;
}>;

type ChainableError<E> = Readonly<{
  isOk<E>(): false;
  isError<E>(): true;
  map<B>(fn: (value: never) => B): ChainableError<E>;
  then<B, E>(fn: (value: never) => ChainableResult<B, E>);
  mapError<F>(fn: (error: E) => F): ChainableError<F>;
  unwrap(message?: string): never;
  unwrapOr<A>(or: A): A;
}>;

export const Result = {
  isOk<T, E>(result: ChainableResult<T, E>): result is Ok<T> {
    return result.isOk();
  },
  isError<T, E>(result): result is ChainableError<E> {
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
        return Result.error(fn(error));
      },
      unwrap(message?: string) {
        throw new Error(message ?? `${error}`);
      },
      unwrapOr<A>(or: A) {
        return or;
      },
    };

    return self;
  },
  ok<A>(value: A): Ok<A> {
    const self: Ok<A> = {
      isOk() {
        return true;
      },
      isError() {
        return false;
      },
      map<B>(fn) {
        return Result.ok(fn(value));
      },
      then<B>(fn) {
        return fn(value);
      },
      mapError() {
        return self;
      },
      unwrap() {
        return value;
      },
      unwrapOr() {
        return value;
      },
    };

    return self;
  },
};

const value = Result.ok(1)
  .map((a) => 2)
  .then(() => Result.ok("a"))
  .unwrap();

const test = Result.ok("test");
// const x = test._melange_value;
