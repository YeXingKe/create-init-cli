#!/usr/bin/env node

const yargs = require("yargs/yargs");
const {hideBin} = require("yargs/helpers");

const arg = hideBin(process.argv);

const cli = yargs(arg)

cli
.usage('Usage: create-template-cli [command] <options>')
.demandCommand(1,'A command is required.')
.alias('h','help')
.alias('v','version')
// .alias('d','debug')
.wrap(cli.terminalWidth())
.epilogue('Your own footer description')
.options({
  debug:{
    type:'boolean',
    describe:'Bootstrap debug mode',
    alias:'d'
  },
})
.group(['debug'],'Dev Options:')
.command('init [name]','Do init a project',(yargs)=>{
  yargs.option('name',{
    type:'string',
    describe:'Name of a project',
  },(argv)=>{
    console.log(argv)
  })
})
.argv;