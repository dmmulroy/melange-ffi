import { describe, expect, it } from "bun:test";
import fc from "fast-check";
import { Result } from "./result";
import { Option } from "./option";

describe("Result module", () => {
  describe("Result", () => {
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

  describe("ChainableResult", () => {
    describe("ok", () => {
      it("should create an Ok result with the provided value", () => {
        fc.assert(
          fc.property(fc.anything(), (value: any) => {
            const result = Result.chain(Result.ok(value));
            expect(result.isOk()).toBeTrue();
            expect(result.unwrap()).toEqual(value);
          }),
        );
      });

      describe("error", () => {
        it("should create an Error result with the provided error", () => {
          fc.assert(
            fc.property(fc.anything(), (error) => {
              const result = Result.chain(Result.error(error));
              expect(result.isError()).toBeTrue();
              expect(() => result.unwrap()).toThrow();
            }),
          );
        });
      });

      describe("isOk", () => {
        it("should return true for Ok results", () => {
          fc.assert(
            fc.property(fc.anything(), (value) => {
              const result = Result.chain(Result.ok(value));
              expect(result.isOk()).toBeTrue();
            }),
          );
        });

        it("should return false for Error results", () => {
          fc.assert(
            fc.property(fc.anything(), (error) => {
              const result = Result.chain(Result.error(error));
              expect(result.isOk()).toBeFalse();
            }),
          );
        });
      });
    });

    describe("isError", () => {
      it("should return true for Error results", () => {
        fc.assert(
          fc.property(fc.anything(), (error) => {
            const result = Result.chain(Result.error(error));
            expect(result.isError()).toBeTrue();
          }),
        );
      });

      it("should return false for Ok results", () => {
        fc.assert(
          fc.property(fc.anything(), (value) => {
            const result = Result.chain(Result.ok(value));
            expect(result.isError()).toBeFalse();
          }),
        );
      });
    });

    describe("toOption", () => {
      it("should convert an Ok result to a Some option with the same value", () => {
        fc.assert(
          fc.property(fc.anything(), (value) => {
            const okResult = Result.chain(Result.ok(value));
            const option: Option<any> = okResult.toOption();
            expect(Option.isSome(option)).toBeTrue();
            expect(Option.unwrap(option)).toEqual(value);
          }),
        );
      });

      it("should convert an Error result to a None option", () => {
        fc.assert(
          fc.property(fc.anything(), (error) => {
            const errorResult = Result.chain(Result.error(error));
            const option = errorResult.toOption();
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
              const okResult = Result.chain(Result.ok(value));
              const mappedResult = okResult.map(fn);
              expect(mappedResult.isOk()).toBeTrue();
              expect(mappedResult.unwrap()).toEqual(fn(value));
            },
          ),
        );
      });

      it("should not modify the Result if it is an Error", () => {
        fc.assert(
          fc.property(fc.anything(), fc.func(fc.anything()), (error, fn) => {
            const errorResult = Result.chain(Result.error(error));
            const mappedResult = errorResult.map(fn);
            expect(mappedResult.isError()).toBeTrue();
            expect(() => mappedResult.unwrap()).toThrow();
          }),
        );
      });

      it("should work correctly for different types of values in Ok", () => {
        fc.assert(
          fc.property(
            fc.anything(),
            fc.anything(),
            (value: any, newValue: any) => {
              const okResult = Result.chain(Result.ok(value));
              const transformFn = () => newValue; // Transformation function
              const mappedResult = okResult.map(transformFn);
              expect(mappedResult.isOk()).toBeTrue();
              expect(mappedResult.unwrap()).toEqual(newValue);
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
              const okResult = Result.chain(Result.ok(value));
              const result = okResult.then(fn);
              expect(result.isOk()).toBeTrue();
              expect(result.unwrap()).toEqual(Result.unwrap(fn(value)));
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
              const errorResult = Result.chain(Result.error(error));
              const result = errorResult.then(fn);
              expect(result.isError()).toBeTrue();
              expect(() => result.unwrap()).toThrow();
            },
          ),
        );
      });

      it("should return Error if the function returns an Error result", () => {
        fc.assert(
          fc.property(fc.anything(), fc.anything(), (value, newError) => {
            const okResult = Result.chain(Result.ok(value));
            const result = okResult.then(() => Result.error(newError as any));
            expect(result.isError()).toBeTrue();
            expect(() => result.unwrap()).toThrow();
          }),
        );
      });

      it("should work correctly for different types of values in Ok", () => {
        fc.assert(
          fc.property(fc.anything(), fc.anything(), (value, newValue: any) => {
            const okResult = Result.chain(Result.ok(value));
            const transformFn = () => Result.ok(newValue);
            const result = okResult.then(transformFn);
            expect(result.isOk()).toBeTrue();
            expect(result.unwrap()).toEqual(newValue);
          }),
        );
      });
    });

    describe("unwrapOr", () => {
      it("should return the value for an Ok result", () => {
        fc.assert(
          fc.property(fc.anything(), fc.anything(), (value, defaultValue) => {
            const okResult = Result.chain(Result.ok(value));
            expect(okResult.unwrapOr(defaultValue)).toEqual(value);
          }),
        );
      });

      it("should return the default value for an Error result", () => {
        fc.assert(
          fc.property(fc.anything(), fc.anything(), (error, defaultValue) => {
            const errorResult = Result.chain(Result.error(error));
            expect(errorResult.unwrapOr(defaultValue)).toEqual(defaultValue);
          }),
        );
      });
    });

    describe("unwrap", () => {
      it("should return the value for an Ok result", () => {
        fc.assert(
          fc.property(fc.anything(), (value: any) => {
            const okResult = Result.chain(Result.ok(value));
            expect(okResult.unwrap()).toEqual(value);
          }),
        );
      });

      it("should throw an error for an Error result", () => {
        fc.assert(
          fc.property(fc.anything(), (error) => {
            const errorResult = Result.chain(Result.error(error));
            expect(() => errorResult.unwrap()).toThrow();
          }),
        );
      });
    });

    describe("chaining map and then", () => {
      it("should allow chaining map and then together", () => {
        fc.assert(
          fc.property(
            fc.anything(),
            fc.func(fc.anything()),
            fc.func(fc.anything().map((value) => Result.ok(value))),
            (initialValue, mapFn, thenFn) => {
              const chainedResult = Result.chain(Result.ok(initialValue))
                .map(mapFn)
                .then(thenFn);
              expect(chainedResult.isOk()).toBeTrue();
              expect(chainedResult.unwrap()).toEqual(
                Result.unwrap(thenFn(mapFn(initialValue)) as Result<any, any>),
              );
            },
          ),
        );
      });
    });

    describe("chaining multiple map calls", () => {
      it("should allow chaining multiple map calls", () => {
        fc.assert(
          fc.property(
            fc.anything(),
            fc.func(fc.anything()),
            fc.func(fc.anything()),
            (initialValue, mapFn1, mapFn2) => {
              const chainedResult = Result.chain(Result.ok(initialValue))
                .map(mapFn1)
                .map(mapFn2);
              expect(chainedResult.isOk()).toBeTrue();
              expect(chainedResult.unwrap()).toEqual(
                mapFn2(mapFn1(initialValue)),
              );
            },
          ),
        );
      });
    });

    describe("chaining mapError after map", () => {
      it("should not affect Ok result when chaining mapError after map", () => {
        fc.assert(
          fc.property(
            fc.anything(),
            fc.func(fc.anything()),
            (initialValue, mapFn) => {
              const chainedResult = Result.chain(Result.ok(initialValue))
                .map(mapFn)
                .mapError((error) => error);

              expect(chainedResult.isOk()).toBeTrue();
              expect(chainedResult.unwrap()).toEqual(mapFn(initialValue));
            },
          ),
        );
      });

      // Test for Error result
      it("should transform Error when chaining mapError after map", () => {
        fc.assert(
          fc.property(
            fc.anything(),
            fc.func(fc.anything()),
            (errorValue, mapErrorFn) => {
              const chainedResult = Result.chain(Result.error(errorValue))
                .map((value) => value)
                .mapError(mapErrorFn);

              expect(chainedResult.isError()).toBeTrue();
              expect(() => chainedResult.unwrap()).toThrow();
            },
          ),
        );
      });
    });

    describe("chaining multiple then calls", () => {
      it("should correctly chain multiple then calls starting with Ok", () => {
        fc.assert(
          fc.property(
            fc.anything(),
            fc.func(fc.anything().map((value) => Result.ok(value))),
            fc.func(fc.anything().map((value) => Result.ok(value))),
            (initialValue, thenFn1, thenFn2) => {
              const chainedResult = Result.chain(Result.ok(initialValue))
                .then(thenFn1)
                .then(thenFn2);

              const intermediateResult = thenFn1(initialValue);
              let expectedValue = Result.isOk(intermediateResult)
                ? Result.unwrap(thenFn2(Result.unwrap(intermediateResult)))
                : null;

              expect(chainedResult.isOk()).toBeTrue();
              expect(chainedResult.unwrap()).toEqual(expectedValue);
            },
          ),
        );
      });

      it("should not execute subsequent then calls after an Error", () => {
        fc.assert(
          fc.property(
            fc.anything(),
            fc.func(fc.anything().map((value) => Result.ok(value))),
            (errorValue, thenFn) => {
              const chainedResult = Result.chain(Result.error(errorValue))
                .then(thenFn)
                .then(thenFn); // This second then should not be executed

              expect(chainedResult.isError()).toBeTrue();
              expect(() => chainedResult.unwrap()).toThrow();
            },
          ),
        );
      });
    });

    describe("chain with both map and mapError", () => {
      it("should correctly apply map and mapError on an Ok result", () => {
        fc.assert(
          fc.property(
            fc.anything(),
            fc.func(fc.anything()),
            fc.func(fc.anything()),
            (initialValue, mapFn, mapErrorFn) => {
              const chainedResult = Result.chain(Result.ok(initialValue))
                .map(mapFn)
                .mapError(mapErrorFn);

              expect(chainedResult.isOk()).toBeTrue();
              expect(chainedResult.unwrap()).toEqual(mapFn(initialValue));
            },
          ),
        );
      });

      it("should correctly apply map and mapError on an Error result", () => {
        fc.assert(
          fc.property(
            fc.anything(),
            fc.func(fc.anything()),
            fc.func(fc.anything()),
            (errorValue, mapFn, mapErrorFn) => {
              const chainedResult = Result.chain(Result.error(errorValue))
                .map(mapFn)
                .mapError(mapErrorFn);

              expect(chainedResult.isError()).toBeTrue();
              expect(() => chainedResult.unwrap()).toThrow();
            },
          ),
        );
      });
    });

    describe("chain with unwrapOr at the end", () => {
      // Test case for Ok result
      it("should return the value for an Ok result when unwrapOr is used at the end", () => {
        fc.assert(
          fc.property(
            fc.anything(),
            fc.anything(),
            fc.func(fc.anything()),
            (initialValue, defaultValue, mapFn) => {
              const chainedResult = Result.chain(Result.ok(initialValue))
                .map(mapFn)
                .unwrapOr(defaultValue);

              expect(chainedResult).toEqual(mapFn(initialValue));
            },
          ),
        );
      });

      // Test case for Error result
      it("should return the default value for an Error result when unwrapOr is used at the end", () => {
        fc.assert(
          fc.property(
            fc.anything(),
            fc.anything(),
            (errorValue, defaultValue) => {
              const chainedResult = Result.chain(
                Result.error(errorValue),
              ).unwrapOr(defaultValue);

              expect(chainedResult).toEqual(defaultValue);
            },
          ),
        );
      });
    });

    describe("unwrap", () => {
      it("should return the value for an Ok result", () => {
        fc.assert(
          fc.property(
            fc.anything(),
            fc.func(fc.anything()),
            (initialValue, mapFn) => {
              const chainedResult = Result.chain(Result.ok(initialValue)).map(
                mapFn,
              );

              expect(chainedResult.isOk()).toBeTrue();
              expect(chainedResult.unwrap()).toEqual(mapFn(initialValue));
            },
          ),
        );
      });

      it("should throw an error for an Error result", () => {
        fc.assert(
          fc.property(fc.anything(), (errorValue) => {
            const chainedResult = Result.chain(Result.error(errorValue));

            expect(chainedResult.isError()).toBeTrue();
            expect(() => chainedResult.unwrap()).toThrow();
          }),
        );
      });
    });

    describe("chain with toOption conversion", () => {
      it("should convert an Ok result to a Some option with the same value", () => {
        fc.assert(
          fc.property(
            fc.anything(),
            fc.func(fc.anything()),
            (initialValue, mapFn) => {
              const option = Result.chain(Result.ok(initialValue))
                .map(mapFn)
                .toOption();

              expect(Option.isSome(option)).toBeTrue();
              expect(Option.unwrap(option)).toEqual(mapFn(initialValue));
            },
          ),
        );
      });

      it("should convert an Error result to a None option", () => {
        fc.assert(
          fc.property(fc.anything(), (errorValue) => {
            const option = Result.chain(Result.error(errorValue)).toOption();

            expect(Option.isNone(option)).toBeTrue();
          }),
        );
      });
    });

    describe("chain with toResult conversion", () => {
      it("should correctly convert an Ok ChainableResult back to an Ok Result", () => {
        fc.assert(
          fc.property(
            fc.anything(),
            fc.func(fc.anything()),
            (initialValue, mapFn) => {
              const originalResult = Result.ok(initialValue);
              const chainableResult = Result.chain(originalResult).map(mapFn);
              const resultBack = chainableResult.toResult();

              expect(Result.isOk(resultBack)).toBeTrue();
              expect(Result.unwrap(resultBack)).toEqual(mapFn(initialValue));
            },
          ),
        );
      });

      it("should correctly convert an Error ChainableResult back to an Error Result", () => {
        fc.assert(
          fc.property(fc.anything(), (errorValue) => {
            const originalResult = Result.error(errorValue);
            const chainableResult = Result.chain(originalResult);
            const resultBack = chainableResult.toResult();

            expect(Result.isError(resultBack)).toBeTrue();
            // As there's no direct API to unwrap errors, we test this way
            expect(() => Result.unwrap(resultBack)).toThrow();
          }),
        );
      });
    });
  });
});
