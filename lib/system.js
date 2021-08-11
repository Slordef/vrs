const fs = require('fs')

function catchError (reason) {
    console.error(reason)
    process.exit(1)
}

function system (config) {
    const home = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME']
    let p = `${home}`
    if(!fs.existsSync(p)) catchError("No user folder")
    p += `/.vrs`
    if(!fs.existsSync(p)) fs.mkdirSync(p)
    if(!fs.existsSync(p)) catchError("VRS folder don't exists and can't be created")
    p += `/vrs.system.json`
    if(!fs.existsSync(p) || !!config){
        if (!config) config = fs.readFileSync(__dirname+'/system/system.type.json')
        else config = JSON.stringify(config)
        fs.writeFileSync(p, config, 'utf-8')
    }
    if(!fs.existsSync(p)) catchError("VRS system file don't exists and can't be created")
    return JSON.parse(fs.readFileSync(p, { encoding: 'utf8' }))
}
function service (config, rm = false) {
    const data = system()
    let last = {}
    if (rm) {
        last = data.services.find(c => c.name === config.name || c.path === config.path)
        data.services = data.services.filter(c => !(c.name === config.name || c.path === config.path))
    }
    else {
        last = data.services.find(c => c.name === config.name || c.path === config.path)
        if (!last) data.services.push(config)
        last = config
        const index = data.services.findIndex(c => c.path === last.path)
        if (index >= 0) data.services[index] = last
    }
    system(data)
    return last
}

exports.getSystem = function () { return system() }
exports.saveSystem = function (config) { return system(config) }
exports.setService = function (config) { return service(config) }
exports.rmService = function (config) { return service(config,true) }
