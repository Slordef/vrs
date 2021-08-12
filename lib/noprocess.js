const {spawn} = require("child_process");
const chalk = require("chalk");

module.exports = function (cmd) {
    const child = spawn('vrs', cmd, { cwd: process.cwd(), detached:true, stdio:'ignore', shell: (process.platform === 'win32'), windowsHide: true })
    child.unref()
    console.log(chalk.green(`VRS cmd with no progress running : ${chalk.cyan(['vrs',...cmd].join(' '))}`))
}
