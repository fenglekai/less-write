import { type TaskFunction, src, dest, parallel, series } from "gulp";
import less from "gulp-less";
import path from "path";
import { leOutput } from "@less-write/build";
import postcss from "postcss";
import cssnano from "cssnano";
import { Transform } from "stream";
import type Vinly from "vinyl";
import consola from "consola";
import chalk from "chalk";

const distFolder = path.resolve(__dirname, "dist");
const distBundle = path.resolve(leOutput, "styles");

function compressWithCssnano() {
  const processor = postcss([
    cssnano({
      preset: [
        "default",
        {
          // avoid color transform
          colormin: false,
          // avoid font transform
          minifyFontValues: false,
        },
      ],
    }),
  ]);
  return new Transform({
    objectMode: true,
    transform(chunk, _encoding, callback) {
      const file = chunk as Vinly;
      if (file.isNull()) {
        callback(null, file);
        return;
      }
      if (file.isStream()) {
        callback(new Error("Streaming not supported"));
        return;
      }
      const cssString = file.contents!.toString();
      processor.process(cssString, { from: file.path }).then((result) => {
        const name = path.basename(file.path);
        file.contents = Buffer.from(result.css);
        consola.success(
          `${chalk.cyan(name)}: ${chalk.yellow(
            cssString.length / 1000
          )} KB -> ${chalk.green(result.css.length / 1000)} KB`
        );
        callback(null, file);
      });
    },
  });
}

function buildLessStyle() {
  const plugins = require("./src/plugins/index.js");
  return src("src/*.less")
    .pipe(
      less({
        plugins: [plugins],
      })
    )
    .pipe(compressWithCssnano())
    .pipe(dest(distFolder));
}

export function copyLessStyleSource() {
  return src(path.resolve(__dirname, "src/**")).pipe(
    dest(path.resolve(distBundle, "src"))
  );
}

export function copyLessStyleBundle() {
  return src(`${distFolder}/**`).pipe(dest(distBundle));
}

export const build: TaskFunction = parallel(
  copyLessStyleSource,
  series(buildLessStyle, copyLessStyleBundle)
);

export default build;
