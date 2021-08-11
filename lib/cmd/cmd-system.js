const system = require('../system')
const chalk = require("chalk");

exports.get = function (params) {
    const what = params.get('--system-get')
    const data = system.getSystem()
    switch (what) {
        default:
            console.log(chalk.underline.green('Vers Services :'))
            if (data.services.length <= 0) console.log(chalk.green('No config. Type -h for more information of how to setup new vers'))
            else data.services.forEach(c =>{ console.log(chalk.green(`${c.name}\t=>\t${c.path}`)) })
    }
}
exports.set = function () {
    console.error(chalk.red("System : you're not allowed for this command"))
}
