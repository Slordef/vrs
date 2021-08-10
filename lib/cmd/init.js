const fs = require('fs')
const inquirer = require('inquirer')
const chalk = require("chalk");
const system = require("../system")
const treatment = require('../treatment')
const moment = require('moment')
const questions = require('./questions')

module.exports = function (params) {
    const pwd = process.cwd()
    const filetest = `${pwd}/.vers.file.test.txt`
    fs.writeFileSync(filetest, "test")
    if (!fs.existsSync(filetest)) return console.log(chalk.red("Vers is not allowed to write in this folder."))
    fs.unlinkSync(filetest)
    const sys = system.getSystem()
    if (sys.configs.find(c => c.path === pwd)) return console.log(chalk.red("Vers already init in this folder."))
    let name = pwd.split(/(\\|\/)+/)[pwd.split(/(\\|\/)+/).length -1]
    const data = {
        name: `vers-${name}`,
        config: 'vers.config.json',
        useFile: 'none',
        file: '',
        conserve: 3,
        useRepo: false,
        repo: null,
        build: '',
        script: '',
        copyFolder: '',
        execCmd: false,
        before: '',
        after: '',
    }
    if (params.has(['-y','--yes'])) {
        const { name, config, useFile, file, conserve, before, after, repo } = data
        const infos = { name, config, useFile, file, conserve, repo, path:pwd, before, after, versions: [] }
        return init(infos)
    }
    inquirer.prompt(questions(data)).then(answers => {
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
    if (!fs.existsSync(`${path}/${infos.config}`)) fs.writeFileSync(`${path}/${infos.config}`,'{}')

    console.log(chalk.underline.green(`Vers initialized for :`))
    console.log(chalk.green(`name: ${name}`))
    console.log(chalk.green(`path: ${path}`))
}
