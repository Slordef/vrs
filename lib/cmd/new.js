const system = require('../system')
const fs = require("fs");
const chalk = require("chalk")
const treatment = require('../treatment')

module.exports = async function (params) {
    const sys = system.getSystem()
    const name = params.has(['-n']) ? params.get('-n') : null
    let infos = null
    if (name?.length) infos = sys.configs.find(c => c.name === name)
    else infos = sys.configs.find(c => c.path === process.cwd())
    if (!infos) {
        console.error(chalk.red(`Vers service not found.`))
        process.exit(1)
        return
    }

    treatment(infos)
}
