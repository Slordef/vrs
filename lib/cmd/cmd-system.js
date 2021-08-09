const system = require('../system')
const chalk = require("chalk");

exports.get = function (params) {
    const what = params.get('--system-get')
    const data = system.getSystem()
    switch (what) {
        case 'config':
        case 'configs':
        case 'configuration':
        case 'conf':
            if (data.configs.length <= 0) console.log(chalk.cyan('No config. Type -h for more information of how to setup new ver'))
            else console.log(chalk.cyan(data.configs.map(c => `${c.name}\t=>\t${c.path}`).join('\n')))
            break
        default:
            console.log(chalk.underline.cyan('Configurations :'))
            console.log(chalk.cyan(data.configs.map(c => `${c.name}\t=>\t${c.path}`).join('\n')))
    }
}
exports.set = function (params) {
    console.error(chalk.red("System : you're not allowed for this command"))
}
