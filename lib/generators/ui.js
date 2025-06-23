const path = require('path')
const fs = require('fs-extra')
const chalk = require('chalk');
const {showInfo,entryFileFormat} = require('../utils')

module.exports = async (projectPath,config)=>{
    if(config.ui === 'none') return;
    showInfo(`set ${chalk.blue(config.ui)} ui library`)

    // const uiTemplatePath = path.join(__dirname,'../templates/ui',config.ui)

    // if(!fs.existsSync(uiTemplatePath)){
    //   throw new Error(`不支持该UI库：${config.ui}`)
    // }
    
    // await fs.copy(uiTemplatePath,projectPath); // 复制UI库模板
    const entryPath = path.join(projectPath,'src',entryFileFormat(config))
    const buildPath = path.join(projectPath,`${config.build}.config.${config.language}`)
    // const pkgPath = path.join(projectPath,'package.json')
    if(fs.existsSync(entryPath)){
        let content = await fs.readFile(entryPath,'utf-8')
        let buildConfig = await fs.readFile(buildPath,'utf-8')
        switch(config.ui){
            case 'antd':
                if(config.framework === 'react'){
                    content = "import 'antd/dist/antd.css';\n"+content;
                }else if(config.framework === 'vue'){
                    content = content.replace('createApp(App)','createApp(App).use(Antd)');
                }else if(config.framework === 'angular'){

                }
            break;
            case 'element':
                content = content.replace("import App from './App.vue'","import 'element-plus/dist/index.css';\nimport App from './App.vue';\n");
                buildConfig = buildConfig.replace("import vue from '@vitejs/plugin-vue'","import vue from '@vitejs/plugin-vue';\nimport AutoImport from 'unplugin-auto-import/vite';\nimport Components from 'unplugin-vue-components/vite';\nimport { ElementPlusResolver } from 'unplugin-vue-components/resolvers'")
                buildConfig = buildConfig.replace("plugins: [vue()],","plugins: [vue(),AutoImport({resolvers: [ElementPlusResolver()],}),Components({resolvers: [ElementPlusResolver()]}),],")
                const pkgPath = path.join(projectPath, "package.json");
                const pkg = require(pkgPath);
                pkg.dependencies["element-plus"] = "^2.7.5";
                pkg.devDependencies["unplugin-auto-import"] = "^0.17.6";
                pkg.devDependencies["unplugin-vue-components"] = "^0.27.0";
                await fs.writeJSON(pkgPath, pkg, { spaces: 0 });
                break
        } 
        await fs.writeFile(entryPath,content)
        await fs.writeFile(buildPath,buildConfig)
    }
}