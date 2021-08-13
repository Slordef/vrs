const moment = require('moment')
const fs = require('fs')

function log (service, log) {
    const now = moment().format('YYYY-MM-DD[/]HH:mm:ss:SSS')
    const msg = `[${now}]:\n${log}\n`
    const file = service?.logs
    if(file) {
        if(!fs.existsSync(file)) fs.writeFileSync(file, '')
        fs.appendFileSync(file, msg)
    }
}

module.exports = { log }
