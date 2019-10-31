const xlsx = require('xlsx')

module.exports = function(passed, config) {
  const wb = xlsx.utils.book_new()
  const ws = xlsx.utils.json_to_sheet(
    passed.map(row => {
      return {
        time: row.time,
        title: row.title,
        host1: row.host1,
        contact: row.contact,
        phone: row.phone
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
  xlsx.writeFile(wb, 'out.xlsx')

  return Promise.resolve(true)
}
