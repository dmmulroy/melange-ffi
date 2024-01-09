import * as Melange_result from "../vendor/melange/result.mjs";
import * as Melange_option from "../vendor/melange/option.mjs";
import * as Melange_list from "../vendor/melange/list.mjs";
import * as Melange_array from "../vendor/melange/array.mjs";

export function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    } else {
      return function (...args2) {
        return curried.apply(this, args.concat(args2));
      };
    }
  };
}

export const Option = {
  some(value) {
    return Melange_option.some(value);
  },
  isSome(value) {
    return Melange_option.is_some(value);
  },
  isNone(value) {
    return Melange_option.is_none(value);
  },
  none() {
    return Melange_option.none;
  },
  isOption(value) {
    return isSome(value) || isNone(value);
  },
  map(fn, option) {
    return Melange_option.map(fn, option);
  },
  then(fn, option) {
    return Melange_option.bind(option, fn);
  },
  unwrapOr(option, defaultValue) {
    return Melange_option.value(option, defaultValue);
  },
  toResult(value, error) {
    return Melange_option.to_result(value, error);
  },
};

export const Result = {
  ok(value) {
    return Melange_result.ok(value);
  },
  error(value) {
    return Melange_result.error(value);
  },
  isOk(result) {
    return Melange_result.is_ok(result);
  },
  isError(value) {
    return Melange_result.is_error(value);
  },
  isResult(value) {
    return isOk(value) || isError(value);
  },
  toOption(result) {
    return Melange_result.to_option(result);
  },
  map(fn, result) {
    return Melange_result.map(fn, result);
  },
  then(fn, result) {
    return Melange_result.bind(result, fn);
  },
  unwrapOr(result, defaultValue) {
    return Melange_result.value(result, defaultValue);
  },
};

export const List = {
  length(list) {
    return Melange_list.length(list);
  },
  ofArray(array) {
    return Melange_array.to_list(array);
  },
  empty() {
    return ofArray([]);
  },
  isEmpty(list) {
    return Melange_list.is_empty(list);
  },
  head(list) {
    return Melange_list.hd(list);
  },
  tail(list) {
    return Melange_list.last(list);
  },
  prepend(value, list) {
    return Melange_list.cons(value, list);
  },
  append(value, list) {
    return Melange_list.append(list, [value]);
  },
  at(index, list) {
    try {
      const maybeValue = Melange_list.nth_opt(index, list);
      return Option.toResult(maybeValue, "Not found");
    } catch (/** { RE_EXN_ID: "Invalid_argument", _1: "List.nth",*/ _) {
      return Result.error("Negative index");
    }
  },
  find(predicate, list) {
    const maybeValue = Melange_list.find_opt(predicate, list);
    return Option.toResult(maybeValue, "Not found");
  },
  map(fn, list) {
    return Melange_list.mapi(fn, list);
  },
  filter(predicate, list) {
    return Melange_list.filteri(predicate, list);
  },
  filterMap(fn, list) {
    return Melange_list.filter_map(fn, list);
  },
  reduce(fn, acc, list) {
    let idx = 0;
    while (true) {
      if (!list) {
        return acc;
      }
      acc = fn(acc, list.hd, idx++);
      list = list.tl;
    }
  },
};

// Uncurrying example from melange.re

// Current State
function map(a, b, f) {
  var i = Math.min(a.length, b.length);
  var c = new Array(i);
  for (var j = 0; j < i; ++j) {
    c[j] = f(a[i], b[i]);
  }
  return c;
}
/* 
 * We need need to uncurry using the `[@u]` attribute:
 * external map : 'a array -> 'b array -> (('a -> 'b -> 'c)[@u]) -> 'c array
  = "map" */

const map = curry(function map(a, b, f) {
  var i = Math.min(a.length, b.length);
  var c = new Array(i);
  for (var j = 0; j < i; ++j) {
    c[j] = f(a[i], b[i]);
  }
  return c;
});

// Or

const map = (a) => (b) => (f) => {
  var i = Math.min(a.length, b.length);
  var c = new Array(i);
  for (var j = 0; j < i; ++j) {
    c[j] = f(a[i], b[i]);
  }
  return c;
};
/*
 * Use this as an example for why bindings are nicer using this approach:
 *
external exec :
  string ->
  Node.Child_process.option ->
  (* TODO: stdout and stderr may be buffers *)
  ((error:exn Js.nullable -> stdout:string -> stderr:string -> unit)
  [@mel.uncurry]) ->
  (* TODO: Figure out if this is okay as a return type *)
  unit = "exec"
[@@mel.module "node:child_process"]
 * */

/*
 * Now the "naive" binding works:
 * external map : 'a array -> 'b array -> ('a -> 'b -> 'c) -> 'c array = "map"
 * [@@mel.module "array_ffi"]
 * */

// fs_ffi.mjs

export function readFileSync(path) {
  try {
    return Result.ok(fs.readFileSync(path, "utf8"));
  } catch (error) {
    return Result.error(error.toString());
  }
}

export function writeFileSync(path, content) {
  try {
    return Result.ok(fs.writeFileSync(path, content));
  } catch (error) {
    return Result.error(error.toString());
  }
}

// our ocaml side ffi:
// external readFileSync : string -> (string, string) result = "readFileSync" [@@mel.module "fs_ffi"]
// external writeFileSync : string -> string -> (unit, string) result = "writeFileSync" [@@mel.module "fs_ffi"]
//
//

/*
 * I'm playing with this idea to make writing Melange bindings easier and more
 * ergonomic. I cribbed the idea from Gleam and the way it does FFI. Essentially,
 * rather than fighting clunky external syntax and ppx attribute and extension
 * nodes to try and bind directly to 3rd party libraries, we instead write a
 * a "ffi wrapper" in JS. In addition, we give access to a slimmed down and
 * opinionated version of Melanges/OCaml's stdlib in JS so we can use it to
 * "shape" our ffi function or type(s) prior to writing any `external` bindings
 * on the Ocaml side. This has the result of greatly simplifying the external bindings
 * from the Ocaml side.
 *
 * This was totally doable before, but I took it a step further and made it
 * we can have access to Melange.js and its stdlib
 *
 *
 */
