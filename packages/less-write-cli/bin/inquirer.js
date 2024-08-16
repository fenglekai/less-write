import inquirer from "inquirer";
import { base, lessWriteUI } from "../inquirers/index.js";

export function inquirerPrompt(argv) {
  // const { name } = argv;
  return new Promise(async (resolve, reject) => {
    const answers = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'isTypescript',
        message: '是否使用Typescript',
        default: false
      },
      {
        type: "list",
        name: "type",
        message: "选择基础类型",
        choices: [
          {
            name: "less-write-ui",
          },
          // {
          //   name: "axios拦截器",
          // },
        ],
        filter: function (value) {
          return {
            "less-write-ui": "less-write-ui",
            axios拦截器: "axios-interceptor",
          }[value];
        },
      },
    ]);
    const { type } = answers;
    let choiceAnswer;
    try {
      // if (type === "base") {
      //   choiceAnswer = await base();
      // }
      if (type === "less-write-ui") {
        choiceAnswer = await lessWriteUI(type);
      }
      if (type === "axios-interceptor") {
        // choiceAnswer = await lessWriteUI();
      }
    } catch (error) {
      reject(error);
    }
    resolve({ ...answers, ...choiceAnswer });
  });
}

export default inquirerPrompt;
