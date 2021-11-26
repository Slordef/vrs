const fs = require('fs')
const getService = require('../getService')
const chalk = require("chalk");
const { Tail } = require('tail')

module.exports = (program) => {
    program
        .command('log [name]')
        .description('get logs for service')
        .option('--clear', "clear log file")
        .action(fnLog)
}

function fnLog (name, options) {
    const service = getService(name)
    const file = `${service.path}/${service.logs}`

    if (!fs.existsSync(file)) return console.log(chalk.yellow(`No log file`))
    if(options.clear){
        fs.writeFileSync(file, '')
        return process.exit(0)
    }
    const tail = new Tail(file)
    tail.on('line', (data) => {
        console.log(data)
    })
}
