import type MarkdownIt from "markdown-it";
import mdContainer from "markdown-it-container";
import path from "path";
import fs from "fs";
import { docRoot } from "@less-write/build";
import type Token from "markdown-it/lib/token.mjs";
import type Renderer from "markdown-it";
import type { Plugin } from "vitepress";
import glob from "fast-glob";

interface ContainerOpts {
  marker?: string | undefined;
  validate?(params: string): boolean;
  render?(
    tokens: Token[],
    index: number,
    options: any,
    env: any,
    self: Renderer
  ): string;
}

export const mdPlugin = (md: MarkdownIt) => {
  md.use(mdContainer, "demo", {
    validate(params) {
      return !!params.trim().match(/^demo\s*(.*)$/);
    },

    render(tokens, idx) {
      const m = tokens[idx].info.trim().match(/^demo\s*(.*)$/);
      if (tokens[idx].nesting === 1 /* means the tag is opening */) {
        const description = m && m.length > 1 ? m[1] : "";
        const sourceFileToken = tokens[idx + 2];
        let source = "";
        const sourceFile = sourceFileToken.children?.[0].content ?? "";

        if (sourceFileToken.type === "inline") {
          source = fs.readFileSync(
            path.resolve(docRoot, "examples", `${sourceFile}.vue`),
            "utf-8"
          );
        }
        if (!source) throw new Error(`Incorrect source file: ${sourceFile}`);

        return `<Demo :demos="demos" source="${encodeURIComponent(
          md.render(`\`\`\` vue\n${source}\`\`\``)
        )}" path="${sourceFile}" raw-source="${encodeURIComponent(
          source
        )}" description="${encodeURIComponent(md.render(description))}">`;
      } else {
        return "</Demo>";
      }
    },
  } as ContainerOpts);
};

type Append = Record<"headers" | "footers" | "scriptSetups", string[]>;
let compPaths: string[];
export function MarkdownTransform(): Plugin {
  return {
    name: "less-write-md-transform",

    enforce: "pre",

    async buildStart() {
      const pattern = fs.readdirSync(path.resolve(docRoot, "component"));

      compPaths = await glob(pattern, {
        cwd: docRoot,
        absolute: true,
        onlyDirectories: true,
      });
    },

    async transform(code, id) {
      if (!id.endsWith(".md")) return;
      if (!id.includes(`${docRoot}/component`)) return;

      const componentId = path.basename(id, ".md");
      const append: Append = {
        headers: [],
        footers: [],
        scriptSetups: [
          `const demos = import.meta.glob('../examples/${componentId}/*.vue', { eager: true })`,
        ],
      };

      code = transformVpScriptSetup(code, append);

      return combineMarkdown(
        code,
        [combineScriptSetup(append.scriptSetups), ...append.headers],
        append.footers
      );
    },
  };
}

const vpScriptSetupRE =
  /<vp-script\s(.*\s)?setup(\s.*)?>([\s\S]*)<\/vp-script>/;
const transformVpScriptSetup = (code: string, append: Append) => {
  const matches = code.match(vpScriptSetupRE);
  if (matches) code = code.replace(matches[0], "");
  const scriptSetup = matches?.[3] ?? "";
  if (scriptSetup) append.scriptSetups.push(scriptSetup);
  return code;
};

const combineMarkdown = (
  code: string,
  headers: string[],
  footers: string[]
) => {
  const frontmatterEnds = code.indexOf("---\n\n");
  const firstHeader = code.search(/\n#{1,6}\s.+/);
  const sliceIndex =
    firstHeader < 0
      ? frontmatterEnds < 0
        ? 0
        : frontmatterEnds + 4
      : firstHeader;

  if (headers.length > 0)
    code =
      code.slice(0, sliceIndex) + headers.join("\n") + code.slice(sliceIndex);
  code += footers.join("\n");

  return `${code}\n`;
};

const combineScriptSetup = (codes: string[]) =>
  `\n<script setup>
${codes.join("\n")}
</script>
`;
