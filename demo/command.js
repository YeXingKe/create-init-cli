#!/usr/bin/env node

const commander = require('commander');
const pkg = require('../package.json');

// const {program} = commander;
// 实例化一个Command示例
const program = new commander.Command();
program
.name(Object.keys(pkg.bin)[0]) // 设置程序的名称
.usage('<command> [options]') // 提示用户如何使用这个命令行工具
.version(pkg.version) // 设置了命令行工具的版本号
.option('-a, --aa <custom classroom\'s name>','current classroom name','zws---')
.option('-d, --debug','open debug mode',false) // 添加了一个命令行选项

// command注册命令
const clone = program.command('clone <source> [destination]'); // 定义了一个名为clone的子命令
clone
.description('clone a repository') // 为clone命令提供了一个描述
.option('-f, --force','force clone') // 为clone命令添加了一个选项
.action((source,destination)=>{ // 当用户执行clone命令时应该执行的动作
  console.log(source,destination)
})

// // addCommand 注册子命令
// const service = new commander.Command('service');
// service
// .command('start [port]')
// .description('start service at some port')
// .action((port)=>{
//   console.log('do service start',port)
// })

// service
// .command('stop [port]')
// .description('stop service at some port')
// .action((port)=>{
//   console.log('do service stop',port)
// })

// program.addCommand(service);


program.parse(process.argv)