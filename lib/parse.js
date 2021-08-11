module.exports = function (args) {
    let params = {
        list: [],
        has: function (list, all = false) {
            let contain = all
            list.forEach(l => {
                if(all) {
                    if(!this.list.includes(l)) contain = false
                }
                else {
                    if(this.list.includes(l)) contain = true
                }
            })
            return contain
        },
        get: function (value) {
            if (this.args[value]) return this.args[value]
            return null
        },
        get empty () {
            return !this.list.length
        },
        args: {}
    }
    args.forEach((p,i) => {
        params.list.push(p)
        params.args[p] = ""
        if (args[i+1] && !args[i+1].match(/^-/)) {
            params.args[p] = args[i+1]
        }
    })
    return params
}
