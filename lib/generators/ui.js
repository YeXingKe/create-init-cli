const path = require("path");
const fs = require("fs-extra");
const chalk = require("chalk");
const { showInfo, pathUtils } = require("../utils");
const codeJson = require("../generators/code.json");

module.exports = async (projectPath, config) => {
    if (config.ui === "none") return;
    showInfo(`set ${chalk.blue(config.ui)} ui library`);

    const entryPath = pathUtils.entryPath(projectPath, config);
    const pkg = require(pathUtils.pkgPath(projectPath));
    const buildPath = path.join(
        projectPath,
        `${config.build === "webpack" ? "vue" : "vite"}.config.${config.language}`
    );

    if (fs.existsSync(entryPath)) {
        let content = await fs.readFile(entryPath, "utf-8");
        let buildConfig = await fs.readFile(buildPath, "utf-8");
        switch (config.ui) {
            case "antdR":
                break;
            case "antdV":
                content = content.replace(
                    codeJson.vue.commonAppImport,
                    codeJson.vue.antdVUICss
                );
                pkg.dependencies["ant-design-vue"] = "^4.2.6";
                pkg.devDependencies["unplugin-vue-components"] = "^0.27.0";
                buildConfig = buildConfig.replace(
                    codeJson.vue.commonVueImport,
                    codeJson.vue.antdVAutoImport
                );
                buildConfig = buildConfig.replace(
                    codeJson.vue.commonVuePlugin,
                    codeJson.vue.antdVAutoPlugin
                );
                break;
            case "ng":
                const algularJson = require(path.join(projectPath, "angular.json"));
                algularJson.projects[pkg.name].architect.build.options.styles.push(
                    codeJson.angular.ngUICSS
                );
                pkg.dependencies["ng-zorro-antd"] = "^19.3.1";
                const sharePath = path.join(projectPath, "src", "share");
                if (!fs.existsSync(sharePath)) {
                    fs.mkdirSync(sharePath, { recursive: true }); // recursive 递归创建父目录
                }

                const shareUIModulePath = path.join(sharePath, "share-ui.module.ts");
                await fs.writeFile(shareUIModulePath, codeJson.angular.uiModuleContent,'utf-8');
                break;
            case "element":
                content = content.replace(
                    codeJson.vue.commonAppImport,
                    codeJson.vue.elementUICss
                );
                buildConfig = buildConfig.replace(
                    codeJson.vue.commonVueImport,
                    codeJson.vue.buildElementAutoImport
                );
                buildConfig = buildConfig.replace(
                    codeJson.vue.commonVuePlugin,
                    codeJson.vue.buildElementAutoPlugin
                );
                pkg.dependencies["element-plus"] = "^2.7.5";
                pkg.devDependencies["unplugin-auto-import"] = "^0.17.6";
                pkg.devDependencies["unplugin-vue-components"] = "^0.27.0";
                break;
            case "none":
                break;
        }
        if (config.ui !== "none") {
            await fs.writeJSON(pathUtils.pkgPath(projectPath), pkg, { spaces: 0 });
        }
        if (config.framework !== "angular" && config.ui !== "none") {
            await fs.writeFile(entryPath, content,'utf-8');
            await fs.writeFile(buildPath, buildConfig,'utf-8');
        }
    }
};
