#!/usr/bin/env node

import ora,{oraPromise} from 'ora'
let percent = 0;
const spinner = ora('Loading').start();
spinner.color = 'green'
spinner.prefixText = 'Downloading chalk...';
let task = setInterval(() => {
    percent += 10;
    spinner.text = 'Loading '+percent+'%' //默认上面的Loading
    if (percent === 100) {
        spinner.stop();
        spinner.prefixText = '';
        spinner.succeed('Download Successful!')
        clearInterval(task)
    }
},500)

(async function () {
    const promise = new Promise((resolve) => {
        console.log('doing something...');
        setTimeout(() => {
            resolve()
        }, 3000)
    });
    await oraPromise(promise, {
        successText: 'success!',
        failText: 'Download ora',
        prefixText: 'Download ora',
        text: 'Loading',
        spinner: {
            interval: 20,
            frames:['-','\\','|','/','-']
        }
    })
})()