#!/usr/bin/env node

// const commander = require('commander');
const commander = require("commander");
const pkg = require("../package.json");
const createProject = require("../lib/create");

const program = new commander.Command();
// program
// .name(Object.keys(pkg.bin)[0]) // 设置程序的名称
// .usage('<command> [options]') // 提示用户如何使用这个命令行工具
// .version(pkg.version) // 设置了命令行工具的版本号

program
  .command("create <project-name>")
  .description("创建新项目")
  .action((projectName) => {
    console.log(projectName);
    createProject(projectName);
  });
// program.command('install <dependencies...>','install dependencies')

// 处理无命令执行的情况
if (process.argv.length === 2) {
  // process.argv是一个数组
  // ['D:\\develop\\nvm\\nodejs\\node.exe',
  // 'D:\\develop\\nvm\\node_global\\node_modules\\create-template-cli\\bin\\index.js']
  program.help();
}

program.parse(process.argv);
