describe('xlsx', () => {
  it('read', () => {
    const xlsx = require('xlsx')
    const wb = xlsx.readFile(__dirname + '/try.xlsx')
    const first_sheet_name = wb.SheetNames[0]
    const sh = wb.Sheets[first_sheet_name]
    console.log('jjjj', first_sheet_name)
    const json = xlsx.utils.sheet_to_json(sh)
    console.log('jjjj', json)
  })
})
