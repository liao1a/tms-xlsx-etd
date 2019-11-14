const xlsx = require('xlsx')
const fs = require('fs')

module.exports = function(passed, config = {}) {
  const wb = xlsx.utils.book_new()
  const ws = xlsx.utils.json_to_sheet(
    passed.map(row => {
      return {
        province: row.province,
        city: row.city,
        grade: row.grade,
        mobile: row.mobile,
        remark: row.remark
      }
    })
  )
  xlsx.utils.book_append_sheet(wb, ws, 'Sheet1')

  // let wb = {
  //   SheetNames: ['jsonWorkSheet'],
  //   Sheets: {
  //     jsonWorkSheet: ws
  //   }
  // }
  let baseName
  if (config.baseName) {
    baseName = 'out-' + config.baseName
  } else {
    baseName = 'out.xlsx'
  }
  
  let outPath = baseName
  if (config.outPath && typeof config.outPath === 'string') {
    outPath = config.outPath + baseName
  }

  xlsx.writeFile(wb, outPath)

  let data = {code: 0, msg: "ok", outPath: baseName}
  if (config.urlPrefix)  data.outPath = config.urlPrefix + '/' + baseName
  return Promise.resolve(data)
}
