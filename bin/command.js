#!/usr/bin/env node

const commander = require('commander');
const pkg = require('../package.json');

// const {program} = commander;
// 实例化一个Command示例
const program = new commander.Command();
program
.name(Object.keys(pkg.bin)[0])
.usage('<command> [options]')
.version(pkg.version)
.option('-d, --debug','是否开启调试模式',false)

// command注册命令
const clone = program.command('clone <source> [destination]');
clone
.description('clone a repository')
.option('-f, --force','是否强制克隆')
.action((source,destination)=>{
  console.log(source,destination)
})

// addCommand 注册子命令
const service = new commander.Command('service');
service
.command('start [port]')
.description('start service at some port')
.action((port)=>{
  console.log('do service start',port)
})

service
.command('stop [port]')
.description('stop service at some port')
.action((port)=>{
  console.log('do service stop',port)
})

program.addCommand(service);


program.parse(process.argv)