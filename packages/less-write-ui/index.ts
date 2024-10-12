import installer from './make-installer'
export * from "@less-write/components";
export * from "@less-write/hooks";

export * from "./resolver";

export const install = installer.install
export default installer;
