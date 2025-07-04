const path = require('path')
const fs = require('fs-extra')
const { showInfo, pathUtils } = require('../utils');
const chalk = require('chalk');

module.exports = async (projectPath, config) => {
    if (config.linters.length === 0) return;

    showInfo(`set code lint tool:${chalk.blue(config.linters.join(','))}`);

    for (const linter of config.linters) {
        const linterPath = path.join(__dirname, '../templates/lint', linter==='eslint'?`/eslint/${config.framework}-${config.language}`:linter)
        if (fs.existsSync(linterPath)) {
            await fs.copy(linterPath, projectPath)
        }
        // 添加lint脚本到package.json
        const pkg = await fs.readJson(pathUtils.pkgPath(projectPath))
        if (linter.includes('prettier')) {
            pkg.scripts['format'] = 'prettier --write src/**/*.{js,jsx,vue,ts,tsx}';
            pkg.devDependencies["prettier"] = "^3.6.0";
        }
        if (linter.includes('eslint')) {
            pkg.scripts.lint = 'eslint --ext .js,.jsx,.ts,.tsx src';
            pkg.scripts['lint:fix'] = 'eslint --fix --ext .js,.jsx,.ts,.tsx src';
            pkg.devDependencies["eslint"] = "^9.29.0";
            if (config.framework === 'vue') {
                pkg.devDependencies['eslint-plugin-vue'] = "^10.2.0"
            } else {
                pkg.devDependencies['eslint-plugin-react'] = "^7.37.5"
            }
            if (config.language === 'ts') {
                pkg.devDependencies['typescript-eslint'] = "^8.35.0"
            }
            pkg.devDependencies['@eslint/js'] = "^9.29.0"
            pkg.devDependencies['@eslint/json'] = "^0.12.0"
            pkg.devDependencies['@eslint/markdown'] = "^6.6.0"
        }
        if (linter.includes('style')) {
            pkg.scripts['lint:styles'] = 'stylelint "**/*.{css,scss,less}"'
            pkg.devDependencies['stylelint-config-standard'] = "^38.0.0"
            pkg.devDependencies['stylelint'] = "^16.21.0"
        }
        if (linter.includes('commit')) {
            pkg.config = pkg.config || {}
            pkg.config.commitizen = {
                path: 'cz-conventional-changelog'
            }
        }
        await fs.writeJson(pathUtils.pkgPath(projectPath), pkg, { spaces: 0 })
    }
}