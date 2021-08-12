const fs = require('fs')
const inquirer = require('inquirer')
const chalk = require("chalk");
const system = require("../system")
const treatment = require('../treatment')
const moment = require('moment')
const questions = require('../questions')
const { format } = require("../format");

module.exports = (program) => {
    program
        .command('init')
        .description('define service and create folders to use it. \'-y\' to skip question with default values')
        .option('-y, --yes', 'skip init questions for default values')
        .action(fnInit)
}

function fnInit (options) {
    const pwd = process.cwd()
    const fileTest = `${pwd}/.vrs.file.test.txt`
    fs.writeFileSync(fileTest, "test")
    if (!fs.existsSync(fileTest)) return console.log(chalk.red("VRS is not allowed to write in this folder."))
    fs.unlinkSync(fileTest)
    const sys = system.getSystem()
    if (sys.services.find(c => c.path === pwd)) return console.log(chalk.red("VRS already init in this folder."))
    const data = format()
    if (options.yes) {
        let service = data
        const { name, config, useFile, file, conserve, before, after, repo, useRepo } = data
        const newService = { name, config, useFile, file, conserve, useRepo, repo, path:pwd, before, after, versions: [] }
        service = format(service, newService)
        return init(service)
    }
    inquirer.prompt(questions(data)).then(answers => {
        let service = data
        const { name, config, useFile, file, conserve, before, after, useRepo } = answers
        const repo = {
            path: answers.repo,
            build: answers.build,
            script: answers.script,
            copyFolder: answers.copyFolder
        }
        const newService = { name, config, useFile, file, conserve, useRepo, repo, path:pwd, before, after, versions: [] }
        service = format(service, newService)
        treatment(service).then(() => {})
        init(service)
    })
}

const init = function (vrs) {
    const {name, path} = vrs

    let dir = `/versions`
    if (!fs.existsSync(path+dir)) fs.mkdirSync(path+dir)
    let version = `${moment.utc().format('YYYYMMDDHHmmss')}`
    let list = [{dir:version, current: true}]
    if (!fs.existsSync(path + `/current`)) {
        dir = `/versions/${version}`
        if (!fs.existsSync(path + dir)) fs.mkdirSync(path + dir)
        fs.symlinkSync(path + dir, path + `/current`, 'junction')
    } else {
        let listOfDir = fs.readdirSync(path+dir)
        list = listOfDir.map((l,i) => ({ dir:l, current: i === (listOfDir.length - 1) }))
    }

    const service = vrs
    service.versions = [...list]
    system.setService(service)
    if (service.config.length && !fs.existsSync(`${path}/${service.config}`)) fs.writeFileSync(`${path}/${service.config}`,'{}')

    console.log(chalk.underline.green(`VRS initialized for :`))
    console.log(chalk.green(`name: ${name}`))
    console.log(chalk.green(`path: ${path}`))
}
