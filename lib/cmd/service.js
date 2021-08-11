const chalk = require("chalk")
const { getSystem } = require("../system")
module.exports = function (params) {
    const name = params.has(['-n']) ? params.get('-n') : null
    const pwd = process.cwd()
    const system = getSystem()

    let service
    if(name) {
        service = system.services.find(s => s.name === name)
        if (!service) return console.log(chalk.red(`Service ${name} not found`))
    }
    service = system.services.find(s => s.path === pwd)
    if (!service) return console.log(chalk.red(`Service not found in this folder`))
    console.log(chalk.underline.green(`VRS Service :\n`))
    Object.keys(service).forEach(function (k) {
        if(['versions'].includes(k)){
            console.log(`${chalk.green(k)} :`)
            service[k].forEach((v,i) => {
                console.log(`\t[${i}] ${chalk.cyan(v.dir)}${v.current?chalk.cyan(' => current'):''}`)
            })
            return
        }
        if(['repo'].includes(k)) {
            console.log(`${chalk.green(k)} :`)
            Object.keys(service[k]).forEach(r => {
                console.log(`\t${chalk.green(r)} : ${chalk.cyan(service[k][r])}`)
            })
            return
        }
        console.log(`${chalk.green(k)} : ${chalk.cyan(service[k])}`)
    })
}
