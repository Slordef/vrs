// help.js

const chalk = require('chalk')
const clear = require('clear')
const figlet = require('figlet')

module.exports = function () {
    clear();

    console.log(
        chalk.green(
            figlet.textSync('VER', {horizontalLayout: 'full'})
        )
    )
}
