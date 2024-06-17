import type { Plugin } from "rollup";
import { PKG_NAME, PKG_PREFIX } from "../constants";

export function LessWriteAlias(): Plugin {
  const styles = "styles";
  const sourceThemeChalk = `${PKG_PREFIX}/${styles}`;
  const bundleThemeChalk = `${PKG_NAME}/${styles}`;

  return {
    name: "less-write-alias-plugin",
    resolveId(id) {
      if (!id.startsWith(sourceThemeChalk)) return;
      return {
        id: id.replaceAll(sourceThemeChalk, bundleThemeChalk),
        external: "absolute",
      };
    },
  };
}
