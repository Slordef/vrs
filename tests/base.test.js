const { expect } = require('chai')
const { execute, DOWN, ENTER, SPACE } = require('./process')
const fs = require("fs");
const moment = require("moment");

describe('Test all cmd', function () {
    const dir = __dirname+'\\servertest'
    this._timeout = 20000
    let first = ''
    before((done) => {
        if(!fs.existsSync(dir)) fs.mkdirSync(dir)
        done()
    })
    beforeEach(async () => {
        await new Promise(res => { setTimeout(() => { res() },200) })
    })
    it("should show nothing with cmd test", (done) => {
        execute(['test']).then(result => {
            expect(result).to.contain('nothing to do...')
            done()
        })
    })
    it("should initialize default service with correct timestamp folder", (done) => {
        execute(['init'], [ENTER,ENTER,ENTER,ENTER,ENTER,ENTER,ENTER]).then(result => {
            first = moment.utc().format('YYYYMMDDHHmmss')
            const path = `${dir}/versions/${first}`
            const exist = fs.existsSync(path)
            expect(result).to.contain('VRS initialized for :')
            expect(result).to.contain('name: vrs-servertest')
            expect(result).to.contain(`path: ${dir}`)
            expect(exist).to.be.true
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
    it("should forward to next version", (done) => {
        execute(['forward']).then(result => {
            expect(result).to.contain('Next version applied')
            done()
        })
    })
    it("should create a third new version", (done) => {
        execute(['new']).then(result => {
            expect(result).to.contain('VRS : New Version')
            done()
        })
    })
    it("should set to first version", (done) => {
        execute(['set', '0']).then(result => {
            expect(result).to.contain(`${first}`)
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
        if(fs.existsSync(dir)) fs.rmSync(dir, { recursive:true })
    })
})
