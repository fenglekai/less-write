import { rollup } from "rollup";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import VueMacros from "unplugin-vue-macros/rollup";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import esbuild from "rollup-plugin-esbuild";
import glob from "fast-glob";
import {
  excludeFiles,
  generateExternal,
  leRoot,
  pkgRoot,
  writeBundles,
} from "../utils";

import type { OutputOptions } from "rollup";
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
  console.log("input: ", input);

  const bundle = await rollup({
    input,
    plugins: [
      // ElementPlusAlias(),
      // VueMacros({
      //   setupComponent: false,
      //   setupSFC: false,
      //   plugins: {
      //     vue: vue({
      //       isProduction: true,
      //     }),
      //     vueJsx: vueJsx(),
      //   },
      // }),
      {
        name: "vue-macros",
        ...VueMacros({
          setupComponent: false,
          setupSFC: false,
          plugins: {
            vue: vue({
              isProduction: true,
            }),
            vueJsx: vueJsx(),
          },
        }),
      },
      nodeResolve({
        extensions: [".mjs", ".js", ".json", ".ts"],
      }),
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
