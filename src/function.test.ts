import { describe, expect, it } from "bun:test";
import fc from "fast-check";
import { Function } from "./function";

describe("Function", () => {
  describe("curry", () => {
    it("should return the correct result for a curried two-argument function", () => {
      fc.assert(
        fc.property(fc.integer(), fc.integer(), (a, b) => {
          const add = (x: number, y: number) => x + y;
          const curriedAdd = Function.curry(add);
          expect(curriedAdd(a)(b)).toEqual(add(a, b));
        }),
      );
    });

    it("should return a function when partially applied", () => {
      fc.assert(
        fc.property(fc.integer(), (a) => {
          const add = (x: number, y: number) => x + y;
          const curriedAdd = Function.curry(add);
          expect(typeof curriedAdd(a)).toBe("function");
        }),
      );
    });

    it("should work correctly for functions with more than two arguments", () => {
      fc.assert(
        fc.property(fc.integer(), fc.integer(), fc.integer(), (a, b, c) => {
          const addThree = (x: number, y: number, z: number) => x + y + z;
          const curriedAddThree = Function.curry(addThree);
          expect(curriedAddThree(a)(b)(c)).toEqual(addThree(a, b, c));
        }),
      );
    });

    it("should return the correct result when all arguments are applied at once", () => {
      fc.assert(
        fc.property(fc.integer(), fc.integer(), fc.integer(), (a, b, c) => {
          const multiplyThree = (x: number, y: number, z: number) => x * y * z;
          const curriedMultiplyThree = Function.curry(multiplyThree);
          expect(curriedMultiplyThree(a, b, c)).toEqual(multiplyThree(a, b, c));
        }),
      );
    });

    it("should handle partial application with two arguments and then apply the third", () => {
      fc.assert(
        fc.property(fc.integer(), fc.integer(), fc.integer(), (a, b, c) => {
          const concatenateThree = (x: number, y: number, z: number) =>
            `${x}-${y}-${z}`;
          const curriedConcatenateThree = Function.curry(concatenateThree);
          const partiallyAppliedWithTwo = curriedConcatenateThree(a, b);
          expect(partiallyAppliedWithTwo(c)).toEqual(concatenateThree(a, b, c));
        }),
      );
    });

    it("should handle functions with no arguments", () => {
      fc.assert(
        fc.property(fc.anything(), (_) => {
          const returnFixedValue = () => 42;
          const curriedReturnFixedValue = Function.curry(returnFixedValue);
          expect(curriedReturnFixedValue()).toEqual(returnFixedValue());
        }),
      );
    });

    it("should handle higher-order functions correctly", () => {
      fc.assert(
        fc.property(fc.integer(), fc.integer(), (a, b) => {
          const createAdder = (x: number) => (y: number) => x + y;
          const curriedCreateAdder = Function.curry(createAdder);
          const adder = curriedCreateAdder(a);
          expect(typeof adder).toBe("function");
          expect(adder(b)).toEqual(createAdder(a)(b));
        }),
      );
    });

    it("should correctly propagate exceptions thrown by the original function", () => {
      fc.assert(
        fc.property(fc.integer(), (a) => {
          const throwError = (x: number) => {
            if (x > 0) throw new Error("Test error");
            return x;
          };
          const curriedThrowError = Function.curry(throwError);
          if (a > 0) {
            expect(() => curriedThrowError(a)).toThrow("Test error");
          } else {
            expect(curriedThrowError(a)).toEqual(a);
          }
        }),
      );
    });
  });
});
