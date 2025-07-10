const inquirer = require('inquirer');
const chalk = require('chalk');
const { pathUtils,isFileOrDir,copyBaseTemplate } = require('../../utils')
const fs = require('fs')
const path = require('path')
const { generateFrameWork, generateLint, generateUI } = require("../../generators");

class TemplateSelector {
  constructor(templates) {
    this.templates = templates;
  }

  getLocalTemplate(){
    const localPath = pathUtils.cachePath
    let localTpl = {}
    return new Promise((resolve, reject) => {
      fs.readdir(localPath, (err, files) => {
        if (err) {
          console.error('read directory error:', err);
          reject(err);
        }

        if(!files){
          reject('no file')
        }
        const jsonFiles = files.filter(file=>isFileOrDir(path.join(localPath,file)) === 'file' && path.extname(file) === '.json')
        jsonFiles.forEach(file=>{
          const fileName = file.split('.')[0]
          const filePath = path.join(localPath,file)
          const data = fs.readFileSync(filePath,'utf8');
          localTpl[fileName] = JSON.parse(data)
        })
        resolve(localTpl)
      })
    })
  }

  // 创建交互式选择界面
  async selectTemplate() {
    const choices = Object.entries(this.templates).map(([key, tpl]) => ({
      name: `${chalk.bold(tpl.name)} - ${chalk.gray(tpl.description)}`,
      value: key,
      short: tpl.name
    }));
    choices.push({
      name: 'Customizable',
      value: 'custom'
    });
    const localTemplates = await this.getLocalTemplate()
    if(localTemplates){
      Object.entries(localTemplates).forEach(([key,tpl])=>{
        choices.push({
          name: key,
          value: key
        });
      })
    }
    // 添加搜索功能
    if(choices.length>10){
      choices.unshift(new inquirer.Separator());// 分割线
      choices.unshift({
        name: '🔍 search template',
        value: 'search'
      });
    }
    const { template } = await inquirer.prompt([
      {
        type: 'list',
        name: 'template',
        message: 'select project template',
        choices,
        pageSize: 10
      }
    ]);
    if(localTemplates && localTemplates[template]){
      const config = localTemplates[template];
      const projectPath = path.resolve(template);
      await copyBaseTemplate(projectPath, config); // 复制基础模板
      await generateFrameWork(projectPath, config); // 生成框架相关文件
      await generateUI(projectPath, config); // 生成UI库相关文件
      await generateLint(projectPath, config); // 生成规范工具相关文件
    }
    if (template === 'search') {
      return this.searchTemplate();
    }

    return template;
  }

  // 模板搜索功能
  async searchTemplate() {
    const { keyword } = await inquirer.prompt([
      {
        type: 'input',
        name: 'keyword',
        message: 'input search keyword:'
      }
    ]);

    const filtered = Object.entries(this.templates).filter(([key, tpl]) => {
      const searchText = `${tpl.name} ${tpl.description} ${tpl.tags.join(' ')}`.toLowerCase();
      return searchText.includes(keyword.toLowerCase());
    });

    if (filtered.length === 0) {
      console.log(chalk.red(`\nnot found "${keyword}" template\n`));
      return this.selectTemplate();
    }

    const choices = filtered.map(([key, tpl]) => ({
      name: `${chalk.bold(tpl.name)} - ${chalk.gray(tpl.description)}`,
      value: key,
      short: tpl.name
    }));

    const { template } = await inquirer.prompt([
      {
        type: 'list',
        name: 'template',
        message: 'search result:',
        choices,
        pageSize: 10
      }
    ]);
    return template;
  }
}

module.exports = TemplateSelector;