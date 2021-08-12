const cmd = require('./cmd')
const { program } = require('commander')

exports.execute = function () {
    cmd(program)
    program.parse(process.argv)
}
