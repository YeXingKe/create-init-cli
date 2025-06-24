const path = require("path");
const fs = require("fs-extra");
const { showInfo, entryFileFormat } = require("../utils");
const chalk = require("chalk");

module.exports = async (projectPath, config) => {
  const framework = config.framework;
  const build = config.build;
  const language = config.language;

  showInfo(
    ` Set ${chalk.blue(framework.toUpperCase())} framework(${chalk.yellow(
      language.toUpperCase()
    )})`
  );

  const templatePath = path.join(__dirname, "../templates", framework); // D:\develop\github\create-init-cli\lib\templates\vue
  const finallyPath = path.join(templatePath, build + "-" + language); //
  await fs.copy(finallyPath, projectPath);

};

// 批量重命名文件
async function renameFiles(dir, oldExt, newExt) {
  const files = await fs.readdir(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stats = await fs.stat(filePath);

    if (stats.isDirectory()) {
      await renameFiles(filePath, oldExt, newExt);
    } else if (file.endsWith(oldExt)) {
      const newFilePath = path.join(dir, file.replace(oldExt, newExt));
      await fs.rename(filePath, newFilePath);
    }
  }
}
