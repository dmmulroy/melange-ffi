declare namespace Brand {
  const BRAND: unique symbol;
  type t<_T, B> = { [BRAND]: B };
}

export function curry(fn: Function): Function;

export namespace Option {
  type t<T> = Brand.t<T, "Option">;
  function some<T>(value: T): Option.t<T>;
  function isSome<T>(value: Option.t<T>): boolean;
  function isNone<T>(value: Option.t<T>): boolean;
  function none<T>(): Option.t<T>;
  function isOption<T>(value: Option.t<T>): boolean;
  function map<T, U>(fn: (value: T) => U, option: Option.t<T>): Option.t<U>;
  function then<T, U>(fn: (value: T) => t<U>, option: Option.t<T>): Option.t<U>;
  function unwrapOr<T>(option: Option.t<T>, defaultValue: T): T;
  function unwrap<T>(option: Option.t<T>): T;
  function toResult<T, E>(value: Option.t<T>, error: E): Result.t<T, E>;
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
  function unwrapOr<T, E>(defaultValue: T, result: Result.t<T, E>): T;
  function unwrap<T, E>(result: Result.t<T, E>, defaultValue: T): T;
}

export namespace List {
  type t<T> = Brand.t<T, "List">;
  function length<T>(list: List.t<T>): number;
  function ofArray<T>(array: T[]): List.t<T>;
  function toArray<T>(list: List.t<T>): T[];
  function empty<T>(): List.t<T>;
  function isEmpty<T>(list: List.t<T>): boolean;
  function head<T>(list: List.t<T>): T;
  function tail<T>(list: List.t<T>): List.t<T>;
  function prepend<T>(value: T, list: List.t<T>): List.t<T>;
  function append<T>(value: T, list: List.t<T>): List.t<T>;
  function at<T>(index: number, list: List.t<T>): Result.t<T, string>;
  function find<T>(
    predicate: (value: T) => boolean,
    list: List.t<T>,
  ): Result.t<T, string>;
  function map<T, U>(fn: (value: T, index: number) => U, list: t<T>): List.t<U>;
  function filter<T>(
    predicate: (value: T, index: number) => boolean,
    list: List.t<T>,
  ): List.t<T>;
  function filterMap<T, U>(
    fn: (value: T) => U | null,
    list: List.t<T>,
  ): List.t<U>;
  function reduce<T, U>(
    fn: (acc: U, value: T, index: number) => U,
    acc: U,
    list: List.t<T>,
  ): U;
}
