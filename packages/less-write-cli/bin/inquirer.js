import inquirer from "inquirer";
import { base } from "../inquirers/index.js";

export function inquirerPrompt(argv) {
  const { name } = argv;
  return new Promise((resolve, reject) => {
    inquirer
      .prompt([
        {
          type: "input",
          name: "type",
          message: "基础模板类型",
          choices: ["基础模板", "axios拦截器"],
          filter: function (value) {
            return {
              基础模板: "base",
              axios拦截器: "axios-interceptor",
            }[value];
          },
        },
      ])
      .then((answers) => {
        const { type } = answers;
        if (type === "base") {
          base();
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export default inquirerPrompt;
