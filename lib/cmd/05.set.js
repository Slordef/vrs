const change = require("../change");
const chalk = require("chalk");
module.exports = (program) => {
    program
        .command('set <version> [name]')
        .description('set service version by folder name or by version index')
        .action(fnSet)
}

function fnSet (version, name) {
    try {
        const newVersion = change(name, version)
        console.log(chalk.green(`set version ${version} applied.`))
        console.log(chalk.green(`Version : ${newVersion.dir}`))
    } catch (e) {
        if(e === 'notFound'){
            console.log(chalk.yellow('Version not found'))
        }
    }
}
