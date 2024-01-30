import * as Melange_list from "../vendor/melange/list.mjs";
import * as Melange_array from "../vendor/melange/array.mjs";

import { ChainableOption, Option } from "./option";
import { ChainableResult, Result } from "./result";
import { ArrayOf, SingleTypeOf } from "./array";
import { Nominal } from "./nominal";
import { Fn } from "./function";

// TODO: Use SingleTypeOf for the List type.

declare const LIST: unique symbol;

/**
 * Represents a linked list type.
 * @template T The type of elements in the list.
 */
export type List<T> = Nominal<T, typeof LIST>;

/**
 * Gets the length of the list.
 * @template T The type of elements in the list.
 * @param {List<T>} list The list to get the length of.
 * @returns {number} The length of the list.
 */
function length<T>(list: List<T>): number {
  return Melange_list.length(list);
}

/**
 * Creates a List from an array.
 * @template T The type of elements in the array.
 * @param {ArrayOf<T>} array The array to convert.
 * @returns {List<T>} A new List containing the elements of the array.
 */
function ofArray<T>(array: ArrayOf<T>): List<T> {
  return Melange_array.to_list(array) as unknown as List<T>;
}

/**
 * Converts a List to an array.
 * @template T The type of elements in the list.
 * @param {List<T>} list The list to convert.
 * @returns {T[]} An array containing the elements of the list.
 */
function toArray<T>(list: List<T>): T[] {
  return Melange_array.of_list(list);
}

/**
 * Creates an empty List.
 * @template T The type for the elements of the list.
 * @returns {List<T>} An empty List.
 */
function empty<T>(): List<T> {
  return List.ofArray([]);
}

/**
 * Checks if a List is empty.
 * @template T The type of elements in the list.
 * @param {List<T>} list The list to check.
 * @returns {boolean} True if the list is empty, false otherwise.
 */
function isEmpty<T>(list: List<T>): boolean {
  return Melange_list.is_empty(list);
}

/**
 * Retrieves the first element of the list.
 * @template T The type of elements in the list.
 * @param {List<T>} list The list to retrieve the head from.
 * @returns {Option<T>} The first element of the list or None if the list is empty.
 */
function head<T>(list: List<T>): Option<T> {
  try {
    return Option.some(Melange_list.hd(list));
  } catch (/* {
    RE_EXN_ID: "Failure",
    _1: "hd",
    Error: new Error(),
  }*/ _) {
    return Option.none();
  }
}

/**
 * Retrieves all elements of the list except the first.
 * @template T The type of elements in the list.
 * @param {List<T>} list The list to retrieve the tail from.
 * @returns {Option<List<T>>} The tail of the list or None if the list is empty.
 */
function tail<T>(list: List<T>): Option<List<T>> {
  try {
    return Option.some(Melange_list.tl(list));
  } catch (/* {
    RE_EXN_ID: "Failure",
    _1: "tl",
    Error: new Error(),
  } */ _) {
    return Option.none();
  }
}

/**
 * Prepends a value to the list.
 * @template T The type of elements in the list.
 * @param {List<T>} list The list to prepend the value to.
 * @param {T} value The value to prepend.
 * @returns {List<T>} A new list with the value prepended.
 */
function prepend<T>(list: List<T>, value: T): List<T> {
  return Melange_list.cons(value, list) as unknown as List<T>;
}

/**
 * Appends a value to the list.
 * @template T The type of elements in the list.
 * @param {List<T>} list The list to append the value to.
 * @param {T} value The value to append.
 * @returns {List<T>} A new list with the value appended.
 */
function append<T>(list: List<T>, value: SingleTypeOf<T>): List<T> {
  return Melange_list.append(list, List.ofArray([value]));
}

/**
 * Retrieves the element at a specified index in the list.
 * @template T The type of elements in the list.
 * @param {List<T>} list The list to retrieve the element from.
 * @param {number} index The index of the element to retrieve.
 * @returns {Result<T, string>} A Result containing the element or an error message.
 */
