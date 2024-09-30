import type MarkdownIt from "markdown-it";
import mdContainer from "markdown-it-container";
import path from "path";
import fs from "fs";
import { docRoot } from "@less-write/build";
import type Token from 'markdown-it/lib/token.mjs'
import type Renderer from 'markdown-it'

interface ContainerOpts {
  marker?: string | undefined
  validate?(params: string): boolean
  render?(
    tokens: Token[],
    index: number,
    options: any,
    env: any,
    self: Renderer
  ): string
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
