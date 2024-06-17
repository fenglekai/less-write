import { rollup } from "rollup";
import commonjs from "@rollup/plugin-commonjs";
import esbuild from "rollup-plugin-esbuild";
import glob from "fast-glob";
import vuePlugin from "rollup-plugin-vue";
import {
  excludeFiles,
  generateExternal,
  leRoot,
  pkgRoot,
  writeBundles,
} from "../utils";
import type { OutputOptions, Plugin } from "rollup";
import { target } from "../constants";
import { buildConfigEntries } from "../build-info";

export const buildModules = async () => {
  const input = excludeFiles(
    await glob("**/*.{js,ts,vue}", {
      cwd: pkgRoot,
      absolute: true,
      onlyFiles: true,
    })
  );
  const bundle = await rollup({
    input,
    plugins: [
      vuePlugin({
        include: /\.vue$/,
        target: "browser",
      }) as Plugin,
      commonjs(),
      esbuild({
        sourceMap: true,
        target,
        loaders: {
          ".vue": "ts",
        },
      }),
    ],
    external: await generateExternal({ full: false }),
    treeshake: false,
  });
  await writeBundles(
    bundle,
    buildConfigEntries.map(([module, config]): OutputOptions => {
      return {
        format: config.format,
        dir: config.output.path,
        exports: module === "cjs" ? "named" : undefined,
        preserveModules: true,
        preserveModulesRoot: leRoot,
        sourcemap: true,
        entryFileNames: `[name].${config.ext}`,
      };
    })
  );
};
