const { exec } = require("child_process")
const { log } = require('./logs')

function doExec (code,service) {
    return new Promise((resolve) => {
        log(service, `exec: ${code}`)
        const child = exec(code, {cwd: `${service.path}/current`}, (err,stderr,stdout) => {
            if(err) log(service, err)
            if(stderr) log(service, stderr)
            if(stdout) log(service, stdout)
        })
        child.on('close', () => {
            log(service, `exec: done`)
            resolve()
        })
    })
}

const before = async function (service, cmd) {
    if (service.before?.length) await doExec(service.before, service)
    if (service.config?.length) {
        const config = require(`${service.path}/${service.config}`)
        if (config?.[cmd]?.before) await doExec(config[cmd].before, service)
    }
}
const after = async function (service, cmd) {
    if (service.after?.length) await doExec(service.after, service)
    if (service.config?.length) {
        const config = require(`${service.path}/${service.config}`)
        if (config?.[cmd]?.after) await doExec(config[cmd].after, service)
    }
}

module.exports = { after, before }
