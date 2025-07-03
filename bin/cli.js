#!/usr/bin/env node

// const commander = require('commander');
const commander = require('commander')
const pkg = require('../package.json')
const chalk = require('chalk')
const createProject = require('../lib/create')
const templates = require('../lib/templates/git-repo-temp.json')

const program = new commander.Command()
const TemplateManager = require('../lib/generators/defaultTemplate/TemplateManager')
const TemplateSelector = require('../lib/generators/defaultTemplate/TemplateSelector')
const TemplatePreview = require('../lib/generators/defaultTemplate/TemplatePreview')

// program
// .name(Object.keys(pkg.bin)[0]) // 设置程序的名称
// .usage('<command> [options]') // 提示用户如何使用这个命令行工具
// .version(pkg.version) // 设置了命令行工具的版本号

async function executeFun(options,projectName=null){
  try {
    // 初始化模板系统
    const templateManager = new TemplateManager()
    const templateSelector = new TemplateSelector(templates)
    const templatePreview = new TemplatePreview(templateManager)
    // 步骤1: 选择模板
    const templateName = await templateSelector.selectTemplate()
    if (templateName === 'custom') {
      // 自定义模板
      createProject(projectName, options)
    }
    // // 步骤2: 预览模板
    // const confirmed = await templatePreview.showPreview(templateName)
    // if (!confirmed) {
    //   console.log(chalk.yellow('create project canceled!'))
    //   process.exit(0)
    // }
  } catch (error) {
    console.error(chalk.red(`\n✖ create project failed: ${error.message}\n`))
    process.exit(1)
  }
}

// 必填项目名
program
  .command('create <project-name>')
  .description('creat new project')
  .option('--skip-install', 'skip dependences install')
  .action(async (projectName, options) => {
    await executeFun(options,projectName)
  })
// 可选项目名
program.command('init [project-name]').description('creat new project')
.option('--skip-install', 'skip dependences install').action(async (projectName,options) => {
  await executeFun(options,projectName)
})

// 处理无命令执行的情况
if (process.argv.length === 2) {
//  ['node路径','脚本命令路径',...args]=process.argv
  program.help()
}

program.parse(process.argv)
