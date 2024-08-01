import { version } from "../../../packages/less-write-ui/version";

export const PKG_PREFIX = "@less-write";
export const PKG_NAME = "less-write";
export const PKG_BRAND_NAME = "Less Write";
export const PKG_CAMELCASE_NAME = "LessWrite";

export const target = "esnext";

export const banner = `/*! ${PKG_BRAND_NAME} v${version} */\n`;

export const NODE_ENV = JSON.stringify("production");

export const INSTALLED_KEY = Symbol("INSTALLED_KEY");
