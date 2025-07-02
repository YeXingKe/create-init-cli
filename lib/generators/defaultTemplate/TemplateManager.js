const path = require('path');
const fs = require('fs-extra');
const download = require('download-git-repo')
const templates = require('../../templates/git-repo-temp.json')

class TemplateManager {
    templateCacheDir;
    constructor() {
        this.templateCacheDir = path.join(
          require('os').homedir(), //  获取当前操作系统用户的 主目录（home directory）路径 C:\Users\Administrator
          '.create-init-cli', 
          'templates'
        );
      }
    
      // 下载模板到缓存
      async downloadTemplate(templateName) {
        const template = this.getTemplateConfig(templateName);
        const dest = path.join(this.templateCacheDir, templateName);
        
        if (fs.existsSync(dest)) {
          console.log(`使用缓存模板: ${templateName}`);
          return dest;
        }
    
        console.log(`下载模板: ${template.name}`);
        await fs.ensureDir(dest);
        
        return new Promise((resolve, reject) => {
          download(`direct:${template.repo}#${template.branch}`, dest, { clone: true }, (err) => {
            if (err) reject(err);
            else resolve(dest);
          });
        });
      }
    
      // 获取模板配置
      getTemplateConfig(name) {
        // 从配置文件中获取模板信息
        return templates[name];
      }
}

module.exports = TemplateManager