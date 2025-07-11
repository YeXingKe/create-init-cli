<h4 align="center">脚手架（create-init-cli）</h4>
<p align="center">
	  <a href="https://github.com/chalk/chalk" target="_blank">
    <img src="https://img.shields.io/badge/chalk-%5E4.1.2-8A2BE2">
    </a>
    <a href="" target="_blank">
    <img src="https://img.shields.io/badge/child-_process-%5E1.0.2-8A2BE2">
    </a>
    <a href="https://github.com/tj/commander.js" target="_blank">
    <img src="https://img.shields.io/badge/commander-%5E10.0.1-8A2BE2">
    </a>
    <a href="gitlab:flippidippi/download-git-repo" target="_blank">
    <img src="https://img.shields.io/badge/download--git--repo-%5E3.0.2-8A2BE2">
    </a>
    <a href="https://github.com/SBoudrias/Inquirer.js" target="_blank">
    <img src="https://img.shields.io/badge/inquirer-%5E8.2.6-8A2BE2">
    </a>
    <a href="https://github.com/sindresorhus/ora" target="_blank">
    <img src="https://img.shields.io/badge/ora-%5E5.4.1-8A2BE2">
    </a>
</p>

## 作用
> 一个脚手架工具：创建并初始化项目，框架、语言、ui选择、规范文件等的选择，可以实现远程模板下载，可以实现缓存模板。
## 环境
> node >= 18
## 命令
```bash
cptc init [projectName]   # 创建命令时输入项目名可选
cptc create <projectName> # 创建命令时必输项目名
```
## 文件
```json
bin
 cli.js                  // 命令启动逻辑
lib
 gennerators
  defaultTemplate        // 从远程git获取的默认配置项目模板逻辑
  code.json              // 配置默认引入的代码
  framework.js           // 前端框架引入逻辑
  index.js
  lint.js                // 规范插件引入逻辑
  ui.js                  // ui插件引入逻辑
  templates               // 模板文件夹
  create.js               // 项目创建命令交互逻辑
  saveTemplate.js         // 保存模板配置到本地
  selectConfig.js         // 交互配置
  utils.js                // 通用工具
```
## 本地调试
- 在根目录执行
> npm link
- 在需要创建项目文件夹下执行
> npm create app-demo
