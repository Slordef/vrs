const change = require("../change");
const chalk = require("chalk");
const noProcess = require('../noprocess')


module.exports = (program) => {
    program
        .command('forward [name]')
        .alias('fw')
        .description('set to the next version')
        .option('-np, --no-process', 'run process background, stop main process')
        .action(fnForward)
}

function fnForward (name, options) {
    if(!options.process) return noProcess(['fw',name])
    try {
        const newVersion = change(name, 1)
        console.log(chalk.green(`Next version applied.`))
        console.log(chalk.green(`Version : ${newVersion.dir}`))
    } catch (e) {
        if(e === 'notFound'){
            console.log(chalk.yellow('Next version not found'))
        }
    }
}
