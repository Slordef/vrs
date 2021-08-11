// help.js

const chalk = require('chalk')
const clear = require('clear')
const figlet = require('figlet')

module.exports = function () {
    clear();

    console.log(chalk.green(figlet.textSync('VRS', {horizontalLayout: 'full'})))
    console.log('Wellcome to VRS help ! Thanks for using the system VRS !')
}
