const chalk = require("chalk");
const moment = require("moment");
const fs = require("fs");
const fse = require("fs-extra");
const { exec } = require('child_process')
const {setConfig} = require("./system");

module.exports = async function (infos) {
    const { path, config } = infos
    const twirl = twirlTimer()

    if (infos.before?.length > 0) exec(infos.before, {cwd: path})

    const lastvers = infos.versions.find(v => v.current === true)
    const vers = `${moment.utc().format('YYYYMMDDHHmmss')}`
    let newElem = {dir: vers, current: true}
    const dir = `${path}/versions/${vers}`
    fs.mkdirSync(dir, {recursive: true})
    if (lastvers) lastvers.current = false
    infos.versions.push(newElem)
    if (fs.existsSync(`${path}/current`)) fs.unlinkSync(`${path}/current`)
    fs.symlinkSync(dir, `${path}/current`, 'junction')

    switch (infos.useFile) {
        case 'bash':
            break
        case 'js':
            break
        case 'none':
            await checkForRepo(infos).catch(() => {
                if (infos.after?.length > 0) exec(infos.after, { cwd: path })
                process.exit(1)
            });
            break
    }

    while (infos.versions.length > infos.conserve) {
        const versionToDel = infos.versions[0].dir
        const pathToDel = `${path}/versions/${versionToDel}`
        if (fs.existsSync(pathToDel)) {
            fs.rmSync(pathToDel, {recursive: true, force: true})
        }
        infos.versions.shift()
    }

    if (infos.after?.length > 0) exec(infos.after)
    setConfig(infos)

    clearInterval(twirl)
    process.stdout.write("\r")
    console.log(chalk.underline.green("Vers : New Version"))
    console.log(chalk.green(`current : ${dir}`))
}

function checkForRepo (infos) {
    if (!infos.repo) return new Promise(resolve => {resolve()})
    if (infos.repo.build) {
        return new Promise((resolve, reject) => {
            function rb () {
                if (fs.existsSync(`${infos.path}/_temp`)) fs.rmSync(`${infos.path}/_temp`, {recursive: true, force: true})
            }
            fs.mkdirSync(`${infos.path}/_temp`)
            let e_git = `git --work-tree=${infos.path}/_temp --git-dir=${infos.path}/${infos.repo.path} checkout -f`
            let e_build = `npm install && npm run ${infos.repo.script}`
            function r_build (err) {
                if (err) {
                    rb()
                    return reject()
                }
                let s = infos.repo.copyFolder.split(/(\\|\/)+/)
                if (s[0] === '.') s.shift()
                let tempdir = `${infos.path}/_temp/${s.join('/')}`
                let newdir = `${infos.path}/versions/${infos.versions[infos.versions.length - 1].dir}`
                fse.copySync(tempdir, newdir, { recursive: true })
                fs.rmSync(`${infos.path}/_temp`, {recursive: true, force: true})
                resolve()
            }
            function r_git (err) {
                if(err){
                    rb()
                    return reject()
                }
                exec(e_build, { cwd: `${infos.path}/_temp` }, r_build)
            }
            exec(e_git, { cwd: `${infos.path}` }, r_git)
        })
    }
    return new Promise((resolve, reject) => {
        let e_git = `git --work-tree=${infos.path}/versions/${infos.versions[infos.versions.length - 1].dir} --git-dir=${infos.path}/${infos.repo.path} checkout -f`
        exec(e_git, {}, (err, stdout, stderr) => {
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
