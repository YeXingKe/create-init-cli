const path = require('path')
const fs = require('fs-extra')
const {showInfo} = require('../utils')

module.exports = async (projectPath,config)=>{
    if(config.ui === 'none') return;
    showInfo(`set ${chalk.blue(config.ui.toUpperCase())} ui library`)

    const uiTemplatePath = path.join(__dirname,'../templates/ui',config.ui)

    if(!fs.existsSync(uiTemplatePath)){
      throw new Error(`不支持该UI库：${config.ui}`)
    }
    
    await fs.copy(uiTemplatePath,projectPath); // 复制UI库模板
    const entryPath = path.join(projectPath,'src',config.framework === 'vue' ? 'main.js' : 'index.js')
    if(fs.existsSync(entryPath)){
        let content = await fs.readFile(entryPath,'utf-8')

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
                content = "import 'element-plus/dist/index.css';\n"+content;
            break
        } 
    }
}