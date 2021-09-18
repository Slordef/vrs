const { expect } = require('chai')
const { execute, DOWN, ENTER, SPACE } = require('./process')
const fs = require("fs");
const { exec } = require('child_process')

describe("Test Service with repository", function () {
    this._timeout = 20000

    before(async (done) => {
        if(!fs.existsSync(__dirname+'/servertest')) fs.mkdirSync(__dirname+'/servertest')
        done()
    })
    beforeEach(async () => {
        await new Promise(res => { setTimeout(() => { res() },1000) })
    })
    it("should create repository for git", (done) => {
        if(fs.existsSync(__dirname+'/servertest/repo')) return done(new Error('repo exists'))
        const git = 'https://github.com/Slordef/app-test-node.git'
        exec('git --help', {}, (e,r,o) => {
            console.log(e,r,o)
            expect(e).to.be.null
            if (e) done('Error')

            const child = exec(`git clone --bare ${git} repo`, { cwd: __dirname+'/servertest'}, (err, stderr, stdout) => {
                console.log(err,stderr, stdout)
                if (err || stderr) done('Error')
            })
            child.on('exit', () => {
                console.log('test')
                done()
            })
        })
    })
    it("should initialize service with repo", (done) => {
        execute(['init'], [ENTER,ENTER,ENTER,ENTER,'y',ENTER,ENTER,ENTER,ENTER,ENTER]).then(result => {
            expect(result).to.contain('VRS initialized for :')
            done()
        })
    })
    it("should return service information", (done) => {
        execute(['service']).then(result => {
            expect(result).to.contain.all.string(
                'VRS Service :', 'path', 'name', 'versions', 'repo', '=> current'
            )
            done()
        })
    })
    it("should create a new version", (done) => {
        execute(['new']).then(result => {
            expect(result).to.contain('VRS : New Version')
            done()
        })
    })
    it("should rollback to first version", (done) => {
        execute(['rollback']).then(result => {
            expect(result).to.contain('Previous version applied')
            done()
        })
    })
    it("should delete service", (done) => {
        execute(['delete'],[DOWN, SPACE, DOWN, SPACE, ENTER]).then(result => {
            expect(result).to.contain.all.string(
                'versions folder with content files are removed',
                'config file is removed',
                'is removed from services'
            )
            done()
        })
    })
    after(() => {
        if(fs.existsSync(__dirname+'/servertest')) fs.rmdirSync(__dirname+'/servertest', { recursive:true })
    })
})
