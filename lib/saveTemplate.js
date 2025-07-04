const inquirer = require("inquirer"); 
const fs = require('fs-extra');
const {pathUtils} = require('./utils');
const path = require('path');

exports.saveAsTemplate = async (currentConfig,projectName)=>{
  const {saveTemplate} = await inquirer.prompt([
    {
        type:'confirm',
        name:'saveTemplate',
        message:'Would you like to save the current settings as a template?',
        default:true
    }
   ]);
   if(!saveTemplate) return;
   const {templateName,templateDesc} = await inquirer.prompt([
    {
        type:'input',
        name:'templateName',
        message:'input template name',
        validate: input => !!input.trim() || 'the template name cannot be empty.',
        default:`${projectName}-template`
    }
   ])
   const configJSON = JSON.stringify(currentConfig)
   const configPath = await findTemplate(templateName,configJSON)
   await fs.writeFile(configPath,JSON.stringify(currentConfig,null,2),'utf-8') // 写入配置
}



async function findTemplate(templateName,configJSON){
   const cacheTemplatePath = path.join(pathUtils.cachePath,`${templateName}.json`)
   if(!fs.existsSync(cacheTemplatePath)){
    await fs.writeFile(cacheTemplatePath,'{}','utf-8')
   }
   const readJSON = await fs.readJSON(cacheTemplatePath)
   if (readJSON === configJSON) {
    // 检查目录是否存在
    const prompt = inquirer.createPromptModule();
    const { overwrite } = await prompt([
      {
        type: "confirm",
        name: "overwrite",
        message: "Directory already exists.Do you want to overwrite?",
        default: false,
      },
    ]);
    // 是否重写
    if (overwrite) {
      await fs.remove(cacheTemplatePath);
      await fs.writeFile(cacheTemplatePath,'{}','utf-8')
    }
  }
  return cacheTemplatePath
}