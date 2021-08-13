const chalk = require("chalk");
const moment = require("moment");
const fs = require("fs");
const fse = require("fs-extra");
const { exec } = require('child_process')
const system = require("./system");

module.exports = async function (service) {
    const twirl = twirlTimer()

    const doExec = (code) => {
        return new Promise((resolve) => {
            exec(code, {cwd: service.path}, () => { resolve() })
        })
    }

    if (service.before?.length) await doExec(service.before)
    if (service.config?.length) {
        const config = require(`${service.path}/${service.config}`)
        if (config?.before) await doExec(config.before)
    }

    const lastVersion = service.versions.find(v => v.current === true)
    const version = `${moment.utc().format('YYYYMMDDHHmmss')}`
    let newVersion = {dir: version, current: true}
    const dir = `${service.path}/versions/${version}`
    fs.mkdirSync(dir, {recursive: true})
    if (lastVersion) lastVersion.current = false
    service.versions.push(newVersion)

    switch (service.useFile) {
        case 'bash':
            break
        case 'js':
            break
    }

    await checkForRepo(service).catch(async () => {
        if (service.after?.length) await doExec(service.after)
        if (service.config?.length) {
            const config = require(`${service.path}/${service.config}`)
            if (config?.after) await doExec(config.after)
        }
        process.exit(1)
    });

    while (service.versions.length > service.conserve) {
        const versionToDel = service.versions[0].dir
        const pathToDel = `${service.path}/versions/${versionToDel}`
        if (fs.existsSync(pathToDel)) {
            fs.rmSync(pathToDel, {recursive: true, force: true})
        }
        service.versions.shift()
    }

    if (fs.existsSync(`${service.path}/current`)) fs.unlinkSync(`${service.path}/current`)
    fs.symlinkSync(dir, `${service.path}/current`, 'junction')

    if (service.after?.length) await doExec(service.after)
    if (service.config?.length) {
        const config = require(`${service.path}/${service.config}`)
        if (config?.after) await doExec(config.after)
    }
    system.setService(service)

    clearInterval(twirl)
    process.stdout.write("\r")
    console.log(chalk.underline.green("VRS : New Version"))
    console.log(chalk.green(`current : ${dir}`))
}

function checkForRepo (service) {
    if (!service.useRepo) return Promise.resolve()
    if (service.repo.build) {
        return new Promise(async (resolve, reject) => {
            function rb () {
                if (fs.existsSync(`${service.path}/_temp`)) fs.rmSync(`${service.path}/_temp`, {recursive: true, force: true})
            }
            fs.mkdirSync(`${service.path}/_temp`)
            let e_git = `git --work-tree=${service.path}/_temp --git-dir=${service.path}/${service.repo.path} checkout -f`
            let e_build = `npm install && npm run ${service.repo.script}`

            await new Promise((res, rej) => {
                exec(e_git, { cwd: `${service.path}` }, (err, strderr) => {
                    if(err || strderr) return rej()
                    res()
                })
            }).catch(() => {
                rb()
                reject()
            })

            await new Promise((res,rej) => {
                exec(e_build, { cwd: `${service.path}/_temp` }, (err, stderr) => {
                    if(err || stderr) return rej()
                    let s = service.repo.copyFolder.split(/[\\|\/]+/)
                    if (s[0] === '.') s.shift()
                    let tempDir = `${service.path}/_temp/${s.join('/')}`
                    let newDir = `${service.path}/versions/${service.versions[service.versions.length - 1].dir}`
                    fse.copySync(tempDir, newDir, { recursive: true })
                    fs.rmSync(`${service.path}/_temp`, {recursive: true, force: true})
                    res()
                    resolve()
                })
            }).catch(() => {
                rb()
                reject()
            })
        })
    }
    return new Promise((resolve, reject) => {
        let e_git = `git --work-tree=${service.path}/versions/${service.versions[service.versions.length - 1].dir} --git-dir=${service.path}/${service.repo.path} checkout -f`
        exec(e_git, {}, (err) => {
            if(err) {
                return reject()
            }
            resolve()
        })
    })
}

function twirlTimer () {
    var P = ["\\", "|", "/", "-"]
    var x = 0
    return setInterval(function() {
        process.stdout.write("\r" + P[x++])
        x &= 3
    }, 250)
}
