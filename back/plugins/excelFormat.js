const _ = require('lodash')

module.exports = function (docs, failed, config) {
    if (!config.column || !config.splits || config.splits.length === 0) return false

    let passed = []
    docs.forEach( dRow => {
        // column列根据split重新格式化文档(一行中有多个号码的情况)
        let split = null // 重复号码根据什么字符转换成数组
        let oldMobiles = dRow[config.column].trim()
        for (let sp of config.splits) {
            if (oldMobiles.indexOf(sp) == -1)  continue 
            split = sp
        }
        let mobiles
        if (split) {
            mobiles = oldMobiles.split(split)
        } else {
            mobiles = [ oldMobiles ]
        }
        mobiles = _.uniq(mobiles)
        //转换
        let newDRow = []
        for (let mb of mobiles) {
            mb = mb.trim()
            if (!mb) continue
            let newRow = JSON.parse(JSON.stringify(dRow))
            delete newRow._id
            delete newRow.__v
            newRow[config.column] = mb
            newDRow.push(newRow)
        }
        passed = _.concat(passed, newDRow)
    })

    // 修改数据库数据并修改docs的数据
    docs.length = 0
    docs.push.apply(docs, passed)
    
    return Promise.resolve(true)
}