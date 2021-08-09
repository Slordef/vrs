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
    const service = sys.configs.find(s => s.name === name || s.path === pwd)
    if(!service){
        console.log(chalk.red(`Service not found.`))
        process.exit(1)
    }

    const { config, path } = service

    let infos
    try {
        const readConfig = fs.readFileSync(`${path}/${config}`)
        infos = JSON.parse(readConfig)
    } catch (e) {
        console.log(chalk.red(`Ver configuration file error`))
        process.exit(1)
        return
    }

    const lastVer = infos.versions.find(v => v.current)
    const lastIndex = infos.versions.indexOf(lastVer)
    let newIndex = lastIndex + (forward ? 1 : -1)
    let newVer

    if(set){
        switch (typeof set) {
            case "string":
                newVer = infos.versions.find(v => v.dir === set)
                newIndex = infos.versions.indexOf(newVer)
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

    fs.writeFileSync(`${path}/${config}`, JSON.stringify(infos))

    console.log(chalk.green(`${forward ? 'Next' : 'Previous'} version applied.`))
    console.log(chalk.green(`Version : ${newVer.dir}`))
}
