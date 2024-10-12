import { findWorkspacePackages } from "@pnpm/find-workspace-packages";
import type { ProjectManifest } from "@pnpm/types";
import { PKG_NAME, PKG_PREFIX } from "../constants";
import { buildConfig } from "../build-info";
import type { Module } from "../build-info";
import { projRoot } from "./paths";
import consola from "consola";

export const getPackageManifest = (pkgPath: string) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require(pkgPath) as ProjectManifest;
};

export const getPackageDependencies = (
  pkgPath: string
): Record<"dependencies" | "peerDependencies", string[]> => {
  const manifest = getPackageManifest(pkgPath);
  const { dependencies = {}, peerDependencies = {} } = manifest;

  return {
    dependencies: Object.keys(dependencies),
    peerDependencies: Object.keys(peerDependencies),
  };
};

export const excludeFiles = (files: string[]) => {
  const excludes = [
    "node_modules",
    "test",
    "mock",
    "gulpfile",
    "dist",
    "less-write-cli",
    'styles/src/plugins'
  ];
  return files.filter(
    (path) => !excludes.some((exclude) => path.includes(exclude))
  );
};

/** used for type generator */
export const pathRewriter = (module: Module) => {
  const config = buildConfig[module];

  return (id: string) => {
    id = id.replaceAll(`${PKG_PREFIX}/styles`, `${PKG_NAME}/styles`);
    id = id.replaceAll(`${PKG_PREFIX}/`, `${config.bundle.path}/`);
    return id;
  };
};

export const getWorkspacePackages = () => findWorkspacePackages(projRoot);

export function errorAndExit(err: Error): never {
  consola.error(err);
  process.exit(1);
}
