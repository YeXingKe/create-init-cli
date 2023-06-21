#!/usr/bin/env node
import inquirer from 'inquirer';

inquirer.prompt([
    // {
    //     type: 'input',
    //     name: 'project_name',
    //     message: 'input a project name:'
    // },
    // {
    //     type: 'confirm',
    //     name: 'choice',
    //     message: '是否自动配置默认eslint文档',
    //     default: false
    // },
    {
        type: 'list',
        name: 'platform',
        message: 'select a platform：',
        choices: [
            { value: 0, name: 'pc' },
            { value: 1, name: 'mobile' }
        ]
    },
    {
        type: 'list',
        name: 'frame',
        message: 'select a frame：',
        choices: [
            { value: 0, name: 'Vue' },
            { value: 1, name: 'React' },
            { value: 2, name: 'Angular' },
        ]
    },
    {
        type: 'list',
        name: 'ui',
        message: 'select a UI：',
        choices: [
            { value: 0, name: 'ElementPlus' },
            { value: 1, name: 'Ant-Design-React' },
            { value: 2, name: 'Ant-Design-Vue' },
            { value: 3, name: 'NG-ZORRO' },
        ]
    },
]).then(answer => {
    console.log(answer)
})