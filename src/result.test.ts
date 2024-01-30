import { describe, expect, it } from "bun:test";
import fc from "fast-check";
import { Option, Result } from ".";

describe("Result module", () => {
  describe("ok", () => {
    it("should create an Ok result with the provided value", () => {
      fc.assert(
        fc.property(fc.anything(), (value: any) => {
          const result: Result<any, any> = Result.ok(value);
          expect(Result.isOk(result)).toBeTrue();
          expect(Result.unwrap(result)).toEqual(value);
        }),
      );
    });

    describe("error", () => {
      it("should create an Error result with the provided error", () => {
        fc.assert(
          fc.property(fc.anything(), (error) => {
            const result: Result<any, any> = Result.error(error);
            expect(Result.isError(result)).toBeTrue();
            expect(() => Result.unwrap(result)).toThrow();
          }),
        );
      });
    });

    describe("isOk", () => {
      it("should return true for Ok results", () => {
        fc.assert(
          fc.property(fc.anything(), (value) => {
            const result = Result.ok(value);
            expect(Result.isOk(result)).toBeTrue();
          }),
        );
      });

      it("should return false for Error results", () => {
        fc.assert(
          fc.property(fc.anything(), (error) => {
            const result = Result.error(error);
            expect(Result.isOk(result)).toBeFalse();
          }),
        );
      });
    });
  });

  describe("isError", () => {
    it("should return true for Error results", () => {
      fc.assert(
        fc.property(fc.anything(), (error) => {
          const result = Result.error(error);
          expect(Result.isError(result)).toBeTrue();
        }),
      );
    });

    it("should return false for Ok results", () => {
      fc.assert(
        fc.property(fc.anything(), (value) => {
          const result = Result.ok(value);
          expect(Result.isError(result)).toBeFalse();
        }),
      );
    });
  });

  describe("toOption", () => {
    it("should convert an Ok result to a Some option with the same value", () => {
      fc.assert(
        fc.property(fc.anything(), (value) => {
          const okResult = Result.ok(value);
          const option: Option<any> = Result.toOption(okResult);
          expect(Option.isSome(option)).toBeTrue();
          expect(Option.unwrap(option)).toEqual(value);
        }),
      );
    });

    it("should convert an Error result to a None option", () => {
      fc.assert(
        fc.property(fc.anything(), (error) => {
          const errorResult = Result.error(error);
          const option = Result.toOption(errorResult);
          expect(Option.isNone(option)).toBeTrue();
        }),
      );
    });
  });

  describe("map", () => {
    it("should apply the mapping function to an Ok result and return Ok with the new value", () => {
      fc.assert(
        fc.property(
          fc.anything(),
          fc.func(fc.anything()),
          (value: any, fn: (...args: any[]) => any) => {
            const okResult = Result.ok(value);
            const mappedResult = Result.map(okResult, fn);
            expect(Result.isOk(mappedResult)).toBeTrue();
            expect(Result.unwrap(mappedResult)).toEqual(fn(value));
          },
        ),
      );
    });

    it("should not modify the Result if it is an Error", () => {
      fc.assert(
        fc.property(fc.anything(), fc.func(fc.anything()), (error, fn) => {
          const errorResult = Result.error(error);
          const mappedResult = Result.map(errorResult, fn);
          expect(Result.isError(mappedResult)).toBeTrue();
          expect(() => Result.unwrap(mappedResult)).toThrow();
        }),
      );
    });

    it("should work correctly for different types of values in Ok", () => {
      fc.assert(
        fc.property(
          fc.anything(),
          fc.anything(),
          (value: any, newValue: any) => {
            const okResult = Result.ok(value);
            const transformFn = () => newValue; // Transformation function
            const mappedResult = Result.map(okResult, transformFn);
            expect(Result.isOk(mappedResult)).toBeTrue();
            expect(Result.unwrap(mappedResult)).toEqual(newValue);
          },
        ),
      );
    });
  });

  describe("then", () => {
    it("should apply the function and flatten the result for an Ok value", () => {
      fc.assert(
        fc.property(
          fc.anything(),
          fc.func(fc.anything().map(Result.ok)),
          (value, fn) => {
            const okResult = Result.ok(value);
            const result = Result.then(okResult, fn);
            expect(Result.isOk(result)).toBeTrue();
            expect(Result.unwrap(result)).toEqual(Result.unwrap(fn(value)));
          },
        ),
      );
    });

    it("should return the original Error if the original Result is an Error", () => {
      fc.assert(
        fc.property(
          fc.anything(),
          fc.func(fc.anything().map(Result.ok)),
          (error, fn) => {
            const errorResult = Result.error(error);
            const result = Result.then(errorResult, fn);
            expect(Result.isError(result)).toBeTrue();
            expect(() => Result.unwrap(result)).toThrow();
          },
        ),
      );
    });

    it("should return Error if the function returns an Error result", () => {
      fc.assert(
        fc.property(fc.anything(), fc.anything(), (value, newError) => {
          const okResult = Result.ok(value);
          const result = Result.then(okResult, () =>
            Result.error(newError as any),
          );
          expect(Result.isError(result)).toBeTrue();
          expect(() => Result.unwrap(result)).toThrow();
        }),
      );
    });

    it("should work correctly for different types of values in Ok", () => {
      fc.assert(
        fc.property(fc.anything(), fc.anything(), (value, newValue: any) => {
          const okResult = Result.ok(value);
          const transformFn = () => Result.ok(newValue);
          const result = Result.then(okResult, transformFn);
          expect(Result.isOk(result)).toBeTrue();
          expect(Result.unwrap(result)).toEqual(newValue);
        }),
      );
    });
  });

  describe("unwrapOr", () => {
    it("should return the value for an Ok result", () => {
      fc.assert(
        fc.property(fc.anything(), fc.anything(), (value, defaultValue) => {
          const okResult = Result.ok(value);
          expect(Result.unwrapOr(okResult, defaultValue)).toEqual(value);
        }),
      );
    });

    it("should return the default value for an Error result", () => {
      fc.assert(
        fc.property(fc.anything(), fc.anything(), (error, defaultValue) => {
          const errorResult = Result.error(error);
          expect(Result.unwrapOr(errorResult, defaultValue)).toEqual(
            defaultValue,
          );
        }),
      );
    });
  });

  describe("unwrap", () => {
    it("should return the value for an Ok result", () => {
      fc.assert(
        fc.property(fc.anything(), (value: any) => {
          const okResult: Result<any, any> = Result.ok(value);
          expect(Result.unwrap(okResult)).toEqual(value);
        }),
      );
    });

    it("should throw an error for an Error result", () => {
      fc.assert(
        fc.property(fc.anything(), (error) => {
          const errorResult = Result.error(error);
          expect(() => Result.unwrap(errorResult)).toThrow();
        }),
      );
    });
  });
});
