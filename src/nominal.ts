import { Brand } from "./brand";

/**
 * Represents a nominal type in TypeScript.
 * Unlike structural typing where types are equivalent if their structure is
 * the same, nominal typing creates distinct types. This approach uses
 * `branding` to extend a base type with a unique identifier, making it
 * different from the base and other types, even if their structures are
 * identical.
 *
 * `Nominal<T, TSymbol extends symbol>` extends the base type `T` with a symbol
 * `TSymbol`, creating a distinct type. This nominal type is treated as
 * different from its base type and other nominal types, providing a way to
 * enforce type safety where types are otherwise structurally identical.
 *
 * @template T The base type to be extended.
 * @template TSymbol A symbol that uniquely identifies the type
 */
export type Nominal<T, TSymbol extends symbol> = Brand<T, TSymbol>;
