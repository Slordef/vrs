const change = require("../change");
const chalk = require("chalk");
const noProcess = require("../noprocess");
module.exports = (program) => {
    program
        .command('set <version> [name]')
        .description('set service version by folder name or by version index')
        .action(fnSet)
}

async function fnSet (version, name) {
    if(!options.process) return noProcess(['set',version,name])
    try {
        const newVersion = await change(name, version)
        console.log(chalk.green(`set version ${version} applied.`))
        console.log(chalk.green(`Version : ${newVersion.dir}`))
    } catch (e) {
        console.log(chalk.yellow('Version not found'))
        process.exit(1)
    }
}
