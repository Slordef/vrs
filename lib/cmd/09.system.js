const system = require('../system')
const chalk = require("chalk");

module.exports = (program) => {
    program
        .command('system-get')
        .description('get system information and configuration')
        .action(fnSystem)
}

function fnSystem () {
    const data = system.getSystem()

    console.log(chalk.underline.green('VRS Services :'))
    if (data.services.length <= 0) console.log(chalk.green('No config. Type -h for more information of how to setup new VRS'))
    else data.services.forEach(c =>{ console.log(chalk.green(`${c.name}\t=>\t${c.path}`)) })
}
