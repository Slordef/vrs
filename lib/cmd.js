const help = require('./cmd/help')
const init = require('./cmd/init')
const test = require('./cmd/test')
const destroy = require('./cmd/destroy')
const newver = require('./cmd/new')
const rollback = require('./cmd/rollback')
const system = require('./cmd/cmd-system')
const cmd_list = require('./cmd-list')
const chalk = require("chalk");

const launch = function (cmd, params) {
    switch (cmd) {
        case 'help': help(params); break
        case 'init': init(params); break
        case 'test': test(params); break
        case '--system-get': system.get(params); break
        case '--system-set': system.set(params); break
        case 'del':
        case 'destroy': destroy(params); break
        case 'new': newver(params); break
        case 'rb':
        case 'rollback': rollback(params); break
        case 'fw':
        case 'forward': rollback(params, true); break
        default:
            console.log(`Command not found: ${cmd}`)
            console.log(`Commands can be type like this : ${chalk.green(`ver [param[...]] [option[...]]`)} like ${chalk.green(`ver --help`)}`)
    }
}

module.exports = function (params) {
    if(params.empty) return console.log(`Commands can be type like this : ${chalk.green(`ver [param[...]] [option[...]]`)} like ${chalk.green(`ver --help`)}`)
    for (let i = 0; i < cmd_list.length; i++) {
        let c = cmd_list[i]
        if (params.has(c.list)) {
            return launch(c.name, params)
        }
    }
    launch(params.list[0], params)
}