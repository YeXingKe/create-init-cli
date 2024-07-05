#!/usr/bin/env node

const ora = require('ora'); // 6版本下生效，否则报错

let percent = 0;
const spinner = ora('Loading').start(); // 加载器执行开始
spinner.color = 'green' // 加载颜色
spinner.prefixText = 'Downloading chalk...';// 加载文本
let task = setInterval(() => {
    percent += 10;
    spinner.text = 'Loading '+percent+'%' //默认上面的Loading
    if (percent === 100) {
        spinner.stop();
        spinner.prefixText = '';
        spinner.succeed('Download Successful!') // 下载成功
        clearInterval(task)
    }
},500);

(async function () {
    const promise = new Promise((resolve) => {
        console.log('doing something...');
        setTimeout(() => {
            resolve()
        }, 3000)
    });
    await ora.promise(promise, {
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