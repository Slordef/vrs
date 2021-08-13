const chalk = require("chalk")
const inquirer = require('inquirer')
const change = require('../change')
const noProcess = require('../noprocess')

module.exports = (program) => {
    program
        .command('rollback [name]')
        .alias('rb')
        .description('set to the previous version')
        .option('-d, --delete', "delete current version")
        .option('-np, --no-process', 'run process background, stop main process')
        .action(fnRollback)
}

function fnRollback (name, options) {
    if(!options.process) return noProcess(['fw',name, options.delete?'-d':null])
    if (options.delete) {
        inquirer.prompt([
            {
                name: 'delete',
                type: 'confirm',
                message: `Please confirm deletion current version:`,
                default: false
            }
        ]).then(answers => {
            roll(name, answers.delete)
        })
    } else {
        roll(name)
    }
}

async function roll (name, del = false) {
    try {
        const newVersion = await change(name, -1, del)
        console.log(chalk.green(`Previous version applied.`))
        console.log(chalk.green(`Version : ${newVersion.dir}`))
    } catch (e) {
        console.log(chalk.yellow('Previous version not found'))
        process.exit(1)
    }
}
