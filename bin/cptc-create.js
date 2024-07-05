#!/usr/bin/env node
const inquirer = require('inquirer');// 9版本下才生效，否则报错

const promptList = [
    {
        type: 'input',
        name: 'project_name',
        message: 'input a project name:',
        default: 'demo-project',
        suffix: '🙂',
        validate: (value) => {
            if (value) {
                return true;
            }
            return 'project name cannot be empty.';
        }
    },
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
        ],
        // when:(answer)=>{
        //     if(answer.frame){
        //         // 判断上一步选了什么
        //     }
        // }
    },
    {
        type: 'checkbox',
        name: 'config',
        message: 'select configs：',
        choices: [
            { value: 0, name: 'eslint' },
            { value: 1, name: 'prettier' },
        ]
    },
]
const isInputProjectName = true;
inquirer.prompt(isInputProjectName ? promptList.shift() : promptList).then(answer => {
    console.log('answer:', answer)
})
