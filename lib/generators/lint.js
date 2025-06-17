const path = require('path')
const fs = require('fs-extra')
const {showInfo} = require('../utils');
const chalk = require('chalk');

module.exports = async (projectPath,config) => {
    if(config.linters.length === 0) return;

    showInfo(`配置代码规范工具：${chalk.blue(config.linters.join(','))}`);

    for(const linter of config.linters){
        const linterPath = path.join(__dirname,'../templates/lint',linter)
        if(fs.existsSync(linterPath)){
            await fs.copy(linterPath,projectPath)
        }
        // 添加lint脚本到package.json
        const pkgPath = path.json(projectPath,'package.json')
        const pkg = await fs.readJson(pkgPath)
        pkg.scripts = pkg.scripts || {}
        if(config.linters.includes('eslint')){
            pkg.scripts.lint = 'eslint --ext .js,.jsx,.ts,.tsx src';
            pkg.scripts['lint:fix'] = 'eslint --fix --ext .js,.jsx,.ts,.tsx src';
        }
        if(config.linters.includes('stylelint')){
            pkg.scripts['lint:styles'] = 'stylelint "**/*.{css,scss,less}"'
        }
        if(config.linters.includes('commitlint')){
            pkg.config = pkg.config || {}
            pkg.config.commitizen = {
                path:'cz-conventional-changelog'
            }
        }
        await fs.writeJson(pkgPath,pkg,{spaces:2})
    }
}