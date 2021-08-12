const fs = require("fs");
module.exports = () => {
    return fs.readdirSync(`${__dirname}/cmd`)
}
