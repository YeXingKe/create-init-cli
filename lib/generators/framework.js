const path = require('path')
const fs = require('fs-extra')
const ejs = require('ejs') // 基于js的模板引擎，生成静态页面
const {showInfo,entryFileFormat} = require('../utils')
const chalk = require('chalk')

module.exports = async (projectPath,config) => {
    const framework = config.framework;
    const language = config.language;

    showInfo(` Set ${chalk.blue(framework.toUpperCase())} framework(${chalk.yellow(language.toUpperCase())})`)

    const templatePath = path.join(__dirname,'../templates',framework)
    console.log('templatePath====',templatePath); // D:\develop\github\create-init-cli\lib\templates\vue
    console.log('projectPath====',projectPath);// D:\develop\github\create-init-cli\app-demo
    await fs.copy(templatePath,projectPath) // 复制框架模板到projectPath

    const srcPath = path.join(projectPath,'src') // D:\develop\github\create-init-cli\app-demo\src

    if(language === 'ts'){
        await renameFiles(srcPath,'.js','.ts')
        await renameFiles(srcPath,'.jsx','.tsx')
        await fs.copy(path.join(templatePath,`tconfig.${framework}.json`,path.join(projectPath,'tsconfig.json'))) // 添加tsconfig.json
    }else{
        // 默认是js项目，不存在tsconfig.json
        // await fs.remove(path.join(projectPath,'tsconfig.json')) // 删除TS配置文件
    }
    
    // 渲染入口文件
    const entryFile = entryFileFormat(config)
    const entryPath = path.join(srcPath,entryFile)

    if(fs.existsSync(entryPath)){
        const content = await fs.readFile(entryPath,'utf-8')
        const rendered =  ejs.render(content,{projectName:path.basename(projectPath),ui:config.ui})
        await fs.writeFile(entryPath,rendered)
    }
}

// 批量重命名文件
async function renameFiles(dir,oldExt,newExt){
  const files = await fs.readdir(dir);
  
  for(const file of files){
    const filePath = path.join(dir,file)
    const stats = await fs.stat(filePath)

    if(stats.isDirectory()){
        await renameFiles(filePath,oldExt,newExt)
    }else if(file.endsWith(oldExt)){
        const newFilePath = path.join(dir,file.replace(oldExt,newExt))
        await fs.rename(filePath,newFilePath)
    }
  }
}