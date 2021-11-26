const chalk = require("chalk");
const moment = require("moment");
const fs = require("fs");
const fse = require("fs-extra");
const { exec, execFile } = require('child_process')
const system = require("./system");
const { twirlTimer } = require('./twirl')
const { before, after } = require('./execOnCurrent')
const { log } = require('./logs')
const {stderr} = require("chalk");

module.exports = async function (service, cmd) {
    const twirl = twirlTimer()

    await before(service, cmd)

    const lastVersion = service.versions.find(v => v.current === true)
    const version = `${moment.utc().format('YYYYMMDDHHmmss')}`
    let newVersion = {dir: version, current: true}
    const dir = `${service.path}\\versions\\${version}`
    fs.mkdirSync(dir, {recursive: true})
    if (lastVersion) lastVersion.current = false
    service.versions.push(newVersion)

    await checkForRepo(service).catch(async () => {
        await after(service, cmd)
        process.exit(1)
    });

    while (service.versions.length > service.conserve) {
        const versionToDel = service.versions[0].dir
        const pathToDel = `${service.path}\\versions\\${versionToDel}`
        if (fs.existsSync(pathToDel)) {
            fs.rmSync(pathToDel, {recursive: true, force: true})
        }
        service.versions.shift()
    }

    const curPath = `${service.path}\\current`
    if (fs.existsSync(curPath) || fs.lstatSync(curPath)) fs.unlinkSync(curPath)
    fs.symlinkSync(dir, curPath)

    switch (service.useFile) {
        case 'bash':
            await new Promise((resolve) => {
                if (!fs.existsSync(`${service.path}/${service.file}`)) return resolve()
                exec(`bash "${service.file}"`, { cwd: `${service.path}` }, (err, stderr, stdout) => {
                    console.log(err, stderr, stdout)
                    resolve()
                })
            })
            break
        case 'js':
            await new Promise((resolve) => {
                if (!fs.existsSync(`${service.path}\\${service.file}`)) return resolve()
                execFile(`${service.path}\\${service.file}`, { cwd: `${service.path}` }, (err, stderr, stdout) => {
                    console.log(err, stderr, stdout)
                    resolve()
                })
            })
            break
    }

    await after(service, cmd)
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
                if (fs.existsSync(`${service.path}\\_temp`)) fs.rmSync(`${service.path}\\_temp`, {recursive: true, force: true})
            }
            fs.mkdirSync(`${service.path}\\_temp`)
            let e_git = `git --work-tree=${service.path}\\_temp --git-dir=${service.path}/${service.repo.path} checkout -f`
            let e_build = `npm install && npm run ${service.repo.script}`

            await new Promise((res, rej) => {
                log(service, `exec: ${e_git}`)
                exec(e_git, { cwd: `${service.path}` }, (err, strderr) => {
                    if(err) log(service, err)
                    if(stderr) log(service, stderr)
                    if(stdout) log(service, stdout)
                    if(err || strderr) return rej()
                    res()
                })
            }).catch(() => {
                rb()
                reject()
            })

            await new Promise((res,rej) => {
                log(service, `exec: ${e_build}`)
                exec(e_build, { cwd: `${service.path}\\_temp` }, (err, stderr, stdout) => {
                    if(err) log(service, err)
                    if(stderr) log(service, stderr)
                    if(stdout) log(service, stdout)
                    if(err || stderr) return rej()
                    let s = service.repo.copyFolder.split(/[\\|\/]+/)
                    if (s[0] === '.') s.shift()
                    let tempDir = `${service.path}\\_temp\\${s.join('/')}`
                    let newDir = `${service.path}\\versions\\${service.versions[service.versions.length - 1].dir}`
                    fse.copySync(tempDir, newDir, { recursive: true })
                    fs.rmSync(`${service.path}\\_temp`, {recursive: true, force: true})
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
        let e_git = `git --work-tree=${service.path}\\versions\\${service.versions[service.versions.length - 1].dir} --git-dir=${service.path}\\${service.repo.path} checkout -f`
        log(service, `exec: ${e_git}`)
        exec(e_git, {}, (err, stderr, stdout) => {
            if(err) log(err)
            if(stderr) log(stderr)
            if(stdout) log(stdout)
            if(err) {
                return reject()
            }
            resolve()
        })
    })
}
