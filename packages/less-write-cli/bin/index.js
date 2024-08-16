import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import inquirerPrompt from "./inquirer.js";
import { copyTemplate, checkDirExist } from "./copy.js";
import { install } from "./manage.js";
import { resolve } from "path";

yargs(hideBin(process.argv))
  .version("version", "显示帮助信息", "v")
  .help("help", "显示版本号", "h")
  .command(
    "*",
    "准备启动CLI",
    // (yargs) => {
    //   return yargs.options({
    //     help: {
    //       description: "显示帮助信息",
    //       boolean: true,
    //       required: false,
    //       alias: "h",
    //     },
    //     version: {
    //       description: "显示版本号",
    //       boolean: true,
    //       required: false,
    //       alias: "v",
    //     },
    //   });
    // },
    (argv) => {
      const __dirname = import.meta.dirname;
      inquirerPrompt(argv)
        .then((answer) => {
          const { type, component, isResolver, componentPath } = answer;

          if (type === "less-write-ui") {
            let sourceFile = "index.vue";
            const sourcePath = resolve(
              __dirname,
              `../template/${type}/${component}`
            );
            const copyPath = resolve(
              process.cwd(),
              `${componentPath}`
            );
            const isExist = checkDirExist(copyPath);

            if (isExist) {
              console.error(`${component}组件已经存在`);
              return;
            }

            if (isResolver) {
              sourceFile = "resolver.vue";
            }

            copyTemplate(
              sourcePath + `/${sourceFile}`,
              copyPath + "/index.vue",
            );
          }

          if (type === "axios-interceptor") {
            
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  )
  // .command(
  //   ["create", "c"],
  //   "创建模板",
  //   function (yargs) {
  //     return yargs.option("name", {
  //       describe: "模板名称",
  //       type: "string",
  //       demand: true,
  //       alias: "n",
  //     });
  //   },
  //   function (argv) {
  //     const __dirname = import.meta.dirname;
  //     inquirerPrompt(argv).then((answer) => {
  //       const { name, type } = answer;
  //       const sourcePath = resolve(__dirname, `./template/${type}`);
  //       const copyPath = resolve(process.cwd(), `./src/less-write/${name}`);
  //       const isExist = checkDirExist(copyPath);

  //       if (isExist) {
  //         console.error(`${name}文件已经存在`);
  //         return;
  //       }

  //       // install(process.cwd(), answer).then(() => {
  //       //     copyTemplate(sourcePath + '/index.tpl', copyPath + '/index.js', { name });
  //       // });
  //       copyTemplate(sourcePath + "/index.tpl", copyPath + "/index.js", { name });
  //     });
  //   }
  // )
  .parse();
