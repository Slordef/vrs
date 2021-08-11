const system = require('../system')
const chalk = require("chalk")
const treatment = require('../treatment')

module.exports = function (params) {
    const sys = system.getSystem()
    const name = params.has(['-n']) ? params.get('-n') : null
    let service
    if (name?.length) service = sys.services.find(c => c.name === name)
    else service = sys.services.find(c => c.path === process.cwd())
    if (!service) {
        console.error(chalk.red(`VRS service not found.`))
        process.exit(1)
        return
    }

    treatment(service)
}
