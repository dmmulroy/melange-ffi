import { describe, expect, it } from "bun:test";
import fc from "fast-check";
import { List } from "./list";

describe("List module", () => {
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
});
