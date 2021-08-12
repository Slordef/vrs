module.exports = (program) => {
    program
        .command('test')
        .description('do Nothing, i guess...')
        .action(fnTest)
}

function fnTest () {
    console.log('nothing to do...')
}
