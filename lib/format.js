const format = (data = {}, newVal = {}) => {
    const pwd = process.cwd()
    const name = pwd.split(/[\\|\/]+/)[pwd.split(/[\\|\/]+/).length -1]
    return {
        path: newVal.path ? newVal.path : data.path ? data.path : process.cwd(),
        name: newVal.name ? newVal.name : data.name ? data.name : `vrs-${name}`,
        config: newVal.config ? newVal.config : data.config ? data.config : 'vrs.config.json',
        useFile: newVal.useFile ? newVal.useFile : data.useFile ? data.useFile : 'none',
        file: newVal.file ? newVal.file : data.file ? data.file : '',
        conserve: newVal.conserve ? newVal.conserve : data.conserve ? data.conserve : 3,
        useRepo: newVal.useRepo ? newVal.useRepo : data.useRepo ? data.useRepo : false,
        repo: {
            path: newVal.repo ? newVal.repo.path : data.repo ? data.repo.path : './repo',
            build: newVal.repo ? newVal.repo.build : data.repo ? data.repo.build : false,
            script: newVal.repo ? newVal.repo.script : data.repo ? data.repo.script : 'build',
            copyFolder: newVal.repo ? newVal.repo.copyFolder : data.repo ? data.repo.copyFolder : './dist',
        },
        execCmd: newVal.execCmd ? newVal.execCmd : data.execCmd ? data.execCmd : false,
        before: newVal.before ? newVal.before : data.before ? data.before : '',
        after: newVal.after ? newVal.after : data.after ? data.after : '',
        logs: newVal.logs ? newVal.logs : data.logs ? data.logs : '',
        versions: newVal.versions ? newVal.versions : data.versions ? data.versions : []
    }
}
exports.format = format
