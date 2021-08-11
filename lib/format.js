const format = (data = {}, newVal = {}) => {
    const pwd = process.cwd()
    const name = pwd.split(/[\\|\/]+/)[pwd.split(/[\\|\/]+/).length -1]
    return {
        path: newVal.path ?? data.path,
        name: newVal.name ?? data.name ?? `vers-${name}`,
        config: newVal.config ?? data.config ?? '',//'vers.config.json',
        useFile: newVal.useFile ?? data.useFile ?? 'none',
        file: newVal.file ?? data.file ?? '',
        conserve: newVal.conserve ?? data.conserve ?? 3,
        useRepo: newVal.useRepo ?? data.useRepo ?? false,
        repo: {
            path: newVal.repo?.path ?? data.repo?.path ?? './repo',
            build: newVal.repo?.build ?? data.repo?.build ?? false,
            script: newVal.repo?.script ?? data.repo?.script ?? 'build',
            copyFolder: newVal.repo?.copyFolder ?? data.repo?.copyFolder ?? './dist',
        },
        execCmd: newVal.execCmd ?? data.execCmd ?? false,
        before: newVal.before ?? data.before ?? '',
        after: newVal.after ?? data.after ?? '',
    }
}
exports.format = format
