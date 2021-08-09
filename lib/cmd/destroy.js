const system = require('../system')
const chalk = require("chalk");

module.exports = function (params) {
    const name = params.list?.[1]
    const path = process.cwd()
    let lastconfig = null
    if(name) {
        lastconfig = system.rmConfig({name})
        if (lastconfig) return console.log(chalk.green(`${lastconfig.name} is removed`))
        console.log(chalk.red(`${name} doesn't exist in services`))
        return process.exit(1)
    }

    lastconfig = system.rmConfig({path})
    if (lastconfig) return console.log(chalk.green(`${lastconfig.name} is removed`))
    console.log(chalk.red(`No service found with this folder`))
    process.exit(1)
}
