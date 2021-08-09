const { exec } = require('child_process')
module.exports = function (params) {
    const pwd = process.cwd()
    exec('dir', { cwd: pwd }, (err, stdout, stderr) => {
        console.log('err : \n', err, '\n\n')
        console.log('stdout : \n', stdout, '\n\n')
        console.log('stderr : \n', stderr, '\n\n')
    })
}
