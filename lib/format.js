const format = (data = {}, newVal = {}) => {
    const pwd = process.cwd()
    const name = pwd.split(/[\\|\/]+/)[pwd.split(/[\\|\/]+/).length -1]
    return {
        path: newVal.path ?? data.path ?? process.cwd(),
        name: newVal.name ?? data.name ?? `vrs-${name}`,
        config: newVal.config ?? data.config ?? '',//'vrs.config.json',
        useFile: newVal.useFile ?? data.useFile ?? 'none',
        file: newVal.file ?? data.file ?? '',
        conserve: newVal.conserve ?? data.conserve ?? 3,
        useRepo: newVal.useRepo ?? data.useRepo ?? false,
        repo: {
            path: newVal.repo ? newVal.repo.path : undefined ?? data.repo ? data.repo.path : undefined ?? './repo',
            build: newVal.repo ? newVal.repo.build : undefined ?? data.repo ? data.repo.build : undefined ?? false,
            script: newVal.repo ? newVal.repo.script : undefined ?? data.repo ? data.repo.script : undefined ?? 'build',
            copyFolder: newVal.repo ? newVal.repo.copyFolder : undefined ?? data.repo ? data.repo.copyFolder : undefined ?? './dist',
        },
        execCmd: newVal.execCmd ?? data.execCmd ?? false,
        before: newVal.before ?? data.before ?? '',
        after: newVal.after ?? data.after ?? '',
        logs: newVal.logs ?? data.logs ?? '',
        versions: newVal.versions ?? data.versions ?? []
    }
}
exports.format = format
