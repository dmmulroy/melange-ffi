import * as Melange_list from "../vendor/melange/list.mjs";
import * as Melange_array from "../vendor/melange/array.mjs";

import { Brand } from "./brand";
import { Option } from "./option";
import { Result } from "./result";
import { ArrayOf } from "./array";

declare const LIST: unique symbol;

/**
 * Represents a linked list type.
 * @template T The type of elements in the list.
 */
export type List<T> = Brand<T, typeof LIST>;

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
 * Checks if a value is a List.
 * @param {unknown} maybeList The value to check.
 * @returns {boolean} True if the value is a List, false otherwise.
 */
function isList(maybeList: unknown): boolean {
  if (
    typeof maybeList === "object" &&
    maybeList !== null &&
    "hd" in maybeList &&
    "tl" in maybeList
  ) {
    return true;
  }
  return false;
}

/**
 * Retrieves the first element of the list.
 * @template T The type of elements in the list.
 * @param {List<T>} list The list to retrieve the head from.
 * @returns {T} The first element of the list.
 */
function head<T>(list: List<T>): T {
  return Melange_list.hd(list);
}

/**
 * Retrieves all elements of the list except the first.
 * @template T The type of elements in the list.
 * @param {List<T>} list The list to retrieve the tail from.
 * @returns {List<T>} A new list containing all elements except the first.
 */
function tail<T>(list: List<T>): List<T> {
  return Melange_list.tl(list);
}

/**
 * Prepends a value to the list.
 * @template T The type of elements in the list.
 * @param {T} value The value to prepend.
 * @param {List<T>} list The list to prepend the value to.
 * @returns {List<T>} A new list with the value prepended.
 */
function prepend<T>(value: T, list: List<T>): List<T> {
  return Melange_list.cons(value, list) as unknown as List<T>;
}

/**
 * Appends a value to the list.
 * @template T The type of elements in the list.
 * @param {T} value The value to append.
 * @param {List<T>} list The list to append the value to.
 * @returns {List<T>} A new list with the value appended.
 */
function append<T>(value: T, list: List<T>): List<T> {
  return Melange_list.append(list, [value]);
}

/**
 * Retrieves the element at a specified index in the list.
 * @template T The type of elements in the list.
 * @param {number} index The index of the element to retrieve.
 * @param {List<T>} list The list to retrieve the element from.
 * @returns {Result<T, string>} A Result containing the element or an error message.
 */
function at<T>(index: number, list: List<T>): Result<T, string> {
  try {
    const maybeValue = Melange_list.nth_opt(index, list);
    return Option.toResult(maybeValue, "Not found");
  } catch (/** { RE_EXN_ID: "Invalid_argument", _1: "List.nth",*/ _) {
    return Result.error("Negative index");
  }
}

/**
 * Finds an element in the list that satisfies a predicate.
 * @template T The type of elements in the list.
 * @param {(value: T) => boolean} predicate The function to test each element.
 * @param {List<T>} list The list to search.
 * @returns {Result<T, string>} A Result containing the found element or an error message.
 */
function find<T>(
  predicate: (value: T) => boolean,
  list: List<T>,
): Result<T, string> {
  const maybeValue = Melange_list.find_opt(predicate, list);
  return Option.toResult(maybeValue, "Not found");
}

/**
 * Transforms the elements in the list using a function.
 * @template T The type of elements in the original list.
 * @template U The type of elements in the new list.
 * @param {(value: T, index: number) => U} fn The function to apply to each element.
 * @param {List<T>} list The original list.
 * @returns {List<U>} A new list with transformed elements.
 */
function map<T, U>(fn: (value: T, index: number) => U, list: List<T>): List<U> {
  function flippedFn(idx: number, value: T) {
    return fn(value, idx);
  }
  return Melange_list.mapi(flippedFn, list) as unknown as List<U>;
}

/**
 * Filters the elements in the list based on a predicate.
 * @template T The type of elements in the list.
 * @param {(value: T, index: number) => boolean} predicate The function to test each element.
 * @param {List<T>} list The original list.
 * @returns {List<T>} A new list with elements that satisfy the predicate.
 */
function filter<T>(
  predicate: (value: T, index: number) => boolean,
  list: List<T>,
): List<T> {
  return Melange_list.filteri(predicate, list) as unknown as List<T>;
}

