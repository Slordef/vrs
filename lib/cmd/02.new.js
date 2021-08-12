const system = require('../system')
const chalk = require("chalk")
const treatment = require('../treatment')
const noProcess = require('../noprocess')

module.exports = (program) => {
    program
        .command('new [name]')
        .description('create a new version for the service. \'-np\' for no process')
        .option('-np, --no-process', 'run process background, stop main process')
        .action(fnNew)
}

function fnNew (name, options) {
    if(!options.process) return noProcess(['new',name])
    const sys = system.getSystem()
    let service
    if (name?.length) service = sys.services.find(c => c.name === name)
    else service = sys.services.find(c => c.path === process.cwd())
    if (!service) {
        console.error(chalk.red(`VRS service not found.`))
        process.exit(1)
        return
    }

    treatment(service).then()
}
