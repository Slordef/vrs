const { program } = require('commander')

module.exports = function () {
    console.log(program.opts())
}