/**
 * Applies a function to each element in the list and filters out null results.
 * @template T The type of elements in the original list.
 * @template U The type of elements in the new list.
 * @param {(value: T) => U | null} fn The function to apply to each element.
 * @param {List<T>} list The original list.
 * @returns {List<U>} A new list with non-null transformed elements.
 */
function filterMap<T, U>(fn: (value: T) => U | null, list: List<T>): List<U> {
  return Melange_list.filter_map(fn, list) as unknown as List<U>;
}

/**
 * Reduces the list to a single value by applying a function to each element and accumulating the results.
 * @template T The type of elements in the list.
 * @template U The type of the accumulator/result.
 * @param {(acc: U, value: T, index: number) => U} fn The reducer function.
 * @param {U} acc The initial accumulator value.
 * @param {List<T>} list The list to reduce.
 * @returns {U} The reduced value.
 */
function reduce<T, U>(
  fn: (acc: U, value: T, index: number) => U,
  acc: U,
  list: List<T>,
): U {
  let idx = 0;
  while (true) {
    if (!list) {
      return acc;
    }
    acc = fn(acc, List.head(list), idx++);
    list = List.tail(list);
  }
}

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
   * Checks if a value is a List.
   * @param {unknown} maybeList The value to check.
   * @returns {boolean} True if the value is a List, false otherwise.
   */
  isList,
  /**
   * Retrieves the first element of the list.
   * @template T The type of elements in the list.
   * @param {List<T>} list The list to retrieve the head from.
   * @returns {T} The first element of the list.
   */
  head,
  /**
   * Retrieves all elements of the list except the first.
   * @template T The type of elements in the list.
   * @param {List<T>} list The list to retrieve the tail from.
   * @returns {List<T>} A new list containing all elements except the first.
   */
  tail,
  /**
   * Prepends a value to the list.
   * @template T The type of elements in the list.
   * @param {T} value The value to prepend.
   * @param {List<T>} list The list to prepend the value to.
   * @returns {List<T>} A new list with the value prepended.
   */
  prepend,
  /**
   * Appends a value to the list.
   * @template T The type of elements in the list.
   * @param {T} value The value to append.
   * @param {List<T>} list The list to append the value to.
   * @returns {List<T>} A new list with the value appended.
   */
  append,
  /**
   * Retrieves the element at a specified index in the list.
   * @template T The type of elements in the list.
   * @param {number} index The index of the element to retrieve.
   * @param {List<T>} list The list to retrieve the element from.
   * @returns {Result<T, string>} A Result containing the element or an error message.
   */
  at,
  /**
   * Finds an element in the list that satisfies a predicate.
   * @template T The type of elements in the list.
   * @param {(value: T) => boolean} predicate The function to test each element.
   * @param {List<T>} list The list to search.
   * @returns {Result<T, string>} A Result containing the found element or an error message.
   */
  find,
  /**
   * Transforms the elements in the list using a function.
   * @template T The type of elements in the original list.
   * @template U The type of elements in the new list.
   * @param {(value: T, index: number) => U} fn The function to apply to each element.
   * @param {List<T>} list The original list.
   * @returns {List<U>} A new list with transformed elements.
   */
  map,
  /**
   * Filters the elements in the list based on a predicate.
   * @template T The type of elements in the list.
   * @param {(value: T, index: number) => boolean} predicate The function to test each element.
   * @param {List<T>} list The original list.
   * @returns {List<T>} A new list with elements that satisfy the predicate.
   */
  filter,
  /**
   * Applies a function to each element in the list and filters out null results.
   * @template T The type of elements in the original list.
   * @template U The type of elements in the new list.
   * @param {(value: T) => U | null} fn The function to apply to each element.
   * @param {List<T>} list The original list.
   * @returns {List<U>} A new list with non-null transformed elements.
   */
  filterMap,
  /**
   * Reduces the list to a single value by applying a function to each element and accumulating the results.
   * @template T The type of elements in the list.
   * @template U The type of the accumulator/result.
   * @param {(acc: U, value: T, index: number) => U} fn The reducer function.
   * @param {U} acc The initial accumulator value.
   * @param {List<T>} list The list to reduce.
   * @returns {U} The reduced value.
   */
  reduce,
};
