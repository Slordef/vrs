// help.js

const chalk = require('chalk')
const clear = require('clear')
const figlet = require('figlet')

module.exports = function () {
    clear();

    console.log(chalk.green(figlet.textSync('VERS', {horizontalLayout: 'full'})))
    console.log('Wellcome to vers help ! Thanks for using the system vers !')
}
