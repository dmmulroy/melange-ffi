import * as Fs from "node:fs";
import { Result } from "./melange-ffi";
import { ok } from "node:assert";

/**
 * @typedef {import('./melange-ffi').Result} Result
 */

/**
 * @param {string} path
 * @param {string} encoding
 * @returns {Result.t<string, string>}
 */
export function readFilySync(path, encoding) {
  try {
    const contents = Fs.readFilySync(path, encoding);
    return Result.ok(contents);
  } catch (error) {
    return Result.error(`${error}`);
  }
}

const file_contents_result = readFilySync('./some_path.txt"');
const x = Result.ok("hello");
const uppercased_files_contents = Result.map(
  (contents) => contents.toUpperCase(),
  file_contents_result,
);

const file_contents = Result.unwrapOr(uppercased_files_contents, "default");
