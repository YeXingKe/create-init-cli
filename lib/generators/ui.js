const path = require('path')
const fs = require('fs-extra')
const chalk = require('chalk');
const {showInfo,entryFileFormat} = require('../utils')

module.exports = async (projectPath,config)=>{
    if(config.ui === 'none') return;
    showInfo(`set ${chalk.blue(config.ui)} ui library`)

    const entryPath = path.join(projectPath,'src',entryFileFormat(config))
    const pkgPath = path.join(projectPath, "package.json");
    const pkg = require(pkgPath);
    const buildPath = path.join(projectPath,`${config.build==='webpack'?'vue':'vite'}.config.${config.language}`)
    
    if(fs.existsSync(entryPath)){
        let content = await fs.readFile(entryPath,'utf-8')
        let buildConfig = await fs.readFile(buildPath,'utf-8')
        switch(config.ui){
            case 'antdR':
            break;
            case 'antdV':
                content = content.replace("import App from './App.vue'","import 'ant-design-vue/dist/reset.css';\nimport App from './App.vue';\n");
                pkg.dependencies["ant-design-vue"] = "^4.2.6";
                pkg.devDependencies["unplugin-vue-components"] = "^0.27.0";
                buildConfig = buildConfig.replace("import vue from '@vitejs/plugin-vue'","import vue from '@vitejs/plugin-vue';\nimport Components from 'unplugin-vue-components/vite';\nimport { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'")
                buildConfig = buildConfig.replace("plugins: [vue()],","plugins: [vue(),Components({resolvers: [AntDesignVueResolver({ importStyle: 'css',resolverIcons: true})]}),],")
                break;
            case 'ng':
                const algularJson = require(path.join(projectPath, "angular.json"));
                algularJson.projects[pkg.name].architect.build.options.styles.push("node_modules/ng-zorro-antd/ng-zorro-antd.min.css")
                pkg.dependencies["ng-zorro-antd"] = "^19.3.1";
                const sharePath = path.join(projectPath, "src",'share');
                if(!fs.existsSync(sharePath)){
                    fs.mkdirSync(sharePath,{recursive:true});// recursive 递归创建父目录
                }
                const uiModuleContent = "import { NgModule } from '@angular/core';\nimport { NzButtonModule } from 'ng-zorro-antd/button';\n\nconst UI_MODULES = [NzButtonModule];\n\n@NgModule({\n  imports: [UI_MODULES],\exports: [UI_MODULES]\n});\nexport class SharedUIModule {}"
                const shareUIModulePath = path.join(sharePath,'share-ui.module.ts');
                await fs.writeFile(shareUIModulePath,uiModuleContent)
                break;
            case 'element':
                content = content.replace("import App from './App.vue'","import 'element-plus/dist/index.css';\nimport App from './App.vue';\n");
                buildConfig = buildConfig.replace("import vue from '@vitejs/plugin-vue'","import vue from '@vitejs/plugin-vue';\nimport AutoImport from 'unplugin-auto-import/vite';\nimport Components from 'unplugin-vue-components/vite';\nimport { ElementPlusResolver } from 'unplugin-vue-components/resolvers'")
                buildConfig = buildConfig.replace("plugins: [vue()],","plugins: [vue(),AutoImport({resolvers: [ElementPlusResolver()],}),Components({resolvers: [ElementPlusResolver()]}),],")
                pkg.dependencies["element-plus"] = "^2.7.5";
                pkg.devDependencies["unplugin-auto-import"] = "^0.17.6";
                pkg.devDependencies["unplugin-vue-components"] = "^0.27.0";
                
                break
            case 'none':
                break;
        }
        if(config.ui !== 'none'){
            await fs.writeJSON(pkgPath, pkg, { spaces: 0 });
        }
        if(config.framework !== 'angular' && config.ui !== 'none'){
            await fs.writeFile(entryPath,content)
            await fs.writeFile(buildPath,buildConfig)
        }
    }
}