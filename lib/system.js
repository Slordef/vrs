const fs = require('fs')

function check (system) {
    const home = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME']
    let data = {}
    try {
        let p = `${home}`
        if(!fs.existsSync(p)) throw "No user folder"
        p += `/.vers`
        if(!fs.existsSync(p)) fs.mkdirSync(p)
        if(!fs.existsSync(p)) throw "vers folder don't exists and can't be created"
        p += `/vers.system.json`
        if(!fs.existsSync(p) || !!system){
            if (!system) system = fs.readFileSync(__dirname+'/system/system.type.json')
            else system = JSON.stringify(system)
            fs.writeFileSync(p, system, 'utf-8')
        }
        if(!fs.existsSync(p)) throw "vers system file don't exists and can't be created"
        data = JSON.parse(fs.readFileSync(p))
        return data
    } catch (e) {
        console.error(e)
        process.exit(1)
    }
}
function configSystem (config, rm = false) {
    const data = check()
    let last = {}
    if (rm) {
        last = data.configs.find(c => c.name === config.name || c.path === config.path)
        data.configs = data.configs.filter(c => !(c.name === config.name || c.path === config.path))
    }
    else {
        last = data.configs.find(c => c.name === config.name || c.path === config.path)
        if (!last) data.configs.push(config)
        last = config
        const index = data.configs.findIndex(c => c.path === last.path)
        if (index >= 0) data.configs[index] = last
    }
    check(data)
    return last
}

exports.getSystem = function () { return check() }
exports.saveSystem = function (system) { return check(system) }
exports.addConfig = function (config) { return configSystem(config) }
exports.setConfig = function (config) { return configSystem(config) }
exports.rmConfig = function (config) { return configSystem(config,true) }
