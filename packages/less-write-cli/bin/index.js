#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import inquirerPrompt from "./inquirer.js";
import { copyTemplate, checkDirExist } from "./copy.js";
import { install } from './manage.js'
import { resolve } from "path";

yargs(hideBin(process.argv)).command(
  ["create", "c"],
  "新建一个模板",
  function (yargs) {
    return yargs.option("name", {
      alias: "n",
      demand: true,
      describe: "模板名称",
      type: "string",
    });
  },
  function (argv) {
    const __dirname = import.meta.dirname;
    inquirerPrompt(argv).then((answer) => {
      const { name, type } = answer;
      const sourcePath = resolve(__dirname, `./template/${type}`);
      const copyPath = resolve(process.cwd(), `./src/pages/${name}`);
      const isExist = checkDirExist(copyPath);

      if (isExist) {
        console.error(`${name}文件夹已经存在`);
        return;
      }

      install(process.cwd(), answer).then(() => {
          copyTemplate(sourcePath + '/index.tpl', copyPath + '/index.js', { name });
      });
    });
  }
).argv;
