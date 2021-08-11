const parse = require('./parse')
const cmd = require('./cmd')

exports.execute = function (args) {
    const params = parse(args)
    cmd(params)
}
