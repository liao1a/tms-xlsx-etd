module.exports = function (passed, failed, config) {
    if (!config.column || !config.rule) return Promise.resolve(false)
    if (!config.rule.indexof) return Promise.resolve(false)

    passed.forEach( pas => {
        if (pas[config.column].indexOf(config.rule.indexof[0], config.rule.indexof[1]) === -1) {
            pas.grade = 1
        } else {
            pas.grade = 0
        }
    })

    return Promise.resolve(true)
}