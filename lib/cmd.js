const cmdList = require('./cmd-list')
const chalk = require("chalk");
const figlet = require("figlet");
const pkg = require('../package.json')

module.exports = function (program) {
    program
        .version(pkg.version, '-v, --version', 'output the current version')
        .usage('[cmd]')
    program.addHelpText('beforeAll', chalk.green(figlet.textSync('VRS', {horizontalLayout: 'full'})))
    program.addHelpText('beforeAll', chalk.green(`Versioning and Rollback Service`))
    cmdList().forEach(file => {
        const cmd = require(`${__dirname}/cmd/${file}`)
        cmd(program)
    })
}
