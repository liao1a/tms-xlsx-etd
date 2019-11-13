const _ = require('lodash')

module.exports = function (docs, failed, config) {
    if (!config.column || !config.splits || config.splits.length === 0) return Promise.resolve(false)

    let passed = []
    for (let dRow of docs) {
        let newMobiles = []
        if (dRow[config.column] && dRow[config.column].trim().length > 0) {
            let oldMobiles = dRow[config.column]
            let split = null // 重复号码根据什么字符转换成数组
            for (let sp of config.splits) {
                if (oldMobiles.indexOf(sp) == -1)  continue 
                split = sp
                break
            }
            if (split) {
                newMobiles.push.apply(newMobiles, oldMobiles.split(split))
            } else {
                newMobiles.push(oldMobiles)
            }
        }
        // column列根据split重新格式化文档(一行中有多个号码的情况) 支持共5列号码
        if (dRow[config.column + '1'] && dRow[config.column + '1'].trim().length > 0) {
            let oldMobiles = dRow[config.column + '1']
            let split = null // 重复号码根据什么字符转换成数组
            for (let sp of config.splits) {
                if (oldMobiles.indexOf(sp) == -1)  continue 
                split = sp
                break
            }
            if (split) {
                newMobiles.push.apply(newMobiles, oldMobiles.split(split))
            } else {
                newMobiles.push(oldMobiles)
            }
        }
        if (dRow[config.column + '2'] && dRow[config.column + '2'].trim().length > 0) {
            let oldMobiles = dRow[config.column + '2']
            let split = null // 重复号码根据什么字符转换成数组
            for (let sp of config.splits) {
                if (oldMobiles.indexOf(sp) == -1)  continue 
                split = sp
                break
            }
            if (split) {
                newMobiles.push.apply(newMobiles, oldMobiles.split(split))
            } else {
                newMobiles.push(oldMobiles)
            }
        }
        if (dRow[config.column + '3'] && dRow[config.column + '3'].trim().length > 0) {
            let oldMobiles = dRow[config.column + '3']
            let split = null // 重复号码根据什么字符转换成数组
            for (let sp of config.splits) {
                if (oldMobiles.indexOf(sp) == -1)  continue 
                split = sp
                break
            }
            if (split) {
                newMobiles.push.apply(newMobiles, oldMobiles.split(split))
            } else {
                newMobiles.push(oldMobiles)
            }
        }
        //
        if (!newMobiles) {
            let filtered = JSON.parse(JSON.stringify(dRow))
            // 添加错误原因
            delete filtered._id
            delete filtered.__v
            filtered.remark = "plugins/excelFormat"
            failed.push(filtered)
            continue
        }

        newMobiles = _.uniq(newMobiles)
        //转换
        let newDRow = []
        for (let mb of newMobiles) {
            mb = mb.trim()
            if (!mb) continue
            let newRow = JSON.parse(JSON.stringify(dRow))
            delete newRow._id
            delete newRow.__v
            newRow[config.column] = mb
            newDRow.push(newRow)
        }
        passed = _.concat(passed, newDRow)
    }

    // 修改数据库数据并修改docs的数据
    docs.length = 0
    docs.push.apply(docs, passed)
    return Promise.resolve(true)
}