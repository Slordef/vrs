const system = require('../system')
const chalk = require("chalk")
const fs = require('fs')
const inquirer = require('inquirer')

module.exports = function (params, forward = false) {
    const del = params.has(['-d', '--delete'])

    if (del) {
        inquirer.prompt([
            {
                name: 'delete',
                type: 'confirm',
                message: `Please confirm deletion current version:`,
                default: false
            }
        ]).then(answers => {
            roll(params, forward, answers.delete)
        })
    } else {
        roll(params, forward)
    }
}

function roll (params, forward, del = false) {
    const set = params.get('--set')
    const name = params.has(['-n']) ? params.get('-n') : null
    const pwd = process.cwd()

    const sys = system.getSystem()
    const service = sys.services.find(s => s.name === name || s.path === pwd)
    if(!service){
        console.log(chalk.red(`Service not found.`))
        process.exit(1)
    }

    const lastVersion = service.versions.find(v => v.current)
    const lastIndex = service.versions.indexOf(lastVersion)
    let newIndex = lastIndex + (forward ? 1 : -1)
    let newVersion

    if(set){
        newVersion = service.versions.find(v => v.dir === set)
        if(!newVersion) {
            newIndex = set
            newVersion = service.versions?.[newIndex]
        }
        newIndex = service.versions.findIndex(v => newVersion.dir === v.dir)
        if(newVersion === lastVersion) {
            console.log(chalk.yellow(`Value ${set} correspond to the current ver.`))
            process.exit(1)
        }
    }
    newVersion = service.versions?.[newIndex]
    if(!newVersion){
        console.log(chalk.yellow(set ? `Value ${set} in versions not found.` : `${forward?'Next':'Previous'} version not found.`))
        process.exit(1)
    }
    if (!forward && del){
        service.versions = service.versions.filter(v => !v.current)
        fs.rmSync(`${service.path}/versions/${lastVersion.dir}`, {recursive: true, force: true})
    }
    const current = `${service.path}/current`
    fs.unlinkSync(current)
    fs.symlinkSync(`${service.path}/versions/${newVersion.dir}`, current, 'junction')
    if (lastVersion) lastVersion.current = false
    newVersion.current = true

    system.setService(service)

    console.log(chalk.green(`${forward ? 'Next' : 'Previous'} version applied.`))
    console.log(chalk.green(`Version : ${newVersion.dir}`))
}
