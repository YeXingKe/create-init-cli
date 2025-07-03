# create-init-cli
脚手架工具：可初始化项目，通过默认模板生成初始化
> node >= 18
## 命令
```json
"bin": {
  "cptc": "bin/index.js"
}
```
## 文件
```json
bin
- cli.js                  // 命令启动逻辑
lib
- gennerators
---defaultTemplate        // 从远程git获取的默认配置项目模板逻辑
---code.json              // 配置默认引入的代码
---framework.js           // 前端框架引入逻辑
---index.js
---lint.js                // 规范插件引入逻辑
---ui.js                  // ui插件引入逻辑
- templates               // 模板文件夹
- create.js               // 项目创建命令交互逻辑
- saveTemplate.js         // 保存模板配置到本地
- selectConfig.js         // 交互配置
- utils.js                // 通用工具
```
## 本地调试
- 在根目录执行
> npm link
- 在需要创建项目文件夹下执行
> npm create app-demo