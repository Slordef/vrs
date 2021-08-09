const system = require('../system')
const fs = require("fs");
const chalk = require("chalk")
const treatment = require('../treatment')

module.exports = async function (params) {
    const sys = system.getSystem()
    const name = params.get('new')
    let verConfig = null
    if (name?.length) verConfig = sys.configs.find(c => c.name === name)
    else verConfig = sys.configs.find(c => c.path === process.cwd())
    if (!verConfig) {
        console.error(chalk.red(`Ver service not found.`))
        process.exit(1)
        return
    }

    const {path, config} = verConfig
    let infos
    try {
        const infosRead = fs.readFileSync(`${path}/${config}`)
        infos = JSON.parse(infosRead)
    } catch (e) {
        console.log(chalk.red("Configuration file seems to be corrupted."))
        process.exit(1)
        return
    }
    treatment(infos)
}
