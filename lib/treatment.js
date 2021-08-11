const chalk = require("chalk");
const moment = require("moment");
const fs = require("fs");
const fse = require("fs-extra");
const { exec } = require('child_process')
const system = require("./system");

module.exports = async function (service) {
    const twirl = twirlTimer()

    if (service.before?.length > 0) exec(service.before, {cwd: service.path})

    const lastVersion = service.versions.find(v => v.current === true)
    const version = `${moment.utc().format('YYYYMMDDHHmmss')}`
    let newVersion = {dir: version, current: true}
    const dir = `${service.path}/versions/${version}`
    fs.mkdirSync(dir, {recursive: true})
    if (lastVersion) lastVersion.current = false
    service.versions.push(newVersion)
    if (fs.existsSync(`${service.path}/current`)) fs.unlinkSync(`${service.path}/current`)
    fs.symlinkSync(dir, `${service.path}/current`, 'junction')

    switch (service.useFile) {
        case 'bash':
            break
        case 'js':
            break
    }

    await checkForRepo(service).catch(() => {
        if (service.after?.length > 0) exec(service.after, { cwd: path })
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

    if (service.after?.length > 0) exec(service.after)
    system.setService(service)

    clearInterval(twirl)
    process.stdout.write("\r")
    console.log(chalk.underline.green("Vers : New Version"))
    console.log(chalk.green(`current : ${dir}`))
}

function checkForRepo (service) {
    if (!service.useRepo) return new Promise(resolve => {resolve()})
    if (service.repo.build) {
        return new Promise((resolve, reject) => {
            function rb () {
                if (fs.existsSync(`${service.path}/_temp`)) fs.rmSync(`${service.path}/_temp`, {recursive: true, force: true})
            }
            fs.mkdirSync(`${service.path}/_temp`)
            let e_git = `git --work-tree=${service.path}/_temp --git-dir=${service.path}/${service.repo.path} checkout -f`
            let e_build = `npm install && npm run ${service.repo.script}`
            function r_build (err) {
                if (err) {
                    rb()
                    return reject()
                }
                let s = service.repo.copyFolder.split(/[\\|\/]+/)
                if (s[0] === '.') s.shift()
                let tempDir = `${service.path}/_temp/${s.join('/')}`
                let newDir = `${service.path}/versions/${service.versions[service.versions.length - 1].dir}`
                fse.copySync(tempDir, newDir, { recursive: true })
                fs.rmSync(`${service.path}/_temp`, {recursive: true, force: true})
                resolve()
            }
            function r_git (err) {
                if(err){
                    rb()
                    return reject()
                }
                exec(e_build, { cwd: `${service.path}/_temp` }, r_build)
            }
            exec(e_git, { cwd: `${service.path}` }, r_git)
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
