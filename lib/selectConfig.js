#!/usr/bin/env node
const inquirer = require("inquirer"); // 9版本下才生效，否则报错
const { isNotUndefinedOrNull } = require("./utils");
const promptConfig = [
  // {
  //     type: 'input',
  //     name: 'project_name',
  //     message: 'input a project name:',
  //     default: 'demo-project',
  //     suffix: '🙂',
  //     validate: (value) => {
  //         if (value) {
  //             return true;
  //         }
  //         return 'project name cannot be empty.';
  //     }
  // },
  {
    type: "list",
    name: "build",
    message: "select a build tool:",
    choices: [
      { value: "Vue", name: "Vite" },
      { value: "webpack", name: "Webpack" },
    ],
  },
  {
    type: "list",
    name: "build",
    message: "select a build tool:",
    choices: [
      { value: "vite", name: "Vite" },
      { value: "webpack", name: "Webpack" },
    ],
  },
  {
    type: "list",
    name: "framework",
    message: "select a frontend framework:",
    choices: (answer) => {
      if (answer.build === "vite") {
        return [
          { value: "vue", name: "Vue" },
          { value: "react", name: "React" },
        ];
      } else {
        return [
          { value: "vue", name: "Vue" },
          { value: "react", name: "React" },
          { value: "angular", name: "Angular" },
        ];
      }
    },
    when: (answer) => isNotUndefinedOrNull(answer.build),
  },
  {
    type: "list",
    name: "language",
    message: "select a develop language:",
    choices: (answer) => {
      if (answer.framework === "angular") {
        return [{ value: "ts", name: "TypeScript" }];
      } else {
        return [
          { value: "js", name: "JavaScript" },
          { value: "ts", name: "TypeScript" },
        ];
      }
    },
    when: (answer) => isNotUndefinedOrNull(answer.framework),
  },
  {
    type: "list",
    name: "style",
    message: "select a style plugin:",
    choices: (answer) => {
      if (answer.framework === "angular") {
        return [
          { value: "less", name: "less" },
          { value: "none", name: "none" },
        ];
      } else {
        return [
          { value: "scss", name: "scss" },
          { value: "less", name: "less" },
          { value: "css", name: "css" },
          { value: "none", name: "none" },
        ];
      }
    },
    when: (answer) => isNotUndefinedOrNull(answer.language),
  },
  {
    type: "list",
    name: "ui",
    message: "select a ui library:",
    choices: (answer) => {
      if (answer.framework === "vue") {
        return [
          { value: "element", name: "ElementPlus" },
          { value: "antdv", name: "Ant-Design-Vue" },
          { value: "none", name: "none" },
        ];
      } else if (answer.framework === "react") {
        return [
          { value: "antdr", name: "Ant-Design-React" },
          { value: "mui", name: "Material UI" },
          { value: "none", name: "none" },
        ];
      } else {
        return [
          { value: "ng", name: "NG-ZORRO" },
          { value: "none", name: "none" },
        ];
      }
    },
    when: (answer) => isNotUndefinedOrNull(answer.style),
  },
  {
    type: "checkbox",
    name: "linters",
    message: "select code lint tool:",
    choices: [
      { value: "eslint", name: "Eslint" },
      { value: "prettier", name: "Prettier" },
      { value: "style", name: "Stylelint" },
      { value: "commit", name: "Commitlint" },
      { value: "none", name: "none" },
    ],
    when: (answer) => isNotUndefinedOrNull(answer.ui),
  },
];
module.exports = () =>
  new Promise((resolve, reject) =>
    inquirer
      .prompt(promptConfig)
      .then((answer) => resolve(answer))
      .catch((error) => reject(error))
  );
