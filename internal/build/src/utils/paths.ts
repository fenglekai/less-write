import { resolve } from "path";

export const projRoot = resolve(__dirname, "..", "..", "..", "..");
export const pkgRoot = resolve(projRoot, 'packages')
export const leRoot = resolve(projRoot, "packages", "less-write-ui");
export const buildRoot = resolve(projRoot, "internal", "build");

// Docs
export const docsDirName = 'docs'
export const docRoot = resolve(projRoot, docsDirName)
export const vpRoot = resolve(docRoot, '.vitepress')

/** `/dist` */
export const buildOutput = resolve(projRoot, "dist");
/** `/dist/less-write-ui` */
export const leOutput = resolve(buildOutput, "less-write-ui");

export const lePackage = resolve(leRoot, "package.json");
export const docPackage = resolve(docRoot, "package.json");
