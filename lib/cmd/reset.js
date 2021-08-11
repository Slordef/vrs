const system = require("../system")
const chalk = require("chalk")
const questions = require('./questions')
const inquirer = require("inquirer")
const fs = require('fs')
const { format } = require('../format')

module.exports = function (params) {
    const getName = params.has(['-n']) ? params.get('-n') : null
    const sys = system.getSystem()
    let service = sys.services.find(c => c.name === getName || c.path === process.cwd())
    if (!service) return console.log(chalk.red(`Service not found`))

    inquirer.prompt(questions(service)).then(answers => {
        const { versions, path } = service
        const { name, config, useFile, file, conserve, before, after, useRepo } = answers
        const repo = {
            path: answers.repo,
            build: answers.build,
            script: answers.script,
            copyFolder: answers.copyFolder
        }
        const newService = { name, config, useFile, file, conserve, useRepo, repo, path, before, after, versions }
        service = format(service, newService)
        system.setService(service)
        if (!fs.existsSync(`${path}/${newService.config}`)) fs.writeFileSync(`${path}/${newService.config}`,'{}')
        console.log(chalk.green(`Vers service informations : reset with new values`))
    })
}
