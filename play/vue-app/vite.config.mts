import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import Components from "unplugin-vue-components/vite";
import { LessWriteResolver } from "../../packages/less-write-ui/resolver";

const projRoot = resolve(__dirname, "..", "..");
const pkgRoot = resolve(projRoot, "packages");
const leRoot = resolve(pkgRoot, "less-write-ui");

export default defineConfig({
  resolve: {
    alias: [
      {
        find: /^less-write-ui(\/(es|lib))?$/,
        replacement: resolve(leRoot, "index.ts"),
      },
      {
        find: /^less-write-ui\/(es|lib)\/(.*)$/,
        replacement: `${pkgRoot}/$2`,
      },
    ],
  },
  plugins: [
    vue(),
    Components({
      include: `${__dirname}/**`,
      resolvers: [LessWriteResolver({ importStyle: "less" })],
      dts: false,
    }),
  ],
});
