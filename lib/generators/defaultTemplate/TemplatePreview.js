const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const inquirer = require('inquirer');

class TemplatePreview {
    constructor(templateManager) {
      this.templateManager = templateManager;
    }
  
    async showPreview(templateName) {
      const templatePath = await this.templateManager.downloadTemplate(templateName);
      const metaPath = path.join(templatePath, 'meta.json');
      
      if (!fs.existsSync(metaPath)) {
        console.log(chalk.yellow('该模板未提供预览信息'));
        // return false;
      }else{
        const meta = require(metaPath);
      
        // 显示预览信息
        console.log('\n' + chalk.cyan.bold(meta.name) + '\n');
        console.log(chalk.gray(meta.description) + '\n');
        
        if (meta.screenshots && meta.screenshots.length > 0) {
          console.log(chalk.bold('预览图:'));
          // 使用终端图片查看器（如：terminal-image）
          // 或显示缩略图URL
          meta.screenshots.slice(0, 3).forEach(url => {
            console.log(`  ${chalk.blue.underline(url)}`);
          });
          console.log('');
        }
        
        if (meta.features) {
          console.log(chalk.bold('包含功能:'));
          meta.features.forEach(feat => {
            console.log(`  ✓ ${feat}`);
          });
          console.log('');
        }
      }
      
      // 确认是否使用该模板
      const { confirm } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirm',
          message: 'Whether to use this template or not?',
          default: true
        }
      ]);
      
      return confirm;
    }
  }

  module.exports = TemplatePreview;