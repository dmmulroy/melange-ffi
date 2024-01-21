// @ts-nocheck
import * as Melange_result from "../vendor/melange/result.mjs";
import * as Melange_option from "../vendor/melange/option.mjs";
import * as Melange_list from "../vendor/melange/list.mjs";
import * as Melange_array from "../vendor/melange/array.mjs";

export const Option = {
  some(value) {
    return Melange_option.some(value);
  },
  isSome(value) {
    return Melange_option.is_some(value);
  },
  isNone(value) {
    return Melange_option.is_none(value);
  },
  none() {
    return Melange_option.none;
  },
  isOption(value) {
    return Option.isSome(value) || Option.isNone(value);
  },
  map(fn, option) {
    return Melange_option.map(fn, option);
  },
  then(fn, option) {
    return Melange_option.bind(option, fn);
  },
  unwrapOr(option, defaultValue) {
    return Melange_option.value(option, defaultValue);
  },
  unwrap(option) {
    return Melange_option.get(option);
  },
  toResult(value, error) {
    return Melange_option.to_result(value, error);
  },
};

export const Result = {
  ok(value) {
    return Melange_result.ok(value);
  },
  error(value) {
    return Melange_result.error(value);
  },
  isOk(result) {
    return Melange_result.is_ok(result);
  },
  isError(value) {
    return Melange_result.is_error(value);
  },
  isResult(value) {
    return Result.isOk(value) || Result.isError(value);
  },
  toOption(result) {
    return Melange_result.to_option(result);
  },
  map(fn, result) {
    return Melange_result.map(fn, result);
  },
  then(fn, result) {
    return Melange_result.bind(result, fn);
  },
  unwrapOr(defaultValue, result) {
    return Melange_result.value(result, defaultValue);
  },
  unwrap(result) {
    return Melange_result.get_ok(result);
  },
};

export type ChainableResult<T, E> = ChainableOk<T>;

type ChainableOk<A> = Readonly<{
  isOk<E>(): true;
  isError<E>(): false;
  map<B>(fn: (value: A) => B): ChainableOk<B>;
  then<B, E>(fn: (value: A) => ChainableResult<B, E>): ChainableResult<B, E>;
  mapError<F>(fn: (error: never) => F): ChainableOk<A>;
  toOption(): void;
  toChainableOption(): void;
  value(): Ok<A>;
}>;

type ChainableError<E> = Readonly<{
  isOk<E>(): false;
  isError<E>(): true;
  map<B>(fn: (value: never) => B): ChainableError<E>;
  then<B, E>(fn: (value: never) => ChainableResult<B, E>);
  mapError<F>(fn: (error: E) => F): ChainableError<F>;
  toChainableOption(): void;
  toOption(): void;
  toChainableOption(): void;
  value(): Error<E>;
}>;

export const List = {
  length(list) {
    return Melange_list.length(list);
  },
  ofArray(array) {
    return Melange_array.to_list(array);
  },
  toArray(list) {
    return Melange_array.of_list(list);
  },
  empty() {
    return List.ofArray([]);
  },
  isEmpty(list) {
    return Melange_list.is_empty(list);
  },
  isList(value) {
    return value.hd !== undefined && value.tl !== undefined;
  },
  head(list) {
    return Melange_list.hd(list);
  },
  tail(list) {
    return Melange_list.tl(list);
  },
  prepend(value, list) {
    return Melange_list.cons(value, list);
  },
  append(value, list) {
    return Melange_list.append(list, [value]);
  },
  at(index, list) {
    try {
      const maybeValue = Melange_list.nth_opt(index, list);
      return Option.toResult(maybeValue, "Not found");
    } catch (/** { RE_EXN_ID: "Invalid_argument", _1: "List.nth",*/ _) {
      return Result.error("Negative index");
    }
  },
  find(predicate, list) {
    const maybeValue = Melange_list.find_opt(predicate, list);
    return Option.toResult(maybeValue, "Not found");
  },
  map(fn, list) {
    function flippedFn(idx, value) {
      return fn(value, idx);
    }
    return Melange_list.mapi(flippedFn, list);
  },
  filter(predicate, list) {
    return Melange_list.filteri(predicate, list);
  },
  filterMap(fn, list) {
    return Melange_list.filter_map(fn, list);
  },
  reduce(fn, acc, list) {
    let idx = 0;
    while (true) {
      if (!list) {
        return acc;
      }
      acc = fn(acc, list.hd, idx++);
      list = list.tl;
    }
  },
};
