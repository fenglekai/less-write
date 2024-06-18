import { parallel, series } from "gulp";
import { run, runTask, withTaskName, leOutput } from "./src";
import { copyFile, mkdir } from "fs/promises";
export default series(
  withTaskName("clean", () => run("pnpm run clean")),
  withTaskName("createOutput", () => mkdir(leOutput, { recursive: true })),

  parallel(
    // runTask('buildModules'),
    runTask('buildFullBundle'),
  )
);

export * from './src'