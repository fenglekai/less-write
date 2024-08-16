import inquirer from "inquirer";

export const lessWriteUI = (type) => {
  return new Promise(async (resolve, reject) => {
    const component = await inquirer.prompt([
      {
        type: "list",
        name: "component",
        message: "选择组件",
        choices: [
          // {
          //   name: "button",
          // },
          {
            name: "map",
          },
        ],
      },
      {
        type: "confirm",
        name: "isResolver",
        message: "是否使用了resolver",
        default: false,
      },
      {
        type: "input",
        name: "componentPath",
        message: "安装目录",
        default: (answer) => {
          const { component } = answer;
          return `./src/${type}/${component}`;
        },
      },
    ]);
    resolve(component);
  });
};

export default lessWriteUI;
