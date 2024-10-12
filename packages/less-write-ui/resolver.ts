import type {
  ComponentResolver,
  ComponentInfo,
  SideEffectsInfo,
} from "unplugin-vue-components";

export interface LessWriteResolverOptions {
  /**
   * import style css or sass with components
   *
   * @default 'css'
   */
  importStyle?: boolean | "less" | "css";

  /**
   * use commonjs lib & source css or scss for ssr
   */
  ssr?: boolean;

  /**
   * exclude component name, if match do not resolve the name
   */
  exclude?: RegExp;

  /**
   * a list of component names that have no styles, so resolving their styles file should be prevented
   */
  noStylesComponents?: string[];
}

function kebabCase(key: string) {
  const result = key.replace(/([A-Z])/g, " $1").trim();
  return result.split(" ").join("-").toLowerCase();
}

function getSideEffects(
  dirName: string,
  options: LessWriteResolverOptions
): SideEffectsInfo | undefined {
  const { importStyle, ssr } = options;
  const styleFolder = "@less-write/styles";
  const esComponentsFolder = "less-write-ui/es/components";

  if (importStyle === "less") {
    return ssr
      ? [`${styleFolder}/src/base.less`, `${styleFolder}/src/${dirName}.less`]
      : [
          `${esComponentsFolder}/base/style/index`,
          `${esComponentsFolder}/${dirName}/style/index`,
        ];
  }
  if (importStyle === true || importStyle === "css") {
    return ssr
      ? [`${styleFolder}/base.css`, `${styleFolder}/${dirName}.css`]
      : [
          `${esComponentsFolder}/base/style/css`,
          `${esComponentsFolder}/${dirName}/style/css`,
        ];
  }
}

function resolveComponent(
  name: string,
  options: LessWriteResolverOptions
): ComponentInfo | undefined {
  if (options.exclude && name.match(options.exclude)) return;

  if (!name.match(/^Le[A-Z]/)) return;

  const partialName = kebabCase(name.slice(2));
  return {
    name,
    from: `less-write-ui`,
    sideEffects: getSideEffects(partialName, options),
  };
}

const noStylesComponents: string[] = [];

export function LessWriteResolver(
  options: LessWriteResolverOptions = {}
): ComponentResolver[] {
  function resolveOptions(): LessWriteResolverOptions & {
    noStylesComponents: string[];
  } {
    return {
      ssr: false,
      exclude: undefined,
      importStyle: "css",
      noStylesComponents: options.noStylesComponents || [],
      ...options,
    };
  }

  return [
    {
      type: "component",
      resolve: (name: string) => {
        const options = resolveOptions();
        if (
          [...options.noStylesComponents, ...noStylesComponents].includes(name)
        )
          return resolveComponent(name, { ...options, importStyle: false });
        else return resolveComponent(name, options);
      },
    },
  ];
}

export default { LessWriteResolver };
