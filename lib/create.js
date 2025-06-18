const path = require("path");
const fs = require("fs-extra");
const inquirer = require("inquirer"); // 创建交互式提示
const chalk = require("chalk"); // 为文本添加颜色和样式
const ora = require("ora"); // 提供一个友好的命令行界面
const { generateFrameWork, generateLint, generateUI } = require("./generators");
const { showError, installDependencies, showSuccess } = require("./utils");
const collectUserConfig = require("./selectConfig");

module.exports = async (projectName) => {
  if (!/^[a-zA-Z0-9-_]+$/.test(projectName)) {
    showError("项目名称只能包含小写字母、数字、连字符、下划线");
    process.exit(1);
  }
  const projectPath = path.resolve(projectName);

  if (fs.existsSync(projectPath)) {
    // 检查目录是否存在
    const prompt = inquirer.createPromptModule();
    const { overwrite } = await prompt([
      {
        type: "confirm",
        name: "overwrite",
        message: "目录已存在，是否覆盖",
        default: false,
      },
    ]);
    // 是否重写
    if (overwrite) {
      await fs.remove(projectPath);
    } else {
      showError("操作取消");
      process.exit(0);
    }
  }

  await fs.ensureDir(projectPath); // 确定项目路径存在，不存在就立即创建
  try {
    const config = await collectUserConfig(); // 收集用户配置
    const spinner = ora("正在创建项目...").start();

    await copyBaseTemplate(projectPath, config); // 复制基础模板
    await generateFrameWork(projectPath, config); // 生成框架相关文件
    await generateUI(projectPath, config); // 生成UI库相关文件
    await generateLint(projectPath, config); // 生成规范工具相关文件
    await updatePkgJson(projectPath, projectName, config); // 更新package.json

    spinner.succeed("项目创建完成");
    const shouldInstall = await promptInstallDependencies();
    if (shouldInstall) {
      await installDependencies(projectPath);
    }
    showSuccess(`${chalk.bold("项目创建成功！")}
        执行下列命令启动项目：
        ${chalk.cyan(`cd ${projectName}`)}
        ${chalk.cyan(
          shouldInstall ? "npm run dev" : "npm install && npm run dev"
        )}
        }`);
  } catch (error) {
    showError(`创建失败：${error.message}`);
    await fs.remove(projectPath);
    process.exit(1);
  }
};

async function copyBaseTemplate(projectPath) {
  const baseTemplatePath = path.join(__dirname, "templates", "base");
  await fs.copy(baseTemplatePath, projectPath);
}

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
      message: "是否立即安装依赖",
      default: true,
    },
  ]);
  return install;
}
