declare namespace Brand {
  const BRAND: unique symbol;
  type t<_T, B> = { [BRAND]: B };
}

export function curry(fn: Function): Function;

export namespace Option {
  type t<T> = Brand.t<T, "Option">;
  function some<T>(value: T): t<T>;
  function isSome<T>(value: t<T>): boolean;
  function isNone<T>(value: t<T>): boolean;
  function none<T>(): t<T>;
  function isOption<T>(value: t<T>): boolean;
  function map<T, U>(fn: (value: T) => U, option: t<T>): t<U>;
  function then<T, U>(fn: (value: T) => t<U>, option: t<T>): t<U>;
  function unwrapOr<T>(option: t<T>, defaultValue: T): T;
  function toResult<T, E>(value: t<T>, error: E): Result.t<T, E>;
}

export namespace Result {
  type t<Ok, Err> = Brand.t<[Ok, Err], "Result">;
  function ok<T>(value: T): t<T, any>;
  function error<E>(value: E): Result.t<any, E>;
  function isOk<T, E>(result: Result.t<T, E>): boolean;
  function isError<T, E>(value: Result.t<T, E>): boolean;
  function isResult<T, E>(value: Result.t<T, E>): boolean;
  function toOption<T, E>(result: Result.t<T, E>): Option.t<T>;
  function map<T, U, E>(
    fn: (value: T) => U,
    result: Result.t<T, E>,
  ): Result.t<U, E>;
  function then<T, U, E>(
    fn: (value: T) => Result.t<U, E>,
    result: Result.t<T, E>,
  ): Result.t<U, E>;
  function unwrapOr<T, E>(result: Result.t<T, E>, defaultValue: T): T;
}

export namespace List {
  type t<T> = Brand.t<T, "List">;
  function length<T>(list: t<T>): number;
  function ofArray<T>(array: T[]): t<T>;
  function toArray<T>(list: t<T>): T[];
  function empty<T>(): t<T>;
  function isEmpty<T>(list: t<T>): boolean;
  function head<T>(list: t<T>): T;
  function tail<T>(list: t<T>): t<T>;
  function prepend<T>(value: T, list: t<T>): t<T>;
  function append<T>(value: T, list: t<T>): t<T>;
  function at<T>(index: number, list: t<T>): Result.t<T, string>;
  function find<T>(
    predicate: (value: T) => boolean,
    list: t<T>,
  ): Result.t<T, string>;
  function map<T, U>(fn: (value: T, index: number) => U, list: t<T>): t<U>;
  function filter<T>(
    predicate: (value: T, index: number) => boolean,
    list: t<T>,
  ): t<T>;
  function filterMap<T, U>(fn: (value: T) => U | null, list: t<T>): t<U>;
  function reduce<T, U>(
    fn: (acc: U, value: T, index: number) => U,
    acc: U,
    list: t<T>,
  ): U;
}
