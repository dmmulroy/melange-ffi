import { describe, expect, it, mock } from "bun:test";
import fc from "fast-check";
import { Option } from "./option";
import { Result } from "./result";
import { List } from "./list";

describe("Option module", () => {
  describe("Option", () => {
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
            const mappedOption: Option<any> = Option.map(someOption, fn);
            expect(Option.isSome(mappedOption)).toBeTrue();
            expect(Option.unwrap(mappedOption)).toEqual(fn(value));
          }),
        );
      });

      it("should not modify the Option if it is None", () => {
        const noneOption = Option.none();
        const fn = mock(() => {});
        const mappedOption = Option.map(noneOption, fn);
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
              const mappedOption = Option.map(someOption, transformFn);
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
            const resultOption: Option<any> = Option.then(
              someOption,
              wrappedFn,
            );
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
        const resultOption = Option.then(noneOption, fn);
        expect(Option.isNone(resultOption)).toBeTrue();
        expect(fn).not.toHaveBeenCalled();
      });

      it("should return None if the function returns None", () => {
        fc.assert(
          fc.property(fc.anything(), (value) => {
            const someOption = Option.some(value);
            const resultOption = Option.then(someOption, () => Option.none());
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
              someOption,
              transformFn,
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
            expect(Option.unwrapOr(someOption, defaultValue)).toEqual(value);
          }),
        );
      });

      it("should return the default value for a None option", () => {
        fc.assert(
          fc.property(fc.integer(), (defaultValue) => {
            const noneOption = Option.none();
            expect(Option.unwrapOr(noneOption, defaultValue)).toEqual(
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
          fc.property(fc.anything(), fc.anything(), (value: any, error) => {
            const someOption = Option.some(value);
            const result = Option.toResult(someOption, error);
            expect(Result.isOk(result)).toBeTrue();
            expect(Result.unwrap(result)).toEqual(value);
          }),
        );
      });

      it("should convert a None option to Result.Error with the provided error", () => {
        fc.assert(
          fc.property(fc.anything(), (error) => {
            const noneOption = Option.none();
            const result = Option.toResult(noneOption, error);
            expect(Result.isError(result)).toBeTrue();
            expect(() => Result.unwrap(result)).toThrow();
          }),
        );
      });
    });

    describe("toList", () => {
      it("should convert a Some value to a list with the Some value as the single item", () => {
        fc.assert(
          fc.property(fc.anything(), (value: any) => {
            const someOption = Option.some(value);
            const list = Option.toList(someOption);
            expect(Option.unwrap(List.head(list))).toEqual(value);
          }),
        );
      });

      it("should convert a None option to an empty list", () => {
        fc.assert(
          fc.property(fc.anything(), () => {
            const noneOption = Option.none();
            const list = Option.toList(noneOption);
            expect(List.length(list)).toEqual(0);
          }),
        );
      });
    });
  });

  describe("ChainableOption", () => {
    describe("isSome", () => {
      it("should return true for Option instances created with some", () => {
        fc.assert(
          fc.property(fc.anything(), (value) => {
            const option = Option.chain(Option.some(value));
            expect(option.isSome()).toBeTrue();
          }),
        );
      });

      it("should return false for Option instances created with none", () => {
        const option = Option.chain(Option.none());
        expect(option.isSome()).toBeFalse();
      });
    });

    describe("isNone", () => {
      it("should return true for Option instances created with none", () => {
        const option = Option.chain(Option.none());
        expect(option.isNone()).toBeTrue();
      });

      it("should return false for Option instances created with some", () => {
        fc.assert(
          fc.property(fc.anything(), (value) => {
            const option = Option.chain(Option.some(value));
            expect(option.isNone()).toBeFalse();
          }),
        );
      });
    });

    describe("map", () => {
      it("should apply the mapping function to a Some value and return a new ChainableOption with the mapped value", () => {
        fc.assert(
          fc.property(fc.anything(), fc.func(fc.anything()), (value, fn) => {
            const option = Option.chain(Option.some(value));
            const mappedOption = option.map(fn);
            expect(mappedOption.isSome()).toBeTrue();
            expect(mappedOption.unwrap()).toEqual(fn(value));
          }),
        );
      });

      it("should not modify the Option if it is None, returning a new ChainableOption with None", () => {
        const option = Option.chain(Option.none());
        const fn = mock(() => {});
        const mappedOption = option.map(fn);
        expect(mappedOption.isNone()).toBeTrue();
      });
    });

    describe("then", () => {
      it("should apply the function and flatten the result for a Some value, returning a new ChainableOption", () => {
        fc.assert(
          fc.property(
            fc.anything(),
            fc.func(fc.anything().map(Option.some)),
            (value, fn) => {
              const option = Option.chain(Option.some(value));
              const resultOption = option.then(fn);
              expect(resultOption.isSome()).toBeTrue();
              expect(resultOption.unwrap()).toEqual(Option.unwrap(fn(value)));
            },
          ),
        );
      });

      it("should return None if the original Option is None, represented as a new ChainableOption", () => {
        const option = Option.chain(Option.none());
        const fn = mock(() => Option.some(1)); // This function should not be called
        const resultOption = option.then(fn);
        expect(resultOption.isNone()).toBeTrue();
      });
    });

    describe("unwrapOr", () => {
      it("should return the value for a Some option, or the default value if the option is None", () => {
        fc.assert(
          fc.property(
            fc.anything(),
            fc.anything(),
            (value, defaultValue: any) => {
              const someOption = Option.chain(Option.some(value));
              expect(someOption.unwrapOr(defaultValue)).toEqual(value);

              const noneOption = Option.chain(Option.none());
              expect(noneOption.unwrapOr(defaultValue)).toEqual(defaultValue);
            },
          ),
        );
      });
    });

    describe("unwrap", () => {
      it("should return the value for a Some option, or throw an error if the option is None", () => {
        fc.assert(
          fc.property(fc.anything(), (value) => {
            const someOption = Option.chain(Option.some(value));
            expect(someOption.unwrap()).toEqual(value);

            const noneOption = Option.chain(Option.none());
            expect(() => noneOption.unwrap("No value found")).toThrow();
          }),
        );
      });
    });

    describe("toResult", () => {
      it("should convert a Some option to a Result.ok, and a None option to a Result.error with the provided error", () => {
        fc.assert(
          fc.property(fc.anything(), fc.anything(), (value, error) => {
            const someOption = Option.chain(Option.some(value));
            const resultOk = Result.chain(someOption.toResult(error));
            expect(resultOk.isOk()).toBeTrue();
            expect(resultOk.unwrap()).toEqual(value);

            const noneOption = Option.chain(Option.none());
            const resultError = Result.chain(noneOption.toResult(error));
            expect(resultError.isError()).toBeTrue();
            expect(() => resultError.unwrap()).toThrow();
          }),
        );
      });
    });

    describe("toList", () => {
      it("should convert a Some value to a list with the Some value as the single item", () => {
        fc.assert(
          fc.property(fc.anything(), (value: any) => {
            const valueOption = Option.chain(Option.some(value))
              .toChainableList()
              .head()
              .unwrap();
            expect(valueOption).toEqual(value);
          }),
        );
      });

      it("should convert a None option to an empty list", () => {
        fc.assert(
          fc.property(fc.anything(), () => {
            const length = Option.chain(Option.none())
              .toChainableList()
              .length();
            expect(length).toEqual(0);
          }),
        );
      });
    });
  });
});
