const system = require('../system')
const chalk = require("chalk");
const inquirer = require("inquirer");
const fs = require("fs");
const { before, after } = require('../execOnCurrent')

module.exports = (program) => {
    program
        .command('delete [name]')
        .alias('del')
        .alias('rm')
        .description('delete service, folder or configuration file')
        .action(fnDestroy)
}

function fnDestroy (name) {
    const path = process.cwd()
    const sys = system.getSystem()
    let lastService
    if (name) {
        lastService = sys.services.find(s => s.name === name)
        if (!lastService) {
            console.log(chalk.red(`${name} doesn't exist in services`))
            return process.exit(1)
        }
    } else lastService = sys.services.find(s => s.path === path)
    if (!lastService){
        console.log(chalk.red(`No service found with this folder`))
        return process.exit(1)
    }
    deleteFiles(lastService)
}

function deleteFiles (service) {
    inquirer.prompt([
        {
            name: 'delete',
            type: 'checkbox',
            message: `Delete folders and files (no way back):`,
            choices: [
                {name: 'Service', value: 'service', checked: true },
                {name: 'Versions (recursive)', value: 'versions'},
                {name: 'Configuration file', value: 'config'}
            ]
        }
    ]).then(async answers => {
        await before(service, 'delete')
        if(answers.delete.length <= 0) console.log(chalk.yellow(`No data removed.`))
        if (answers.delete.includes('versions')) {
            if (fs.existsSync(`${service.path}/current`)) fs.unlinkSync(`${service.path}/current`)
            if (fs.existsSync(`${service.path}/versions`))  fs.rmSync(`${service.path}/versions`, {recursive: true})
            service.versions = []
            system.setService(service)
            console.log(chalk.green(`${service.name} versions folder with content files are removed.`))
        }
        if (answers.delete.includes('config')) {
            if (!fs.existsSync(`${service.path}/${service.config}`) || !service.config.length)
                console.log(chalk.green(`${service.name} config file not found.`))
            else {
                fs.rmSync(`${service.path}/${service.config}`)
                service.config = ''
                system.setService(service)
                console.log(chalk.green(`${service.name} config file is removed.`))
            }
        }
        if (answers.delete.includes('service')) {
            system.rmService(service)
            console.log(chalk.green(`${service.name} is removed from services.`))
        }
        await after(service, 'delete')
    })
}
