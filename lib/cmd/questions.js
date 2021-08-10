const chalk = require("chalk");
const fs = require('fs')

module.exports = function (infos) {
    return [
        {
            name: 'name',
            type: 'input',
            message: 'Enter the name of versioning service:',
            default: infos.name,
            validate: function ( value ) {
                if(value.length) return true
                if(sys.configs.find(c => c.name === value)) return `Service name "${value}" already exist. Please choose another.`
                return 'Please enter valid name for versioning service.'
            }
        },
        {
            name: 'config',
            type: "input",
            message: "File name of vers configuration:",
            default: infos.config,
            validate: function ( value ) {
                if (!value.length) return "Configuration file is required."
                if (value === 'json') return "Configuration file must be a .json file."
                if (value.split('.')[value.split('.').length - 1] !== 'json') return "Configuration file must be a .json file."
                if (!value.split('.')[0].length) return "Configuration file must be a .json file with a valid name."
                return true
            }

        },
        {
            name: 'useFile',
            type: "list",
            message: "Would use a file for new version? :",
            default: infos.useFile,
            choices: ['none','bash','js']
        },
        {
            name: 'file',
            type: 'input',
            message: "Name of the used file for new version :",
            default: current => {
                if(infos.file.length) return infos.file
                switch (current.useFile) {
                    case 'bash': return 'vers.sh'
                    case 'js': return 'vers.js'
                }
                return ''
            },
            validate: function ( value, current ) {
                if (!value.length) return "Used file is required."
                if(current.useFile === 'js') {
                    if (value === 'js') return "Used file must be a .js file."
                    if (value.split('.')[value.split('.').length - 1] !== 'js') return "Used file must be a .js file."
                    if (!value.split('.')[0].length) return "Used file must be a .js file with a valid name."
                }
                return true
            },
            when: (current) => current.useFile !== 'none'
        },
        {
            name: 'conserve',
            type: 'number',
            message: "Amount of versions conservation? :",
            default: infos.conserve
        },
        {
            name: 'useRepo',
            type: 'confirm',
            message: "Using a local git repository? :",
            default: infos.useRepo,
            when: current => current.useFile === 'none'
        },
        {
            name: 'repo',
            type: 'input',
            message: "Path to the local git repository (relative to init folder) :",
            default: infos.repo,
            when: current => current.useRepo,
            validate: value => {
                if (!value.length) return "Please set a valid repository path."
                if (!fs.existsSync(`${infos.path}/${value}`)) return `Seems the path is not valid :\n${infos.path}/${value} not corresponding of a folder.`
                return true
            }
        },
        {
            name: 'build',
            type: 'confirm',
            message: "Do we build the repo? :",
            default: infos.build,
            when: current => current.useRepo
        },
        {
            name: 'script',
            type: 'input',
            message: `NPM script to use for build (npm run ${chalk.cyan("script")}):`,
            default: infos.script,
            when: current => current.build
        },
        {
            name: 'copyFolder',
            type: 'input',
            message: "Folder location we copy to the current app folder (relative to the temp folder) :",
            default: current => {
                if(infos.copyFolder.length) return infos.copyFolder
                return current.build ? "./dist" : '.'
            },
            when: current => current.useRepo
        },
        {
            name: 'execCmd',
            type: 'confirm',
            message: "Would use execute cmd line before and after? :",
            default: !!infos.execCmd
        },
        {
            name: 'before',
            type: 'input',
            message: "Do we execute a cmd before versioning (exec cmd, caution):",
            default: '',
            when: current => {
                if (infos.before?.length) return infos.before
                return current.execCmd
            }
        },
        {
            name: 'after',
            type: 'input',
            message: "Do we execute a cmd after versioning (exec cmd, caution):",
            default: '',
            when: current => {
                if (infos.after?.length) return infos.after
                return current.execCmd
            }
        }
    ]
}
