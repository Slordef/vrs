const treatment = require('../treatment')
const noProcess = require('../noprocess')
const getService = require('../getService')

module.exports = (program) => {
    program
        .command('new [name]')
        .description('create a new version for the service. \'-np\' for no process')
        .option('-np, --no-process', 'run process background, stop main process')
        .action(fnNew)
}

function fnNew (name, options) {
    if(!options.process) return noProcess(['new',name])
    const service = getService()
    treatment(service, 'new').then()
}
