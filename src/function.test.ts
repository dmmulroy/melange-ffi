import { describe, expect, it, mock } from "bun:test";
import fc from "fast-check";
import { Function } from "./function";
import { Result } from ".";

describe("Function module", () => {
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

  describe("compose", () => {
    it("should return a ComposableFunction", () => {
      const identity = (x: number) => x;
      const composedFunction = Function.compose(identity);
      expect(typeof composedFunction).toBe("function");
      expect(typeof composedFunction.compose).toBe("function");
    });

    it("should correctly compose two functions", () => {
      fc.assert(
        fc.property(fc.integer(), (a) => {
          const addOne = (x: number) => x + 1;
          const square = (x: number) => x * x;
          const composedFunction = Function.compose(addOne).compose(square);
          expect(composedFunction(a)).toEqual(square(addOne(a)));
        }),
      );
    });

    it("should maintain the correct order of function composition", () => {
      fc.assert(
        fc.property(fc.integer(), (a) => {
          const addOne = (x: number) => x + 1;
          const square = (x: number) => x * x;
          const composedFunction = Function.compose(square).compose(addOne);
          expect(composedFunction(a)).toEqual(addOne(square(a)));
        }),
      );
    });

    it("should handle multiple compositions", () => {
      fc.assert(
        fc.property(fc.integer(), (a) => {
          const addOne = (x: number) => x + 1;
          const square = (x: number) => x * x;
          const negate = (x: number) => -x;
          const composedFunction = Function.compose(addOne)
            .compose(square)
            .compose(negate);
          expect(composedFunction(a)).toEqual(negate(square(addOne(a))));
        }),
      );
    });

    it("should work correctly with different types in composition", () => {
      const toString = (x: number) => x.toString();
      const concatHello = (x: string) => "Hello " + x;
      const composedFunction = Function.compose(toString).compose(concatHello);
      expect(composedFunction(5)).toEqual("Hello 5");
    });
  });

  describe("constant", () => {
    it("should return a function", () => {
      const value = 42;
      const constantFunction = Function.constant(value);
      expect(typeof constantFunction).toBe("function");
    });

    it("should always return the same value, irrespective of the arguments", () => {
      const value = 42;
      const constantFunction = Function.constant(value);

      expect(constantFunction()).toEqual(value);
      expect(constantFunction(10)).toEqual(value);
      expect(constantFunction(10, 20)).toEqual(value);
      expect(constantFunction("string", null, undefined)).toEqual(value);
    });

    it("should work with different types of values", () => {
      fc.assert(
        fc.property(fc.anything(), (value) => {
          const constantFunction = Function.constant(value);
          expect(constantFunction()).toEqual(value);
          expect(constantFunction("any", "number", "of", "arguments")).toEqual(
            value,
          );
        }),
      );
    });

    it("should create distinct functions for different values", () => {
      const firstValue = 42;
      const secondValue = "hello";
      const firstConstantFunction = Function.constant(firstValue);
      const secondConstantFunction = Function.constant(secondValue);

      expect(firstConstantFunction()).not.toEqual(secondConstantFunction());
    });
  });

  describe("flip", () => {
    it("should return a new function with arguments flipped", () => {
      const subtract = (a: number, b: number) => a - b;
      const flippedSubtract = Function.flip(subtract);
      expect(flippedSubtract(5, 10)).toEqual(subtract(10, 5));
    });

    it("should work correctly with different types of arguments", () => {
      const concat = (a: string, b: number) => a + b.toString();
      const flippedConcat = Function.flip(concat);
      expect(flippedConcat(5, "Number: ")).toEqual(concat("Number: ", 5));
    });

    it("should not affect the original function", () => {
      const multiply = (a: number, b: number) => a * b;
      const flippedMultiply = Function.flip(multiply);
      expect(multiply(3, 4)).toEqual(12);
      expect(flippedMultiply(3, 4)).toEqual(12);
    });

    it("should maintain correct functionality when flipped multiple times", () => {
      const divide = (a: number, b: number) => a / b;
      const flippedDivide = Function.flip(divide);
      const reFlippedDivide = Function.flip(flippedDivide);
      expect(flippedDivide(4, 2)).toEqual(divide(2, 4));
      expect(reFlippedDivide(4, 2)).toEqual(divide(4, 2));
    });
  });

  describe("identity", () => {
    it("should return the same value for numbers", () => {
      const num = 42;
      expect(Function.identity(num)).toEqual(num);
    });

    it("should return the same value for strings", () => {
      const str = "hello";
      expect(Function.identity(str)).toEqual(str);
    });

    it("should return the same value for objects", () => {
      const obj = { key: "value" };
      expect(Function.identity(obj)).toEqual(obj);
    });

    it("should return the same value for arrays", () => {
      const arr = [1, 2, 3];
      expect(Function.identity(arr)).toEqual(arr);
    });

    it("should return the same value for boolean values", () => {
      const bool = true;
      expect(Function.identity(bool)).toEqual(bool);
    });

    it("should return the same value for null and undefined", () => {
      expect(Function.identity(null)).toEqual(null);
      expect(Function.identity(undefined)).toEqual(undefined);
    });

    it("should work with different types of values", () => {
      fc.assert(
        fc.property(fc.anything(), (value) => {
          expect(Function.identity(value)).toEqual(value);
        }),
      );
    });
  });

  describe("tap", () => {
    it("should return the original value", () => {
      fc.assert(
        fc.property(fc.anything(), (value) => {
          const sideEffectFn = () => {};
          expect(Function.tap(sideEffectFn, value)).toEqual(value);
        }),
      );
    });

    it("should execute the side-effect function", () => {
      fc.assert(
        fc.property(fc.anything(), (value) => {
          let sideEffectExecuted = false;
          const sideEffectFn = () => {
            sideEffectExecuted = true;
          };
          Function.tap(sideEffectFn, value);
          expect(sideEffectExecuted).toBe(true);
        }),
      );
    });

    it("should ignore errors in the side-effect function and return the original value", () => {
      fc.assert(
        fc.property(fc.anything(), (value) => {
          const errorFn = () => {
            throw new Error("Error in side-effect");
          };
          expect(Function.tap(errorFn, value)).toEqual(value);
        }),
      );
    });

    it("should not await asynchronous side-effect functions", () => {
      fc.assert(
        fc.property(fc.anything(), (value) => {
          let asyncExecuted = false;
          const asyncFn = async () => {
            return new Promise<void>((resolve) =>
              setTimeout(() => {
                asyncExecuted = true;
                resolve();
              }, 1000),
            );
          };
          Function.tap(asyncFn, value);
          expect(asyncExecuted).toBe(false);
        }),
      );
    });

    it("should return the original value even if the asynchronous function throws an error", () => {
      fc.assert(
        fc.property(fc.anything(), (value) => {
          const asyncErrorFn = async () => {
            throw new Error("Async error");
          };
          expect(Function.tap(asyncErrorFn, value)).toEqual(value);
        }),
      );
    });
  });

  describe("tryCatch", () => {
    it("should handle successful synchronous function execution", () => {
      fc.assert(
        fc.property(fc.anything(), (value) => {
          const fn = () => value;
          const andFinally = mock(() => {});
          const result = Function.tryCatch(fn, andFinally);
          expect(Result.isOk(result)).toBe(true);
          expect(Result.unwrap(result)).toEqual(value);
          expect(andFinally).toHaveBeenCalled();
        }),
      );
    });

    it("should handle errors in synchronous functions", () => {
      const errorMessage = "Sync error";
      const fn = (): void => {
        throw new Error(errorMessage);
      };
      const andFinally = mock(() => {});
      const result = Function.tryCatch(fn, andFinally);
      expect(Result.isError(result)).toBe(true);
      expect(() => Result.unwrap(result)).toThrow();
      expect(andFinally).toHaveBeenCalled();
    });

    it("should handle successful asynchronous function execution", async () => {
      fc.assert(
        fc.asyncProperty(fc.anything(), async (value) => {
          const asyncFn = async () => value;
          const andFinally = mock(() => {});
          const result = await Function.tryCatch(asyncFn, andFinally);
          expect(Result.isOk(result)).toBe(true);
          expect(andFinally).toHaveBeenCalled();
        }),
      );
    });

    it("should handle errors in asynchronous functions", async () => {
      const errorMessage = "Async error";
      const asyncFn = async () => {
        throw new Error(errorMessage);
      };
      const andFinally = mock(() => {});
      const result = await Function.tryCatch(asyncFn, andFinally);
      expect(Result.isError(result)).toBe(true);
      expect(andFinally).toHaveBeenCalled();
    });

    it("should work with different types of return values", () => {
      fc.assert(
        fc.property(fc.anything(), (value) => {
          const fn = () => value;
          const andFinally = mock(() => {});
          const result = Function.tryCatch(fn, andFinally);
          if (value instanceof Promise) {
            expect(result).toBeInstanceOf(Promise);
          } else {
            expect(Result.isOk(result)).toBe(true);
            expect(Result.unwrap(result)).toEqual(value);
          }
          expect(andFinally).toHaveBeenCalled();
        }),
      );
    });
  });
});
