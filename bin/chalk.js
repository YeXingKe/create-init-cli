#!/usr/bin/env node

// const chalk = require('chalk');
import chalk from 'chalk'
console.log(chalk.green.bold('successful!'))
console.log(chalk.green('hello',chalk.underline('world!')))


const error = (...text) => console.log(chalk.bold.hex('#ff0000')(text));
const warning = (...text)=> console.log(chalk.hex('#fffa500')(text));
const success = (...text) =>console.log(chalk.green(text));

error('Error!')
warning('Warning!');
success('Successful!')

// const customChalk = new chalk.Chalk({level:0});
// console.log(customChalk.blue('hello world!'))