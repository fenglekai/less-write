import { resolve } from "path";

export const projRoot = resolve(__dirname, "..", "..", "..", "..");
export const pkgRoot = resolve(projRoot, 'packages')
export const leRoot = resolve(projRoot, "packages", "less-write-ui");
export const buildRoot = resolve(projRoot, "internal", "build");

/** `/dist` */
export const buildOutput = resolve(projRoot, "dist");
/** `/dist/less-write` */
export const leOutput = resolve(buildOutput, "less-write");

export const lePackage = resolve(leRoot, "package.json");
