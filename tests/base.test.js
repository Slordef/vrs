const { expect } = require('chai')
const { execute, DOWN, ENTER, SPACE } = require('./process')
const fs = require("fs");

describe('Test all cmd', function () {
    this._timeout = 20000
    before((done) => {
        if(!fs.existsSync(__dirname+'/servertest')) fs.mkdirSync(__dirname+'/servertest')
        done()
    })
    beforeEach(async () => {
        await new Promise(res => { setTimeout(() => { res() },1000) })
    })
    it("should show nothing with cmd test", (done) => {
        execute(['test']).then(result => {
            expect(result).to.contain('nothing to do...')
            done()
        })
    })
    it("should initialize default service", (done) => {
        execute(['init'], [ENTER,ENTER,ENTER,ENTER,ENTER,ENTER,ENTER]).then(result => {
            expect(result).to.contain('VRS initialized for :')
            done()
        })
    })
    it("should return service information", (done) => {
        execute(['service']).then(result => {
            expect(result).to.contain.all.string(
                'VRS Service :', 'path', 'name', 'versions', '=> current'
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
