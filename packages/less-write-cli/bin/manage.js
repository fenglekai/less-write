import path from "path";
import { exec } from "child_process";
import ora from "ora";

const LibraryMap = {
  "Ant Design": "antd",
  "Ant Design Vue": "ant-design-vue",
  "Element Plus": "element-plus",
  "Arco Design Vue": "@arco-design/web-vue",
};

export function install(cmdPath, options) {
  const { frame, library } = options;
  const command = `pnpm add ${frame} && pnpm add ${LibraryMap[library]}`;
  return new Promise(function (resolve, reject) {
    const spinner = ora();
    spinner.start(`正在安装依赖，请稍等`);
    exec(
      command,
      {
        cwd: path.resolve(cmdPath),
      },
      function (error, stdout, stderr) {
        if (error) {
            reject();
              spinner.fail(`依赖安装失败`);
            return;
        }
        spinner.succeed(`依赖安装成功`);
        resolve();
      }
    );
  });
}

export default install;
