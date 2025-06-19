const chalk = require("chalk");
const { execSync } = require("child_process"); // 让脚手架能够与外部工具或命令进行交互
const fs = require("fs-extra");

// 成功信息
exports.showSuccess = (msg) => {
  console.log(chalk.green("√ " + msg));
};

// 错误信息
exports.showError = (msg) => {
  console.log(chalk.red("× " + msg));
};

// 信息消息
exports.showInfo = (msg) => {
  console.log(chalk.cyan("ℹ " + msg));
};

// 安装依赖
exports.installDependencies = async (projectPath) => {
  const spinner = ora("正在安装依赖...").start();
  try {
    process.chdir(projectPath); // 切换到指定目录
    execSync("npm install", { stdio: "inherit" }); // stdio:'inherit'让命令直接显示在控制台，不隐藏
    spinner.succeed("依赖安装完成");
  } catch (error) {
    spinner.fail("依赖安装失败");
    throw error;
  }
};

// 检查目录是否为空
exports.isDirEmpty = (path) => {
  const files = fs.readFileSync(path);
  return files.length === 0 || (files.length === 1 && files[0] === ".git");
};

exports.isNotUndefinedOrNull = (value) => {
  return value !== null && value !== undefined;
};

/**
 * 入口文件
 * @param {*} config 
 * @returns 
 */
exports.entryFileFormat = (config) => {
  const type = config.framework + '-' + config.language
  let result = 'main.js'
  switch(type){
    case 'vue-js':
      break;
    case 'vue-ts':
      result = 'main.ts'
      break;
    case 'react-js':
      result = 'main.jsx';
      break;
    case 'react-ts':
      result = 'main.tsx';
  }
  return result
}