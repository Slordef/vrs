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
    const infos = sys.configs.find(s => s.name === name || s.path === pwd)
    if(!infos){
        console.log(chalk.red(`Service not found.`))
        process.exit(1)
    }

    const lastVer = infos.versions.find(v => v.current)
    const lastIndex = infos.versions.indexOf(lastVers)
    let newIndex = lastIndex + (forward ? 1 : -1)
    let newVers

    if(set){
        switch (typeof set) {
            case "string":
                newVers = infos.versions.find(v => v.dir === set)
                newIndex = infos.versions.indexOf(newVers)
                break
            case "number":
                newIndex = set
                newVer = infos.versions?.[newIndex]
                break
        }
        if(newVer === lastVer) {
            console.log(chalk.yellow(`Value ${set} correspond to the current ver.`))
            process.exit(1)
        }
    }
    newVer = infos.versions?.[newIndex]
    if(!newVer){
        console.log(chalk.yellow(set ? `Value ${set} in versions not found.` : `${forward?'Next':'Previous'} version not found.`))
        process.exit(1)
    }
    if (!forward && del){
        infos.versions = infos.versions.filter(v => !v.current)
        fs.rmSync(`${path}/versions/${lastVer.dir}`, {recursive: true, force: true})
    }
    const current = `${path}/current`
    fs.unlinkSync(current)
    fs.symlinkSync(`${path}/versions/${newVer.dir}`, current, 'junction')
    if (lastVer) lastVer.current = false
    newVer.current = true

    system.setConfig(infos)

    console.log(chalk.green(`${forward ? 'Next' : 'Previous'} version applied.`))
    console.log(chalk.green(`Version : ${newVer.dir}`))
}