function at<T>(list: List<T>, index: number): Result<T, string> {
  try {
    const maybeValue = Melange_list.nth_opt(list, index);
    return Option.toResult(maybeValue, "Not found");
  } catch (/** { RE_EXN_ID: "Invalid_argument", _1: "List.nth",*/ _) {
    return Result.error("Negative index");
  }
}

/**
 * Finds an element in the list that satisfies a predicate.
 * @template T The type of elements in the list.
 * @param {List<T>} list The list to search.
 * @param {(value: T) => boolean} predicate The function to test each element.
 * @returns {Result<T, string>} A Result containing the found element or an error message.
 */
// TODO: Use Option instead of Result for find.
function find<T>(
  list: List<T>,
  predicate: (value: T) => boolean,
): Result<T, string> {
  const maybeValue = Melange_list.find_opt(predicate, list);
  return Option.toResult(maybeValue, "Not found");
}

/**
 * Transforms the elements in the list using a function.
 * @template T The type of elements in the original list.
 * @template U The type of elements in the new list.
 * @param {List<T>} list The original list.
 * @param {(value: T, index: number) => U} fn The function to apply to each element.
 * @returns {List<U>} A new list with transformed elements.
 */
function map<T, U>(list: List<T>, fn: (value: T, index: number) => U): List<U> {
  return Melange_list.mapi(Fn.flip(fn), list) as unknown as List<U>;
}

/**
 * Filters the elements in the list based on a predicate.
 * @template T The type of elements in the list.
 * @param {List<T>} list The original list.
 * @param {(value: T, index: number) => boolean} predicate The function to test each element.
 * @returns {List<T>} A new list with elements that satisfy the predicate.
 */
function filter<T>(
  list: List<T>,
  predicate: (value: T, index: number) => boolean,
): List<T> {
  return Melange_list.filteri(Fn.flip(predicate), list) as unknown as List<T>;
}

/**
 * Applies a function that returns an Option<T> to each element in the list and
 * filters out None values.
 * @template T The type of elements in the original list.
 * @template U The type of elements in the new list.
 * @param {List<T>} list The original list.
 * @param {(value: T) => Option<U>} fn The function to apply to each element.
 * @returns {List<U>} A new list with non-null transformed elements.
 */
function filterMap<T, U>(list: List<T>, fn: (value: T) => Option<U>): List<U> {
  return Melange_list.filter_map(fn, list) as unknown as List<U>;
}

/**
 * Reduces the list to a single value by applying a function to each element and accumulating the results.
 * @template T The type of elements in the list.
 * @template U The type of the accumulator/result.
 * @param {List<T>} list The list to reduce.
 * @param {(acc: U, value: T, index: number) => U} fn The reducer function.
 * @param {U} acc The initial accumulator value.
 * @returns {U} The reduced value.
 */
function reduce<T, U>(
  list: List<T>,
  fn: (acc: U, value: T, index: number) => U,
  acc: U,
): U {
  // TODO: Consider writing types for Melanges runtime representation of Lists,
  // Results, Options and utilize them as part of the Branded types.
  type MelangeList<T> = Readonly<{ hd: T; tl: MelangeList<T> | 0 }>;
  let melangeList = list as unknown as MelangeList<T> | 0;
  let idx = 0;
  while (true) {
    if (!melangeList) {
      return acc;
    }
    acc = fn(acc, melangeList.hd, idx++);
    melangeList = melangeList.tl;
  }
}

type ChainableList<T> = Readonly<{
  length(): number;
  toArray(): T[];
  isEmpty(): boolean;
  head(): ChainableOption<T>;
  tail(): ChainableOption<ChainableList<T>>;
  prepend(value: T): ChainableList<T>;
  append(value: T): ChainableList<T>;
  at(index: number): ChainableResult<T, string>;
  find(predicate: (value: T) => boolean): ChainableOption<T>;
  map<U>(fn: (value: T, index: number) => U): ChainableList<U>;
}>;

