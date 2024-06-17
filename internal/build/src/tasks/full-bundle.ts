import path from "path";
import { parallel } from "gulp";
import { rollup } from "rollup";
import type { Plugin } from "rollup";
import replace from "@rollup/plugin-replace";
import commonjs from "@rollup/plugin-commonjs";
import esbuild, { minify as minifyPlugin } from "rollup-plugin-esbuild";
import vuePlugin from "rollup-plugin-vue";
import {
  formatBundleFilename,
  generateExternal,
  leOutput,
  leRoot,
  withTaskName,
  writeBundles,
} from "../utils";
import { banner, NODE_ENV, PKG_CAMELCASE_NAME, target } from "../constants";

async function buildFullEntry(minify: boolean) {
  const plugins: Plugin[] = [
    // ElementPlusAlias(),
    vuePlugin({
      include: /\.vue$/,
      target: "browser",
    }) as Plugin,
    commonjs(),
    esbuild({
      exclude: [],
      sourceMap: minify,
      target,
      loaders: {
        ".vue": "ts",
      },
      define: {
        "process.env.NODE_ENV": NODE_ENV,
      },
      treeShaking: true,
      legalComments: "eof",
    }),
    replace({
      preventAssignment: true,
      "process.env.NODE_ENV": NODE_ENV,
    }),
  ];
  if (minify) {
    plugins.push(
      minifyPlugin({
        target,
        sourceMap: true,
      })
    );
  }

  const bundle = await rollup({
    input: path.resolve(leRoot, "index.ts"),
    plugins,
    external: await generateExternal({ full: true }),
    treeshake: true,
  });
  await writeBundles(bundle, [
    {
      format: "umd",
      file: path.resolve(
        leOutput,
        "dist",
        formatBundleFilename("index.full", minify, "js")
      ),
      exports: "named",
      name: PKG_CAMELCASE_NAME,
      globals: {
        vue: "Vue",
      },
      sourcemap: minify,
      banner,
    },
    {
      format: "esm",
      file: path.resolve(
        leOutput,
        "dist",
        formatBundleFilename("index.full", minify, "mjs")
      ),
      sourcemap: minify,
      banner,
    },
  ]);
}

export const buildFullBundle = parallel(
  withTaskName("buildFullMinified", () => buildFullEntry(true)),
  withTaskName("buildFull", () => buildFullEntry(false))
);
