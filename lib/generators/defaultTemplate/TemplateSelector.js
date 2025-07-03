const inquirer = require('inquirer');
const chalk = require('chalk');

class TemplateSelector {
  constructor(templates) {
    this.templates = templates;
  }

  // 创建交互式选择界面
  async selectTemplate() {
    const choices = Object.entries(this.templates).map(([key, tpl]) => ({
      name: `${chalk.bold(tpl.name)} - ${chalk.gray(tpl.description)}`,
      value: key,
      short: tpl.name
    }));

    // 添加搜索功能
    choices.unshift(new inquirer.Separator());
    if(choices.length>10){
      choices.unshift({
        name: '🔍 search template',
        value: 'search'
      });
    }
    choices.push({
        name: 'Customizable',
        value: 'custom'
    });

    const { template } = await inquirer.prompt([
      {
        type: 'list',
        name: 'template',
        message: 'select project template',
        choices,
        pageSize: 10
      }
    ]);

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