export const List = {
  /**
   * Gets the length of the list.
   * @template T The type of elements in the list.
   * @param {List<T>} list The list to get the length of.
   * @returns {number} The length of the list.
   */
  length,
  /**
   * Creates a List from an array.
   * @template T The type of elements in the array.
   * @param {ArrayOf<T>} array The array to convert.
   * @returns {List<T>} A new List containing the elements of the array.
   */
  ofArray,
  /**
   * Converts a List to an array.
   * @template T The type of elements in the list.
   * @param {List<T>} list The list to convert.
   * @returns {T[]} An array containing the elements of the list.
   */
  toArray,
  /**
   * Creates an empty List.
   * @template T The type for the elements of the list.
   * @returns {List<T>} An empty List.
   */
  empty,
  /**
   * Checks if a List is empty.
   * @template T The type of elements in the list.
   * @param {List<T>} list The list to check.
   * @returns {boolean} True if the list is empty, false otherwise.
   */
  isEmpty,
  /**
   * Retrieves the first element of the list.
   * @template T The type of elements in the list.
   * @param {List<T>} list The list to retrieve the head from.
   * @returns {Option<T>} The first element of the list or None if the list is empty.
   */
  head,
  /**
   * Retrieves all elements of the list except the first.
   * @template T The type of elements in the list.
   * @param {List<T>} list The list to retrieve the tail from.
   * @returns {Option<List<T>>} The tail of the list or None if the list is empty.
   */
  tail,
  /**
   * Prepends a value to the list.
   * @template T The type of elements in the list.
   * @param {List<T>} list The list to prepend the value to.
   * @param {T} value The value to prepend.
   * @returns {List<T>} A new list with the value prepended.
   */
  prepend,
  /**
   * Appends a value to the list.
   * @template T The type of elements in the list.
   * @param {List<T>} list The list to append the value to.
   * @param {T} value The value to append.
   * @returns {List<T>} A new list with the value appended.
   */
  append,
  /**
   * Retrieves the element at a specified index in the list.
   * @template T The type of elements in the list.
   * @param {List<T>} list The list to retrieve the element from.
   * @param {number} index The index of the element to retrieve.
   * @returns {Result<T, string>} A Result containing the element or an error message.
   */
  at,
  /**
   * Finds an element in the list that satisfies a predicate.
   * @template T The type of elements in the list.
   * @param {List<T>} list The list to search.
   * @param {(value: T) => boolean} predicate The function to test each element.
   * @returns {Result<T, string>} A Result containing the found element or an error message.
   */
  find,
  /**
   * Transforms the elements in the list using a function.
   * @template T The type of elements in the original list.
   * @template U The type of elements in the new list.
   * @param {List<T>} list The original list.
   * @param {(value: T, index: number) => U} fn The function to apply to each element.
   * @returns {List<U>} A new list with transformed elements.
   */
  map,
  /**
   * Filters the elements in the list based on a predicate.
   * @template T The type of elements in the list.
   * @param {List<T>} list The original list.
   * @param {(value: T, index: number) => boolean} predicate The function to test each element.
   * @returns {List<T>} A new list with elements that satisfy the predicate.
   */
  filter,
  /**
   * Applies a function that returns an Option<T> to each element in the list and
   * filters out None values.
   * @template T The type of elements in the original list.
   * @template U The type of elements in the new list.
   * @param {List<T>} list The original list.
   * @param {(value: T) => Option<U>} fn The function to apply to each element.
   * @returns {List<U>} A new list with non-null transformed elements.
   */
  filterMap,
  /**
   * Reduces the list to a single value by applying a function to each element and accumulating the results.
   * @template T The type of elements in the list.
   * @template U The type of the accumulator/result.
   * @param {List<T>} list The list to reduce.
   * @param {(acc: U, value: T, index: number) => U} fn The reducer function.
   * @param {U} acc The initial accumulator value.
   * @returns {U} The reduced value.
   */
  reduce,
};
