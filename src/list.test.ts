import { describe, expect, it } from "bun:test";
import fc from "fast-check";
import { List } from "./list";
import { Option } from "./option";
import { Result } from "./result";

describe("List module", () => {
  describe("List", () => {
    describe("length", () => {
      it("should return 0 for an empty list", () => {
        const emptyList = List.empty();
        expect(List.length(emptyList)).toEqual(0);
      });

      it("should return the correct length for non-empty lists", () => {
        fc.assert(
          fc.property(fc.array(fc.anything()), (array) => {
            const list = List.ofArray(array);
            expect(List.length(list)).toEqual(array.length);
          }),
        );
      });

      it("should return 1 for a list with a single element", () => {
        fc.assert(
          fc.property(fc.anything(), (element) => {
            const singleItemList = List.ofArray([element]);
            expect(List.length(singleItemList)).toEqual(1);
          }),
        );
      });
    });

    describe("ofArray", () => {
      it("should create an empty list from an empty array", () => {
        const array: unknown[] = [];
        const list = List.ofArray(array);
        expect(List.isEmpty(list)).toBe(true);
      });

      it("should create a non-empty list from a non-empty array", () => {
        fc.assert(
          fc.property(fc.array(fc.anything()), (array) => {
            const list = List.ofArray(array);
            expect(List.isEmpty(list)).toBe(array.length === 0);
          }),
        );
      });

      it("should preserve the order of elements", () => {
        fc.assert(
          fc.property(fc.array(fc.anything()), (array) => {
            const list = List.ofArray(array);
            const listToArray = List.toArray(list);
            expect(listToArray).toEqual(array);
          }),
        );
      });

      it("should create a list with the same length as the array", () => {
        fc.assert(
          fc.property(fc.array(fc.anything()), (array) => {
            const list = List.ofArray(array);
            expect(List.length(list)).toEqual(array.length);
          }),
        );
      });
    });

    describe("toArray", () => {
      it("should create an empty array from an empty list", () => {
        const emptyList = List.empty();
        const array = List.toArray(emptyList);
        expect(array).toEqual([]);
      });

      it("should create an array that matches the list content and order", () => {
        fc.assert(
          fc.property(fc.array(fc.anything()), (originalArray) => {
            const list = List.ofArray(originalArray);
            const array = List.toArray(list);
            expect(array).toEqual(originalArray);
          }),
        );
      });

      it("should return an array of the same length as the list", () => {
        fc.assert(
          fc.property(
            fc.array(fc.anything(), { maxLength: 100 }),
            (originalArray) => {
              const list = List.ofArray(originalArray);
              const array = List.toArray(list);
              expect(array.length).toEqual(List.length(list));
            },
          ),
        );
      });

      it("should create a non-empty array from a non-empty list", () => {
        fc.assert(
          fc.property(
            fc.array(fc.anything()).filter((arr) => arr.length > 0),
            (nonEmptyArray) => {
              const list = List.ofArray(nonEmptyArray);
              const array = List.toArray(list);
              expect(array.length).toBeGreaterThan(0);
            },
          ),
        );
      });
    });

    describe("empty", () => {
      it("should create an empty list", () => {
        const list = List.empty();
        expect(List.isEmpty(list)).toBeTrue();
      });

      it("should create a list with zero length", () => {
        const list = List.empty();
        expect(List.length(list)).toEqual(0);
      });

      it("should return an empty array when converted to an array", () => {
        const list = List.empty();
        expect(List.toArray(list)).toEqual([]);
      });
    });

    describe("isEmpty", () => {
      it("should return true for an empty list", () => {
        const emptyList = List.empty();
        expect(List.isEmpty(emptyList)).toBe(true);
      });

      it("should return false for a non-empty list", () => {
        const nonEmptyList = List.ofArray([1]); // Using a simple array with one element
        expect(List.isEmpty(nonEmptyList)).toBe(false);
      });

      it("should return true for lists created from empty arrays", () => {
        fc.assert(
          fc.property(fc.constant([]), (emptyArray) => {
            const list = List.ofArray(emptyArray);
            expect(List.isEmpty(list)).toBe(true);
          }),
        );
      });
    });

    describe("head", () => {
      it("should have the same first element as the array it was created from", () => {
        fc.assert(
          fc.property(
            fc.array(fc.anything(), { minLength: 1, maxLength: 100 }),
            (array) => {
              const list: List<any> = List.ofArray(array);
              const firstElement: Option<any> = List.head(list);

              expect(Option.unwrap(firstElement)).toEqual(array[0]);
            },
          ),
        );
      });

      it("should should return a Some<T> for non-empty list", () => {
        fc.assert(
          fc.property(
            fc.array(fc.anything(), { minLength: 1, maxLength: 100 }),
            (array) => {
              const list: List<any> = List.ofArray(array);
              const firstElement: Option<any> = List.head(list);

              expect(Option.isSome(firstElement)).toBeTrue();
            },
          ),
        );
      });

      it("should should return a None for non-empty list", () => {
        const list: List<any> = List.empty();
        const firstElement: Option<any> = List.head(list);

        expect(Option.isNone(firstElement)).toBeTrue();
      });
    });

    describe("tail", () => {
      it("should return None for an empty list", () => {
        const emptyList = List.empty();
        const tailResult = List.tail(emptyList);
        expect(Option.isNone(tailResult)).toBeTrue();
      });

      it("should return Some for non-empty lists", () => {
        fc.assert(
          fc.property(
            fc.array(fc.anything(), { minLength: 1, maxLength: 100 }),
            (array) => {
              const list = List.ofArray(array);
              const tailResult = List.tail(list);
              expect(Option.isSome(tailResult)).toBeTrue();
            },
          ),
        );
      });

      it("should have all elements except the first from the array it was created from", () => {
        fc.assert(
          fc.property(
            fc.array(fc.anything(), { minLength: 1, maxLength: 100 }),
            (array) => {
              const list = List.ofArray(array);
              const tailResult = List.tail(list);
              if (Option.isSome(tailResult)) {
                expect(List.toArray(Option.unwrap(tailResult))).toEqual(
                  array.slice(1),
                );
              }
            },
          ),
        );
      });
    });

    describe("prepend", () => {
      it("should add a value to the beginning of an empty list", () => {
        fc.assert(
          fc.property(fc.anything(), (value) => {
            const emptyList = List.empty();
            const newList = List.prepend(emptyList, value);
            const head = Option.unwrap(List.head(newList));
            expect(head).toEqual(value);
          }),
        );
      });

      it("should add a value to the beginning of a non-empty list", () => {
        fc.assert(
          fc.property(
            fc.anything(),
            fc.array(fc.anything()),
            (value, array) => {
              const list = List.ofArray(array);
              const newList = List.prepend(list, value);
              const head = Option.unwrap(List.head(newList));
              expect(head).toEqual(value);
            },
          ),
        );
      });

      it("should increase the length of the list by one", () => {
        fc.assert(
          fc.property(
            fc.anything(),
            fc.array(fc.anything()),
            (value, array) => {
              const list = List.ofArray(array);
              const newList = List.prepend(list, value);
              expect(List.length(newList)).toEqual(array.length + 1);
            },
          ),
        );
      });
    });

    describe("append", () => {
      it("should add a value to the end of an empty list", () => {
        fc.assert(
          fc.property(fc.anything(), (value) => {
            const emptyList = List.empty();
            const newList = List.append(emptyList, value);
            expect(List.toArray(newList)).toEqual([value]);
          }),
        );
      });

      it("should add a value to the end of a non-empty list", () => {
        fc.assert(
          fc.property(
            fc.anything(),
            fc.array(fc.anything()),
            (value, array) => {
              const list = List.ofArray(array);
              const newList = List.append(list, value);
              expect(List.toArray(newList)).toEqual([...array, value]);
            },
          ),
        );
      });

      it("should increase the length of the list by one", () => {
        fc.assert(
          fc.property(
            fc.anything(),
            fc.array(fc.anything()),
            (value, array) => {
              const list = List.ofArray(array);
              const newList = List.append(list, value);
              expect(List.length(newList)).toEqual(array.length + 1);
            },
          ),
        );
      });
    });

    describe("at", () => {
      it("should retrieve the correct element for a valid index in a non-empty list", () => {
        fc.assert(
          fc.property(
            fc.array(fc.anything(), { minLength: 1 }),
            fc.integer({ min: 0 }),
            (array: any[], index) => {
              const list: List<any> = List.ofArray(array);
              const result: Result<any, any> = List.at(
                list,
                index % array.length,
              );
              expect(Result.unwrap(result)).toEqual(
                array[index % array.length],
              );
            },
          ),
        );
      });

      it("should return an error for an index out of bounds", () => {
        fc.assert(
          fc.property(
            fc.array(fc.anything(), { minLength: 1 }),
            fc.integer({ min: 0 }),
            (array, index) => {
              const list = List.ofArray(array);
              const result = List.at(list, array.length + index);
              expect(Result.isError(result)).toBeTrue();
            },
          ),
        );
      });

      it("should return an error for a negative index", () => {
        fc.assert(
          fc.property(
            fc.array(fc.anything()),
            fc.integer({ max: -1 }),
            (array, index) => {
              const list = List.ofArray(array);
              const result = List.at(list, index);
              expect(Result.isError(result)).toBeTrue();
            },
          ),
        );
      });

      it("should return an error for an empty list", () => {
        fc.assert(
          fc.property(fc.integer(), (index) => {
            const emptyList = List.empty();
            const result = List.at(emptyList, index);
            expect(Result.isError(result)).toBeTrue();
          }),
        );
      });
    });

    describe("find", () => {
      it("should find an element that satisfies the predicate", () => {
        fc.assert(
          fc.property(
            fc.array(fc.anything(), { minLength: 1 }),
            (array: any[]) => {
              const list = List.ofArray(array);
              const predicate = (value: any) => value === array[0];
              const result = List.find(list, predicate);
              expect(Option.unwrap(result)).toEqual(array[0]);
            },
          ),
        );
      });

      it("should return an error if no element satisfies the predicate", () => {
        fc.assert(
          fc.property(fc.array(fc.anything(), { minLength: 1 }), (array) => {
            const list = List.ofArray(array);
            const predicate = () => false;
            const result = List.find(list, predicate);
            expect(Option.isNone(result)).toBeTrue();
          }),
        );
      });

      it("should return an error for an empty list", () => {
        const emptyList = List.empty();
        const predicate = () => true;
        const result = List.find(emptyList, predicate);
        expect(Option.isNone(result)).toBeTrue();
      });
    });

    describe("map", () => {
      it("should correctly transform each element in a non-empty list", () => {
        fc.assert(
          fc.property(
            fc.array(fc.anything(), { minLength: 1 }),
            fc.func(fc.anything()),
            (array, transformFn) => {
              const wrappedTransformFn = (value: any, _index: number) =>
                transformFn(value);
              const list: List<any> = List.ofArray(array);
              const mappedList = List.map(list, wrappedTransformFn);
              const expectedArray = array.map(wrappedTransformFn);
              expect(List.toArray(mappedList)).toEqual(expectedArray);
            },
          ),
        );
      });

      it("should return an empty list when mapping an empty list", () => {
        const emptyList: List<any> = List.empty();
        const transformFn = (x: number) => x * 2;
        const mappedList = List.map(emptyList, transformFn);
        expect(List.isEmpty(mappedList)).toBeTrue();
      });

      it("should preserve the order of elements after mapping", () => {
        fc.assert(
          fc.property(fc.array(fc.anything(), { minLength: 2 }), (array) => {
            const list = List.ofArray(array);
            const transformFn = (value: any, index: number) => ({
              value,
              index,
            });
            const mappedList = List.map(list, transformFn);
            const expectedArray = array.map(transformFn);
            expect(List.toArray(mappedList)).toEqual(expectedArray);
          }),
        );
      });
    });

    describe("filter", () => {
      it("should retain elements that satisfy the predicate", () => {
        fc.assert(
          fc.property(fc.array(fc.anything()), (array) => {
            const list = List.ofArray(array);
            const predicate = (_value: any, index: number) => index % 2 === 0; // Example predicate: keep elements at even indices
            const filteredList = List.filter(list, predicate);
            const expectedArray = array.filter(predicate);
            expect(List.toArray(filteredList)).toEqual(expectedArray);
          }),
        );
      });

      it("should return an empty list when no elements satisfy the predicate", () => {
        fc.assert(
          fc.property(fc.array(fc.anything()), (array) => {
            const list = List.ofArray(array);
            const predicate = () => false; // Predicate that no element satisfies
            const filteredList = List.filter(list, predicate);
            expect(List.isEmpty(filteredList)).toBeTrue();
          }),
        );
      });

      it("should return an empty list when filtering an empty list", () => {
        const emptyList = List.empty();
        const predicate = () => true; // Any predicate
        const filteredList = List.filter(emptyList, predicate);
        expect(List.isEmpty(filteredList)).toBeTrue();
      });
    });

    describe("filterMap", () => {
      it("should correctly transform and filter elements in a non-empty list", () => {
        fc.assert(
          fc.property(fc.array(fc.integer()), (array) => {
            const list = List.ofArray(array);
            const transformFn = (value: number) =>
              value % 2 === 0 ? Option.some(value * 2) : Option.none();
            const filteredList = List.filterMap(list, transformFn);
            const expectedArray = array
              .map(transformFn)
              .filter(Option.isSome)
              .map(Option.unwrap);
            expect(List.toArray(filteredList)).toEqual(expectedArray);
          }),
        );
      });

      it("should return an empty list when all elements are transformed to None", () => {
        fc.assert(
          fc.property(fc.array(fc.anything()), (array) => {
            const list = List.ofArray(array);
            const transformFn = () => Option.none(); // Transformation function that always returns None
            const filteredList = List.filterMap(list, transformFn);
            expect(List.isEmpty(filteredList)).toBeTrue();
          }),
        );
      });

      it("should return an empty list when applied to an empty list", () => {
        const emptyList = List.empty();
        const transformFn = (value: any) => Option.some(value); // Any transformation function
        const filteredList = List.filterMap(emptyList, transformFn);
        expect(List.isEmpty(filteredList)).toBeTrue();
      });

      it("should only include elements for which the function returns Some", () => {
        fc.assert(
          fc.property(fc.array(fc.integer()), (array) => {
            const list = List.ofArray(array);
            const transformFn = (value: number) =>
              value % 2 === 0 ? Option.some(value * 2) : Option.none();
            const filteredList = List.filterMap(list, transformFn);
            const expectedArray = array
              .map(transformFn)
              .filter(Option.isSome)
              .map(Option.unwrap);
            expect(List.toArray(filteredList)).toEqual(expectedArray);
          }),
        );
      });
    });

    describe("reduce", () => {
      it("should accumulate correctly for non-empty lists", () => {
        fc.assert(
          fc.property(
            fc.array(fc.integer()),
            fc.integer(),
            (array, initialValue) => {
              const list = List.ofArray(array);
              const reducer = (acc: number, value: number) => acc + value;
              const result = List.reduce(list, reducer, initialValue);
              const expected = array.reduce(reducer, initialValue);
              expect(result).toEqual(expected);
            },
          ),
        );
      });

      it("should return the initial accumulator value for an empty list", () => {
        fc.assert(
          fc.property(fc.integer(), (initialValue) => {
            const emptyList: List<any> = List.empty();
            const reducer = (acc: number, value: number) => acc + value;
            const result = List.reduce(emptyList, reducer, initialValue);
            expect(result).toEqual(initialValue);
          }),
        );
      });

      it("should correctly use the index in the reducer function", () => {
        fc.assert(
          fc.property(fc.array(fc.integer()), (array) => {
            const list = List.ofArray(array);
            const reducer = (
              acc: { value: number; index: number }[],
              value: number,
              index: number,
            ) => acc.concat({ value, index });
            const result = List.reduce(list, reducer, []);
            const expected = array.map((value, index) => ({ value, index }));
            expect(result).toEqual(expected);
          }),
        );
      });
    });
  });

  describe("ChainableList", () => {
    describe("length", () => {
      it("should return the correct length for non-empty chainable lists", () => {
        fc.assert(
          fc.property(fc.array(fc.anything()), (array) => {
            const list = List.chain(List.ofArray(array));
            expect(list.length()).toEqual(array.length);
          }),
        );
      });

      it("should return 0 for an empty chainable list", () => {
        const list = List.chain(List.empty());
        expect(list.length()).toEqual(0);
      });
    });

    describe("toArray", () => {
      it("should preserve the order of elements and convert to array correctly", () => {
        fc.assert(
          fc.property(fc.array(fc.anything()), (array) => {
            const list = List.chain(List.ofArray(array));
            expect(list.toArray()).toEqual(array);
          }),
        );
      });
    });

    describe("isEmpty", () => {
      it("should return true for an empty chainable list", () => {
        const list = List.chain(List.empty());
        expect(list.isEmpty()).toBeTrue();
      });

      it("should return false for a non-empty chainable list", () => {
        fc.assert(
          fc.property(fc.array(fc.anything(), { minLength: 1 }), (array) => {
            const list = List.chain(List.ofArray(array));
            expect(list.isEmpty()).toBeFalse();
          }),
        );
      });
    });

    describe("head", () => {
      it("should return ChainableOption of the first element for non-empty lists", () => {
        fc.assert(
          fc.property(fc.array(fc.anything(), { minLength: 1 }), (array) => {
            const list = List.chain(List.ofArray(array));
            const head = list.head();
            expect(head.isSome()).toBeTrue();
            expect(head.unwrap()).toEqual(array[0]);
          }),
        );
      });

      it("should return ChainableOption.None for empty lists", () => {
        const list = List.chain(List.empty());
        const head = list.head();
        expect(head.isNone()).toBeTrue();
      });
    });

    describe("tail", () => {
      it("should return ChainableOption of ChainableList for the tail of non-empty lists", () => {
        fc.assert(
          fc.property(fc.array(fc.anything(), { minLength: 2 }), (array) => {
            const list = List.chain(List.ofArray(array));
            const tail = list.tail();
            expect(tail.isSome()).toBeTrue();
            tail.map((t) => expect(t.toArray()).toEqual(array.slice(1)));
          }),
        );
      });

      it("should return ChainableOption.Some for lists with a single element", () => {
        const singleElementList = List.chain(List.ofArray([1]));
        expect(singleElementList.tail().isSome()).toBeTrue();
      });
    });

    describe("prepend", () => {
      it("should add a value to the beginning of a chainable list", () => {
        fc.assert(
          fc.property(
            fc.anything(),
            fc.array(fc.anything()),
            (value, array) => {
              const list = List.chain(List.ofArray(array));
              const newList = list.prepend(value);
              expect(newList.toArray()[0]).toEqual(value);
            },
          ),
        );
      });

      it("should increase the length of the chainable list by one", () => {
        fc.assert(
          fc.property(
            fc.anything(),
            fc.array(fc.anything()),
            (value, array) => {
              const list = List.chain(List.ofArray(array));
              const newList = list.prepend(value);
              expect(newList.length()).toEqual(array.length + 1);
            },
          ),
        );
      });
    });

    describe("append", () => {
      it("should add a value to the end of a chainable list", () => {
        fc.assert(
          fc.property(
            fc.anything(),
            fc.array(fc.anything()),
            (value, array) => {
              const list = List.chain(List.ofArray(array));
              const newList = list.append(value);
              const resultArray = newList.toArray();
              expect(resultArray[resultArray.length - 1]).toEqual(value);
            },
          ),
        );
      });

      it("should increase the length of the chainable list by one", () => {
        fc.assert(
          fc.property(
            fc.anything(),
            fc.array(fc.anything()),
            (value, array) => {
              const list = List.chain(List.ofArray(array));
              const newList = list.append(value);
              expect(newList.length()).toEqual(array.length + 1);
            },
          ),
        );
      });
    });

    describe("at", () => {
      it("should retrieve the correct element for a valid index in a non-empty chainable list", () => {
        fc.assert(
          fc.property(
            fc.array(fc.anything(), { minLength: 1 }),
            fc.integer({ min: 0 }),
            (array, index) => {
              const list = List.chain(List.ofArray(array));
              const result = list.at(index % array.length);
              expect(result.isOk()).toBeTrue();
              expect(result.unwrap()).toEqual(array[index % array.length]);
            },
          ),
        );
      });

      it("should return an error result for an index out of bounds", () => {
        const list = List.chain(List.ofArray([1, 2, 3]));
        const result = list.at(5);
        expect(result.isError()).toBeTrue();
      });
    });

    describe("find", () => {
      it("should find an element that satisfies the predicate", () => {
        fc.assert(
          fc.property(fc.array(fc.integer(), { minLength: 1 }), (array) => {
            const list = List.chain(List.ofArray(array));
            const predicate = (value: number) => value === array[0];
            const result = list.find(predicate);
            expect(result.isSome()).toBeTrue();
            expect(result.unwrap()).toEqual(array[0]);
          }),
        );
      });

      it("should return ChainableOption.None if no element satisfies the predicate", () => {
        const list = List.chain(List.ofArray([1, 2, 3]));
        const predicate = (value: number) => value === 4;
        const result = list.find(predicate);
        expect(result.isNone()).toBeTrue();
      });
    });

    describe("map", () => {
      it("should correctly transform each element in a non-empty chainable list", () => {
        fc.assert(
          fc.property(
            fc.array(fc.anything(), { minLength: 1 }),
            fc.func(fc.anything()),
            (array, transformFn) => {
              const wrappedTransformFn = (value: any, _index: number) =>
                transformFn(value);
              const list = List.chain(List.ofArray(array));
              const mappedList = list.map(wrappedTransformFn);
              expect(mappedList.toArray()).toEqual(
                array.map(wrappedTransformFn),
              );
            },
          ),
        );
      });
    });

    describe("filter", () => {
      it("should retain only elements that satisfy the predicate", () => {
        fc.assert(
          fc.property(fc.array(fc.anything(), { minLength: 1 }), (array) => {
            const list = List.chain(List.ofArray(array));
            const predicate = (_value: any, index: number) => index % 2 === 0;
            const filteredList = list.filter(predicate);
            expect(filteredList.toArray()).toEqual(
              array.filter((_, index) => index % 2 === 0),
            );
          }),
        );
      });
    });

    describe("filterMap", () => {
      it("should correctly transform and filter elements in a non-empty chainable list", () => {
        fc.assert(
          fc.property(fc.array(fc.anything(), { minLength: 1 }), (array) => {
            const list = List.chain(List.ofArray(array));
            const transformFn = (value: any) => Option.some(value);
            const filteredList = list.filterMap(transformFn);
            expect(filteredList.toArray()).toEqual(
              array.map(transformFn).filter(Option.isSome).map(Option.unwrap),
            );
          }),
        );
      });
    });

    describe("reduce", () => {
      it("should accumulate correctly for non-empty chainable lists", () => {
        fc.assert(
          fc.property(
            fc.array(fc.integer()),
            fc.integer(),
            (array, initialValue) => {
              const list = List.chain(List.ofArray(array));
              const reducer = (acc: number, value: number) => acc + value;
              const result = list.reduce(reducer, initialValue);
              expect(result).toEqual(array.reduce(reducer, initialValue));
            },
          ),
        );
      });
    });
  });
});
