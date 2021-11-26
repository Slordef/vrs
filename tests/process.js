const { spawn } = require('child_process')

function createProcess(args = []) {
    const env = {NODE_ENV: 'test'}
    return spawn(`node`, ['../../bin/vrs.js', ...args], { env, cwd: __dirname+'/servertest' })
}

function execute(args = [], inputs = []) {
    return new Promise(async (resolve) => {
        const childProcess = createProcess(args)
        childProcess.stdin.setDefaultEncoding('utf8')

        const oc = function (data) {
            console.log(data.toString())
            oc.data += data.toString()
        }
        oc.data = ''

        childProcess.on('error', (error) => {
            resolve(error)
        })
        childProcess.stderr.on('data', data => { oc(data) })
        childProcess.stdout.on('data', data => { oc(data) })

        const sendKeys = async inps => {
            if (inps.length) {
                await inps.reduce((previousPromise, inp) =>
                    new Promise(async res => {
                        if (previousPromise) await previousPromise
                        console.log('write', inp)
                        setTimeout(() => {
                            childProcess.stdin.write(inp)
                            res()
                        }, 300)
                    }),
                    null
                )
            }
            childProcess.stdin.end()
        }

        await sendKeys(inputs)
        childProcess.on('close', () => {
            resolve(oc.data)
        })
    })
}

exports.execute = execute
exports.DOWN = "\x1B\x5B\x42";
exports.UP = "\x1B\x5B\x41";
exports.ENTER = "\x0D";
exports.SPACE = "\x20";
