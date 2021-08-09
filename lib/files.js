const fs = require('fs')
const path = require('path')

module.exports = {
    getBaseDir: () => {
        return path.basename(process.cwd())
    },
    dirExists: (filePath) => {
        return fs.existsSync(filePath)
    }
}
