import { defineConfig } from "tsup";

export default defineConfig({
  format: ["esm", "cjs"],
  entry: {
    index: "src/index.ts",
  },
  outDir: "dist",
  // dts: true,
  sourcemap: true,
  clean: true,
  experimentalDts: true,
});
