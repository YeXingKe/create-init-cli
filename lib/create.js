const path = require("path");
const fs = require("fs-extra");
const inquirer = require("inquirer"); // 创建交互式提示
const chalk = require("chalk"); // 为文本添加颜色和样式
const ora = require("ora"); // 提供一个友好的命令行界面
const { generateFrameWork, generateLint, generateUI } = require("./generators");
const { showError, installDependencies, showSuccess,copyBaseTemplate } = require("./utils");
const collectUserConfig = require("./selectConfig");
const {saveAsTemplate} = require('./saveTemplate')

module.exports = async (projectName,options) => {
  const [nodePath,scriptPath,...args] = process.argv
  let projectPath
  const prompt = inquirer.createPromptModule();
  if(args[0] === 'init'){
      const { inputName } = await inquirer.prompt([
        {
          type: 'input',
          name: 'inputName',
          message: 'input a project name:',
          default: projectName || 'app-demo',
          suffix: '🙂',
          validate: (value) => {
              if (/^[a-zA-Z0-9-_]+$/.test(value)) {
                  return true;
              }
              return 'project name format is invalid.It must only contain uppercase and lowercase letters,numbers,hyphens,and underscores.';
          },
        },
      ])    
    // 如果处理完所有参数后仍未得到绝对路径，则会将当前工作目录（process.cwd()）作为前缀拼接
    projectPath = path.resolve(inputName);
    projectName = inputName
  }else{
    if (!/^[a-zA-Z0-9-_]+$/.test(projectName)) {
      showError("project name format is invalid.It must only contain uppercase and lowercase letters,numbers,hyphens,and underscores.");
      process.exit(1);
    }
    projectPath = path.resolve(projectName);
  }

  if (fs.existsSync(projectPath)) {
    // 检查目录是否存在
    const { overwrite } = await prompt([
      {
        type: "confirm",
        name: "overwrite",
        message: "Directory already exists.Do you want to overwrite?",
        default: false,
      },
    ]);
    // 是否重写
    if (overwrite) {
      await fs.remove(projectPath);
    } else {
      showError("operation canceled.");
      process.exit(0);
    }
  }

  await fs.ensureDir(projectPath); // 确定项目路径存在，不存在就立即创建
  try {
    const config = await collectUserConfig(); // 收集用户配置

    await copyBaseTemplate(projectPath, config); // 复制基础模板
    await generateFrameWork(projectPath, config); // 生成框架相关文件
    await generateUI(projectPath, config); // 生成UI库相关文件
    await generateLint(projectPath, config); // 生成规范工具相关文件
  //   await updatePkgJson(projectPath, projectName, config); // 更新package.json
    await saveAsTemplate(config,projectName)
 
  if(options && options.skipInstall){
    // 跳过依赖的安装
    process.exit(1);
  }else{
    const shouldInstall = await promptInstallDependencies();
    const spinner = ora("creating a project...").start();
    if (shouldInstall) {
      await installDependencies(projectPath);
    }
    spinner.succeed("project creation completed.");
  }
    showSuccess(`${chalk.bold("project created successfully!")}
        execute the following command to start the project：
        ${chalk.cyan(`cd ${projectName}`)}
        ${chalk.cyan(
          shouldInstall ? "npm run dev" : "npm install && npm run dev"
        )}
        }`);
  } catch (error) {
    showError(`creation failed：${error.message}`);
    await fs.remove(projectPath);
    process.exit(1);
  }
};

// 更新package.json
async function updatePkgJson(projectPath, projectName, config) {
  const pkgPath = path.join(projectPath, "package.json");
  const pkg = require(pkgPath);

  pkg.name = projectName;

  if (config.linters.includes("prettier")) {
    pkg.scripts.format = "prettier --write .";
  }

  await fs.writeJSON(pkgPath, pkg, { spaces: 2 });
}

// 提示安装依赖
async function promptInstallDependencies() {
  const { install } = await inquirer.prompt([
    {
      type: "confirm",
      name: "install",
      message: "Should I install the dependencies immediately?",
      default: true,
    },
  ]);
  return install;
}
