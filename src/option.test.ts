import { describe, expect, it, mock } from "bun:test";
import fc from "fast-check";
import { Option, Result } from ".";

describe("Option module", () => {
  describe("some", () => {
    it("should create a non-empty Option with the provided value", () => {
      fc.assert(
        fc.property(fc.anything(), (value) => {
          const option: Option<any> = Option.some(value);
          expect(Option.isSome(option)).toBeTrue();
          expect(Option.unwrap(option)).toEqual(value);
        }),
      );
    });

    it("should work correctly for different types of values", () => {
      fc.assert(
        fc.property(
          fc.oneof(fc.integer(), fc.boolean(), fc.string(), fc.object()),
          (value) => {
            const option = Option.some(value);
            expect(Option.isSome(option)).toBeTrue();
            expect(Option.unwrap(option)).toEqual(value);
          },
        ),
      );
    });

    it("should encapsulate null and undefined correctly", () => {
      let nullOption = Option.some(null);
      let undefinedOption = Option.some(undefined);

      expect(Option.isSome(nullOption)).toBeTrue();
      expect(Option.unwrap(nullOption)).toBeNull();

      expect(Option.isSome(undefinedOption)).toBeTrue();
      expect(Option.unwrap(undefinedOption)).toBeUndefined();
    });
  });

  describe("none", () => {
    it("should create an empty Option", () => {
      const option = Option.none();
      expect(Option.isNone(option)).toBeTrue();
    });

    it("should not contain any value", () => {
      const option = Option.none();
      expect(() => Option.unwrap(option)).toThrow();
    });

    it("should consistently return the same None instance", () => {
      const none1 = Option.none();
      const none2 = Option.none();
      expect(none1).toBe(none2);
    });
  });

  describe("isSome", () => {
    it("should return true for Option instances created with some", () => {
      fc.assert(
        fc.property(fc.anything(), (value) => {
          const option = Option.some(value);
          expect(Option.isSome(option)).toBeTrue();
        }),
      );
    });

    it("should return false for Option instances created with none", () => {
      const noneOption = Option.none();
      expect(Option.isSome(noneOption)).toBeFalse();
    });
  });

  describe("isNone", () => {
    it("should return true for Option instances created with none", () => {
      const noneOption = Option.none();
      expect(Option.isNone(noneOption)).toBeTrue();
    });

    it("should return false for Option instances created with some", () => {
      fc.assert(
        fc.property(fc.anything(), (value) => {
          const someOption = Option.some(value);
          expect(Option.isNone(someOption)).toBeFalse();
        }),
      );
    });
  });

  describe("map", () => {
    it("should apply the mapping function to a Some value and return Some", () => {
      fc.assert(
        fc.property(fc.anything(), fc.func(fc.anything()), (value, fn) => {
          const someOption: Option<any> = Option.some(value);
          const mappedOption: Option<any> = Option.map(fn, someOption);
          expect(Option.isSome(mappedOption)).toBeTrue();
          expect(Option.unwrap(mappedOption)).toEqual(fn(value));
        }),
      );
    });

    it("should not modify the Option if it is None", () => {
      const noneOption = Option.none();
      const fn = mock(() => {
        return undefined;
      });
      const mappedOption = Option.map(fn, noneOption);
      expect(Option.isNone(mappedOption)).toBeTrue();
      expect(fn).not.toHaveBeenCalled();
    });

    it("should work correctly for different types of values in Some", () => {
      fc.assert(
        fc.property(
          fc.oneof(fc.integer(), fc.boolean(), fc.string(), fc.object()),
          (value) => {
            const someOption = Option.some(value);
            const transformFn = (x: any) => x; // Identity function
            const mappedOption = Option.map(transformFn, someOption);
            expect(Option.isSome(mappedOption)).toBeTrue();
            expect(Option.unwrap(mappedOption)).toEqual(value);
          },
        ),
      );
    });
  });

  describe("then", () => {
    it("should apply the function and flatten the result for a Some value", () => {
      fc.assert(
        fc.property(fc.anything(), fc.func(fc.anything()), (value, fn) => {
          const wrappedFn = (value: any) =>
            Option.some(fn(value)) as Option<any>;
          const someOption = Option.some(value);
          const resultOption: Option<any> = Option.then(wrappedFn, someOption);
          expect(Option.isSome(resultOption)).toBeTrue();
          expect(Option.unwrap(resultOption)).toEqual(fn(value));
        }),
      );
    });

    it("should return None if the original Option is None", () => {
      const noneOption = Option.none();
      const fn: (...args: any[]) => any = mock(() => {
        return undefined;
      });
      const resultOption = Option.then(fn, noneOption);
      expect(Option.isNone(resultOption)).toBeTrue();
      expect(fn).not.toHaveBeenCalled();
    });

    it("should return None if the function returns None", () => {
      fc.assert(
        fc.property(fc.anything(), (value) => {
          const someOption = Option.some(value);
          const resultOption = Option.then(() => Option.none(), someOption);
          expect(Option.isNone(resultOption)).toBeTrue();
        }),
      );
    });

    it("should work correctly for different types of values in Some", () => {
      fc.assert(
        fc.property(fc.anything(), fc.anything(), (value, newValue) => {
          const someOption = Option.some(value);
          const transformFn = () => Option.some(newValue);
          const resultOption: Option<any> = Option.then(
            transformFn,
            someOption,
          );
          expect(Option.isSome(resultOption)).toBeTrue();
          expect(Option.unwrap(resultOption)).toEqual(newValue);
        }),
      );
    });
  });

  describe("unwrapOr", () => {
    it("should return the value for a Some option", () => {
      fc.assert(
        fc.property(fc.integer(), fc.integer(), (value, defaultValue) => {
          const someOption = Option.some(value);
          expect(Option.unwrapOr(defaultValue, someOption)).toEqual(value);
        }),
      );
    });

    it("should return the default value for a None option", () => {
      fc.assert(
        fc.property(fc.integer(), (defaultValue) => {
          const noneOption = Option.none();
          expect(Option.unwrapOr(defaultValue, noneOption)).toEqual(
            defaultValue,
          );
        }),
      );
    });
  });

  describe("unwrap", () => {
    it("should return the value for a Some option", () => {
      fc.assert(
        fc.property(fc.anything(), (value) => {
          const someOption: Option<any> = Option.some(value);
          expect(Option.unwrap(someOption)).toEqual(value);
        }),
      );
    });

    it("should throw an error for a None option", () => {
      const noneOption = Option.none();
      expect(() => Option.unwrap(noneOption)).toThrow();
    });
  });

  describe("toResult", () => {
    it("should convert a Some option to Result.ok", () => {
      fc.assert(
        fc.property(fc.anything(), fc.anything(), (value, error) => {
          const someOption = Option.some(value);
          const result = Option.toResult(error, someOption);
          expect(Result.isOk(result)).toBeTrue();
          expect(Result.unwrap(result)).toEqual(value);
        }),
      );
    });

    it("should convert a None option to Result.Error with the provided error", () => {
      fc.assert(
        fc.property(fc.anything(), (error) => {
          const noneOption = Option.none();
          const result = Option.toResult(error, noneOption);
          expect(Result.isError(result)).toBeTrue();
          expect(() => Result.unwrap(result)).toThrow();
        }),
      );
    });
  });
});
