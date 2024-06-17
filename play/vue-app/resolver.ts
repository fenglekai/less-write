import type { ComponentResolver } from "unplugin-vue-components";

function kebabCase(key: string) {
  const result = key.replace(/([A-Z])/g, " $1").trim();
  return result.split(" ").join("-").toLowerCase();
}

function getSideEffects(dirName: string) {
  const styleFolder = "@less-write/styles";
  return [`${styleFolder}/src/base.less`, `${styleFolder}/src/${dirName}.less`];
}

function resolveComponent(name: string) {
  if (!name.match(/^Le[A-Z]/)) return;
  
  const partialName = kebabCase(name.slice(2));
  return {
    name,
    from: `less-write-ui`,
    sideEffects: getSideEffects(partialName),
  };
}

export function LessWriteResolver(): ComponentResolver[] {
  return [
    {
      type: "component",
      resolve: (name: string) => resolveComponent(name),
    },
  ];
}

export default { LessWriteResolver };
