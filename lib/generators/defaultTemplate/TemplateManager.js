const path = require('path');
const fs = require('fs-extra');
const download = require('download-git-repo')
const templates = require('../../templates/git-repo-temp.json')
const {pathUtils} = require('../../utils')

class TemplateManager {
    templateCacheDir;
    constructor() {
        this.templateCacheDir = pathUtils.cachePath
    }
    
      // 下载模板到缓存
      async downloadTemplate(templateName) {
        const template = this.getTemplateConfig(templateName);
        const dest = path.join(this.templateCacheDir, templateName);
        if (fs.existsSync(dest)) {
          console.log(`use cache template: ${templateName}`);
          return dest;
        }
    
        console.log(`download template: ${template.name}`);
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