import copyDir from "copy-dir";
import { mkdirSync, existsSync, readFileSync, writeFileSync } from "fs";
import { dirname, extname } from "path";
import Mustache from "mustache";

function mkdirGuard(target) {
  try {
    mkdirSync(target, { recursive: true });
  } catch (error) {
    deep(target);
    function deep(dir) {
      if (existsSync(dir)) return true;
      const name = dirname(dir);
      mkdirp(name);
      mkdirSync(dir);
    }
  }
}

export function checkDirExist(path) {
  return existsSync(path);
}

export function copy(from, to, options) {
  mkdirGuard(to);
  copyDir.sync(from, to, options);
}

export function copyFile(from, to) {
  const buffer = readFileSync(from);
  const parentPath = dirname(to);

  mkdirGuard(parentPath);

  writeFileSync(to, buffer);
}

function readTemplate(path, data = {}) {
  const str = readFileSync(path, { encoding: "utf8" });
  return Mustache.render(str, data);
}

export function copyTemplate(from, to, data = {}) {
  if (extname(from) !== ".tpl") {
    const index = from.replace('.tpl', '.js')
    return copyFile(index, to);
  }
  const parentToPath = dirname(to);
  mkdirGuard(parentToPath);
  writeFileSync(to, readTemplate(from, data));
}

export default {
  checkDirExist,
  copy,
  copyFile,
  copyTemplate,
};
