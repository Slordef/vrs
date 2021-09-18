const system = require("./system");
const chalk = require("chalk");
const fs = require("fs");
const { twirlTimer } = require('./twirl')
const { after, before } = require('./execOnCurrent')

module.exports = async function (name, set, del = false) {
    const twirl = twirlTimer()
    const pwd = process.cwd()

    const sys = system.getSystem()
    const service = sys.services.find(s => s.name === name || s.path === pwd)
    if(!service){
        console.log(chalk.red(`Service not found.`))
        process.exit(1)
    }

    const lastVersion = service.versions.find(v => v.current)
    const lastIndex = service.versions.findIndex(v => v.dir === lastVersion.dir)
    let newIndex = -1
    let newVersion

    switch (typeof set) {
        case "number":
            newVersion = service.versions ? service.versions[lastIndex + set] : undefined
            if(!newVersion) throw `notFound`
            newIndex = service.versions.findIndex(v => v.dir === newVersion.dir)
            break
        case 'string':
            newVersion = service.versions.find(v => v.dir === set)
            if(!newVersion) newVersion = service.versions ? service.versions[set] : undefined
            if(!newVersion) throw `notFound`
            newIndex = service.versions.findIndex(v => v.dir === newVersion.dir)
            break
    }

    await before(service,'change')

    if (del){
        service.versions = service.versions.filter(v => !v.current)
        fs.rmSync(`${service.path}/versions/${lastVersion.dir}`, {recursive: true, force: true})
    }
    const current = `${service.path}/current`
    if (fs.existsSync(current)) fs.unlinkSync(current)
    fs.symlinkSync(`${service.path}/versions/${newVersion.dir}`, current, 'junction')
    if (lastVersion) lastVersion.current = false
    newVersion.current = true

    await after(service, 'change')

    system.setService(service)
    clearInterval(twirl)
    process.stdout.write("\r")
    return newVersion
}
