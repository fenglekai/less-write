import { parallel, series } from "gulp";
import {
  run,
  runTask,
  withTaskName,
  leOutput,
  projRoot,
  lePackage,
  buildOutput,
  buildConfig,
} from "./src";
import { copyFile, mkdir } from "fs/promises";
import path from "path";
import type { TaskFunction } from "gulp";
import type { Module } from "./src";
import { copy } from "fs-extra";

export const copyFiles = () =>
  Promise.all([
    copyFile(lePackage, path.join(leOutput, "package.json")),
    copyFile(
      path.resolve(projRoot, "README.md"),
      path.resolve(leOutput, "README.md")
    ),
  ]);

export const copyFullStyle = async () => {
  await mkdir(path.resolve(leOutput, "dist"), { recursive: true });
  await copyFile(
    path.resolve(leOutput, "styles/index.css"),
    path.resolve(leOutput, "dist/index.css")
  );
};

export const copyTypesDefinitions: TaskFunction = (done) => {
  const src = path.resolve(buildOutput, "types", "packages");
  const copyTypes = (module: Module) =>
    withTaskName(`copyTypes:${module}`, () =>
      copy(src, buildConfig[module].output.path)
    );

  return parallel(copyTypes("esm"), copyTypes("cjs"))(done);
};

export default series(
  withTaskName("clean", () => run("pnpm run clean")),
  withTaskName("createOutput", () => mkdir(leOutput, { recursive: true })),

  parallel(
    runTask("buildModules"),
    runTask("buildFullBundle"),
    runTask("generateTypesDefinitions"),
    series(
      withTaskName("buildLessStyle", () =>
        run("pnpm run -C packages/styles build")
      ),
      copyFullStyle
    )
  ),

  parallel(copyTypesDefinitions, copyFiles)
) as TaskFunction;

export * from "./src";
