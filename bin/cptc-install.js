#!/usr/bin/env node
const { exec } = require('child_process');
const ora = require('ora');

function installDependencies(dependencies) {
    let percent = 0;
    const spinner = ora('Loading').start(); // 加载器执行开始
    spinner.color = 'green' // 加载颜色
    const installCommand = `npm install ${dependencies.join(' ')}`;
    exec(installCommand, (error, stdout, stderr) => {
        spinner.stop();
        if (error) {
            console.error(`error: ${error}`);
            spinner.fail('download fail!')
            return;
        }
        // console.log(stdout);
        if (stderr) console.error(stderr);
        spinner.succeed('download successful!')
    });
}

if (process.argv.length === 2) {
    const dependencies = ['vue', 'react']
    installDependencies(dependencies);
}
