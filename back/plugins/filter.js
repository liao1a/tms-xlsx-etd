const _ = require('lodash')

function matcher(objValue, srcValue) {
  if (srcValue instanceof RegExp) {
    return srcValue.test(objValue)
  }

  return true
}

module.exports = function(passed, failed, config) {
  if (Array.isArray(passed) && passed.length) {
    const filtered = passed.filter(obj => !_.isMatchWith(obj, config, matcher))
    _.pullAll(passed, filtered)

    if (Array.isArray(failed)){
      let fail = JSON.parse(JSON.stringify(filtered))
      // 添加错误原因
      fail.forEach( f => {
        delete f._id
        delete f.__v
        f.remark = "plugins/filter"
      })
      failed.push(...fail)
    }

    return Promise.resolve(true)
  }

  return Promise.resolve(false)
}
