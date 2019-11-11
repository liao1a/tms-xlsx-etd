const fs = require('fs')
const path = require('path')
const log4js = require('log4js')
const logger = log4js.getLogger('tms-xlsx-etd')
const { Ctrl, ResultData, ResultFault } = require('tms-koa')
const { UploadPlain } = require('tms-koa/lib/model/fs/upload')
const { Context: EtdContext, EtdConfig } = require('../models/etd')

class Main extends Ctrl {
  echo() {
    return new ResultData('I am tms-xlsx-etd.')
  }
  /**
   *
   */
  columns() {
    const columns = EtdConfig.ins().columns

    return new ResultData(columns)
  }
  async fileInfo() {
    const { src } = this.request.query

    const ModelUpload = await EtdContext.ModelUpload()
    const file = await ModelUpload.findOne({ path: src })

    return new ResultData(file)
  }
  /**
   * 已长传文件列表
   */
  async files() {
    const ModelUpload = await EtdContext.ModelUpload()
    return new Promise(resolve => {
      ModelUpload.find({}, (err, docs) => {
        if (err) {
          logger.warn('ModelUpload.find', err)
          return resolve(new ResultFault(err.message))
        }
        resolve(new ResultData(docs))
      })
    })
  }
  /**
   * 返回指定文件中的内容
   */
  async rows() {
    const { src, category } = this.request.query

    let Model
    switch (category) {
      case 'passed':
        Model = await EtdContext.ModelPassed()
        break
      case 'failed':
        Model = await EtdContext.ModelFailed()
        break
      default:
        Model = await EtdContext.ModelRaw()
        break
    }

    const rows = await Model.find({ path: src })

    return new ResultData(rows)
  }
  /**
   * 上传单个文件
   */
  async upload() {
    if (!this.request.files || !this.request.files.file) {
      return new ResultFault('没有上传文件')
    }

    const file = this.request.files.file
    const info = this.request.body

    const upload = new UploadPlain()
    const filepath = await upload.store(file)

    // const xlsx = require('xlsx')
    // const wb = xlsx.readFile(filepath)
    // const firstSheetName = wb.SheetNames[0]
    // const sh = wb.Sheets[firstSheetName]
    // const json = xlsx.utils.sheet_to_json(sh)

    const ModelUpload = await EtdContext.ModelUpload()
    ModelUpload.create(
      { path: filepath, name: file.name, remark: info.remark },
      err => {
        if (err) logger.warn('ModelUpload.create', err)
      }
    )

    return new ResultData(filepath)
  }
  /**
   * 提取指定的xlsx文件的数据存储数据库
   */
  async extract() {
    const { src } = this.request.query

    const filename = path.resolve(src)
    if (!fs.existsSync(filename)) return new ResultFault('指定的文件不存在')

    const ModelRaw = await EtdContext.ModelRaw()
    await ModelRaw.deleteMany({ path: src })

    const xlsx = require('xlsx')
    const wb = xlsx.readFile(filename)
    const firstSheetName = wb.SheetNames[0]
    const sh = wb.Sheets[firstSheetName]
    const json = xlsx.utils.sheet_to_json(sh)

    const etdConfig = EtdConfig.ins()
    const lable2Name = new Map(
      etdConfig.columns.map(col => [col.label, col.name])
    )

    const jsonRawRows = json.map(row => {
      let newRow = { path: src }
      lable2Name.forEach((name, label) => {
        newRow[name] = row[label]
      })
      return newRow
    })

    try {
      await ModelRaw.insertMany(jsonRawRows)
      const ModelUpload = await EtdContext.ModelUpload()
      const res = await ModelUpload.updateOne(
        { path: src },
        { $set: { raw: jsonRawRows.length } }
      )
      return new ResultData(jsonRawRows.length)
    } catch (err) {
      logger.warn('ModelRaw.insertMany', err)
      return new ResultFault(err.message)
    }
  }
  /**
   * 处理已经提取的数据，分为resolved和rejected两组
   */
  async transform() {
    const { src,transforms } = this.request.query

    const ModelPassed = await EtdContext.ModelPassed()
    await ModelPassed.deleteMany({ path: src })
    const ModelFailed = await EtdContext.ModelFailed()
    await ModelFailed.deleteMany({ path: src })

    const ModelRaw = await EtdContext.ModelRaw()

    let etdConfig = EtdConfig.ins()
    const pluginConfigs = etdConfig.transform
    if (typeof transforms !== 'string' || transforms.length === 0) {
      return Promise.resolve(new ResultFault('没有指定加工处理项'))
    }
    
    let transforms2 = transforms.split(',')
    return new Promise(resolve => {
      ModelRaw.find({ path: src }, async (err, docs) => {
        if (err) {
          logger.warn('ModelPassed.insertMany', err)
          return resolve(new ResultFault(err.message))
        }
        if (docs.length === 0) {
          return resolve(new ResultFault('没有匹配的数据'))
        }

        let pluginCfg, filename, plugin, args
        const failed = []
        for (let i = 0; i < pluginConfigs.length; i++) {
          pluginCfg = pluginConfigs[i]
          if (Array.isArray(pluginCfg) && pluginCfg.length > 0) {
            ;[filename, ...args] = pluginCfg
          } else if (typeof pluginCfg === 'string') {
            filename = pluginCfg
          } else {
            continue
          }
          if (!transforms2.includes(filename)) continue
          if (!fs.existsSync(path.resolve(`${filename}.js`))) continue
          plugin = require(path.resolve(filename))
          if (typeof plugin === 'function') {
            await plugin(docs, failed, ...args)
          }
        }
        ModelPassed.insertMany(docs, err => {
          if (err) {
            logger.warn('ModelPassed.insertMany', err)
          }
        })
        if (failed.length) {
          ModelFailed.insertMany(failed, err => {
            if (err) {
              logger.warn('ModelFailed.insertMany', err)
            }
          })
        }

        const ModelUpload = await EtdContext.ModelUpload()
        await ModelUpload.updateOne(
          { path: src },
          { $set: { passed: docs.length, failed: failed.length } }
        )
        resolve(new ResultData(docs.length))
      })
    })
  }
  /**
   * 设置的分发器
   */
  async dispatchers() {
    const { dispatch } = EtdConfig.ins()

    return new ResultData(dispatch)
  }
  /**
   * 设置的过滤项
   */
  async transforms() {
    const { transform } = EtdConfig.ins()

    return new ResultData(transform)
  }
  /**
   * 将处理通过的数据发送给分发插件
   */
  async dispatch() {
    const { src, dispatcher } = this.request.query
    if (typeof src !== 'string' || src.length == 0)
      return Promise.resolve(new ResultFault('没有指定文件地址'))
    if (typeof dispatcher !== 'string' || dispatcher.length == 0)
      return Promise.resolve(new ResultFault('没有指定分发处理操作'))

    const dispatchers = dispatcher.split(',')
    const etdConfig = EtdConfig.ins()
    const pluginConfigs = etdConfig.dispatch
    let ModelContent = await EtdContext.ModelPassed()
    return new Promise(resolve => {
      ModelContent.find({ path: src }, async (err, docs) => {
        let pluginCfg, filename, plugin, args, profile
        for (let i = 0; i < pluginConfigs.length; i++) {
          pluginCfg = pluginConfigs[i]
          if (Array.isArray(pluginCfg) && pluginCfg.length > 0) {
            ;[filename, args, profile] = pluginCfg
          } else {
            continue
          }
          if (!dispatchers.includes(filename)) continue
          if (!fs.existsSync(path.resolve(`${filename}.js`))) continue
          plugin = require(path.resolve(filename))
          if (typeof plugin === 'function') {
            args.baseName = passed + '-' + path.basename(src)
            let result = await plugin(docs, args)
            /* 记录执行日志 */
            const ModelDispatch = await EtdContext.ModelDispatch()
            ModelDispatch.create(
              { path: src, dispatcher: profile.name, result },
              err => {
                if (err) logger.warn('ModelDispatch.create', err)
              }
            )
          }
        }
        resolve(new ResultData(docs.length))
      })
    })
  }
  /**
   * 分发日志
   */
  async dispatchLogs() {
    const { src } = this.request.query

    let Model = await EtdContext.ModelDispatch()
    const logs = await Model.find({ path: src })

    return new ResultData(logs)
  }
  /**
   * 删除文件和数据
   */
  async remove() {
    const { src } = this.request.query

    const ModelFailed = await EtdContext.ModelFailed()
    await ModelFailed.deleteMany({ path: src })
    const ModelPassed = await EtdContext.ModelPassed()
    await ModelPassed.deleteMany({ path: src })
    const ModelRaw = await EtdContext.ModelRaw()
    await ModelRaw.deleteMany({ path: src })
    const ModelUpload = await EtdContext.ModelUpload()
    await ModelUpload.deleteOne({ path: src })

    const fsUpload = new UploadPlain()
    fsUpload.fs.remove(src)

    return new ResultData('ok')
  }
}

module.exports = Main
