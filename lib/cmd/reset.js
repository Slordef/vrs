const system = require("../system")
const chalk = require("chalk")
const questions = require('./questions')
const inquirer = require("inquirer")
const fs = require('fs')

function parseInfos (infos) {
    const { path, name, config, useFile, file, conserve, repo, before, after } = infos
    const useRepo = !!repo
    const execCmd = before?.length || after?.length
    const { build, script, copyFolder } = repo
    return { path, name, config, useFile, file, conserve, useRepo, repo: repo.path, build, script, copyFolder, execCmd, before, after }
}
module.exports = function (params) {
    const sName = params.has(['-n']) ? params.get('-n') : null
    const sys = system.getSystem()
    const infos = sys.configs.find(c => c.name === sName || c.path === process.cwd())
    if (!infos) return console.log(chalk.red(`Service not found`))

    inquirer.prompt(questions(parseInfos(infos))).then(answers => {
        const { versions, path } = infos
        const { name, config, useFile, file, conserve, before, after } = answers
        const repo = !answers.useRepo ? null : {
            path: answers.repo,
            build: answers.build,
            script: answers.script,
            copyFolder: answers.copyFolder
        }
        const newInfos = { name, config, useFile, file, conserve, repo, path, before, after, versions }
        system.setConfig(newInfos)
        if (!fs.existsSync(`${path}/${infos.config}`)) fs.writeFileSync(`${path}/${infos.config}`,'{}')
        console.log(chalk.green(`Vers service informations : reset with new values`))
    })
}
