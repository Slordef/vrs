const fs = require('fs')
const inquirer = require('inquirer')
const chalk = require("chalk");
const system = require("../system")
const treatment = require('../treatment')
const moment = require('moment')

const configFileInit = function (configFile) {
    const pwd = process.cwd()
    if(fs.existsSync(`${pwd}/${configFile}`)) {

    }
}

module.exports = function (params) {
    const pwd = process.cwd()
    const filetest = `${pwd}/.vers.file.test.txt`
    fs.writeFileSync(filetest, "test")
    if (!fs.existsSync(filetest)) return console.log(chalk.red("Vers is not allowed to write in this folder."))
    fs.unlinkSync(filetest)
    const sys = system.getSystem()
    if (sys.configs.find(c => c.path === pwd)) return console.log(chalk.red("Vers already init in this folder."))
    let name = pwd.split(/(\\|\/)+/)[pwd.split(/(\\|\/)+/).length -1]
    if (params.has(['-y','--yes'])) {
        const data = {
            path: pwd,
            name: `vers-${name}`,
            config: 'vers.config.json',
            useFile: 'none',
            file: '',
            conserve: 3,
            repo: null,

        }
        return init(data)
    }
    const questions = [
        {
            name: 'name',
            type: 'input',
            message: 'Enter the name of versioning service:',
            default: `vers-${name}`,
            validate: function ( value ) {
                if(value.length) return true
                if(sys.configs.find(c => c.name === value)) return `Service name "${value}" already exist. Please choose another.`
                return 'Please enter valid name for versioning service.'
            }
        },
        {
            name: 'config',
            type: "input",
            message: "File name of vers configuration:",
            default: "vers.config.json",
            validate: function ( value ) {
                if (!value.length) return "Configuration file is required."
                if (value === 'json') return "Configuration file must be a .json file."
                if (value.split('.')[value.split('.').length - 1] !== 'json') return "Configuration file must be a .json file."
                if (!value.split('.')[0].length) return "Configuration file must be a .json file with a valid name."
                return true
            }

        },
        {
            name: 'useFile',
            type: "list",
            message: "Would use a file for new version? :",
            default: "none",
            choices: ['none','bash','js']
        },
        {
            name: 'file',
            type: 'input',
            message: "Name of the used file for new version :",
            default: current => {
                switch (current.useFile) {
                    case 'bash': return 'vers.sh'
                    case 'js': return 'vers.js'
                }
                return ''
            },
            validate: function ( value, current ) {
                if (!value.length) return "Used file is required."
                if(current.useFile === 'js') {
                    if (value === 'js') return "Used file must be a .js file."
                    if (value.split('.')[value.split('.').length - 1] !== 'js') return "Used file must be a .js file."
                    if (!value.split('.')[0].length) return "Used file must be a .js file with a valid name."
                }
                return true
            },
            when: (current) => current.useFile !== 'none'
        },
        {
            name: 'conserve',
            type: 'number',
            message: "Amount of versions conservation? :",
            default: 3
        },
        {
            name: 'useRepo',
            type: 'confirm',
            message: "Using a local git repository? :",
            default: false,
            when: current => current.useFile === 'none'
        },
        {
            name: 'repo',
            type: 'input',
            message: "Path to the local git repository :",
            default: `./repo`,
            when: current => current.useRepo,
            validate: value => {
                if (!value.length) return "Please set a valid repository path."
                if (!fs.existsSync(`${pwd}/${value}`)) return `Seems the path is not valid :\n${pwd}/${value} not corresponding of a folder.`
                return true
            }
        },
        {
            name: 'build',
            type: 'confirm',
            message: "Do we build the repo? :",
            default: false,
            when: current => current.useRepo
        },
        {
            name: 'script',
            type: 'input',
            message: `NPM script to use for build (npm run ${chalk.cyan("script")}):`,
            default: 'build',
            when: current => current.build
        },
        {
            name: 'copyFolder',
            type: 'input',
            message: "Folder location we copy to the current app folder (relative to the temp folder) :",
            default: current => current.build ? "./dist" : '.',
            when: current => current.useRepo
        },
        {
            name: 'execCmd',
            type: 'confirm',
            message: "Would use execute cmd line before and after? :",
            default: false
        },
        {
            name: 'before',
            type: 'input',
            message: "Do we execute a cmd before versioning (exec cmd, caution):",
            default: '',
            when: current => current.execCmd
        },
        {
            name: 'after',
            type: 'input',
            message: "Do we execute a cmd after versioning (exec cmd, caution):",
            default: '',
            when: current => current.execCmd
        }
    ]
    inquirer.prompt(questions).then(answers => {
        const { name, config, useFile, file, conserve, before, after } = answers
        const repo = !answers.useRepo ? null : {
            path: answers.repo,
            build: answers.build,
            script: answers.script,
            copyFolder: answers.copyFolder
        }
        const infos = { name, config, useFile, file, conserve, repo, path:pwd, before, after, versions: [] }
        treatment(infos)
        init(infos)
    })
}

const init = function (verConfig) {
    const {name, path} = verConfig

    let dir = `/versions`
    if (!fs.existsSync(path+dir)) fs.mkdirSync(path+dir)
    let ver = `${moment.utc().format('YYYYMMDDHHmmss')}`
    let list = [{dir:ver, current: true}]
    if (!fs.existsSync(path + `/current`)) {
        dir = `/versions/${ver}`
        if (!fs.existsSync(path + dir)) fs.mkdirSync(path + dir)
        fs.symlinkSync(path + dir, path + `/current`, 'junction')
    } else {
        let listOfDir = fs.readdirSync(path+dir)
        list = listOfDir.map((l,i) => ({ dir:l, current: i === (listOfDir.length - 1) }))
    }

    const infos = verConfig
    infos.versions = [...list]
    system.addConfig(infos)
    fs.writeFileSync(`${path}/${infos.config}`,'{}')

    console.log(chalk.underline.green(`Vers initialized for :`))
    console.log(chalk.green(`name: ${name}`))
    console.log(chalk.green(`path: ${path}`))
}
