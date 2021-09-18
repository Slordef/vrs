const system = require("./system");
const chalk = require("chalk");

module.exports = function (name) {
    const sys = system.getSystem()
    let service
    if (name?.length) service = sys.services.find(c => c.name === name)
    else service = sys.services.find(c => c.path === process.cwd())
    if (!service) {
        console.error(chalk.red(`VRS service not found.`))
        process.exit(1)
        return
    }
    return service
}
