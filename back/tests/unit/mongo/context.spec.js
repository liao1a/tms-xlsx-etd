const log4js = require('log4js')
log4js.configure({
  appenders: { test: { type: 'console' } },
  categories: { default: { appenders: ['test'], level: 'debug' } }
})
const { Context: MongoDbContext } = require('@/models/mongo')

describe('mongodb', () => {
  afterAll(() => {
    return MongoDbContext.close().catch(err => {
      console.log(err)
    })
  })
  it('connect', () => {
    return MongoDbContext.init()
  })
  it('save', () => {
    let ModelRaw = MongoDbContext.ModelRaw()
    let modelRaw = new ModelRaw({ name: 'Jason' })
    return modelRaw.save()
  })
})
