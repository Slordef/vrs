const system = require("./system");
const chalk = require("chalk");
const fs = require("fs");

module.exports = function (name, set, del = false) {
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
            newVersion = service.versions?.[lastIndex + set]
            if(!newVersion) throw `notFound`
            newIndex = service.versions.findIndex(v => v.dir === newVersion.dir)
            break
        case 'string':
            newVersion = service.versions.find(v => v.dir === set)
            if(!newVersion) newVersion = service.versions?.[set]
            if(!newVersion) throw 'notFound'
            newIndex = service.versions.findIndex(v => v.dir === newVersion.dir)
            break
    }

    if (del){
        service.versions = service.versions.filter(v => !v.current)
        fs.rmSync(`${service.path}/versions/${lastVersion.dir}`, {recursive: true, force: true})
    }
    const current = `${service.path}/current`
    fs.unlinkSync(current)
    fs.symlinkSync(`${service.path}/versions/${newVersion.dir}`, current, 'junction')
    if (lastVersion) lastVersion.current = false
    newVersion.current = true

    system.setService(service)
    return newVersion
}