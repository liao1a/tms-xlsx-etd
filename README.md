# tms-xlsx-etd

将导入 excel 文件场景中碰到的常用功能提取出来，形成一个轻量级应用。

目前仅支持处理单一类型的 excel 文件

上传文件（upload）->提取数据（extract）->加工数据（transform）->发送数据（dispatch）

启动 mongodb

> npm run mongod

启动后端服务，端口 3001，app.js 文件中定义

> npm run pm2

# 配置文件

## etd.js

### 描述 excel 文件的列信息

每个列用一个对象描述。

```
module.exports = {
  columns: [
    { name: 'title', label: '标题', type: String }

}
```

### 加工插件

```
module.exports = {
 transform: [['plugins/filter', { phone: /^\d{11}$/ }]],
}
```

### 分发插件

```
module.exports = {
  dispatch: [
    ['plugins/export', {}, { name: '导出xlsx', description: '导出为xlsx文件' }],
    [
      'plugins/http',
      {},
      {
        name: '通过HTTP发送',
        description: '向指定的http接口发送post，传递所有通过的数据'
      }
    ]
  ]
}
```

## mongodb.js

```
module.exports = {
  host: 'localhost',
  port: 27017,
  database: 'tms-xlsx-etd'
}
```

# 后端（back）

| API          | method | url 参数                              | 功能              |
| ------------ | ------ | ------------------------------------- | ----------------- |
| upload       | POST   |                                       | 上传文件          |
| remove       | GET    | src: 文件的 url                       | 删除文件          |
| extract      | GET    | src: 文件的 url                       | 从文件提取数据    |
| transform    | GET    | src: 文件的 url                       | 执行加工插件      |
| files        | GET    |                                       | 获得上传文件列表  |
| rows         | GET    | src: 文件的 url                       | 获得数据          |
|              |        | category: 数据分类，raw/passed/failed |                   |
| columns      | GET    |                                       | 获得 excel 列定义 |
| dispatch     | GET    | src: 文件的 url                       |                   |
| dispatchLogs | GET    | src: 文件的 url                       |                   |

# 前端（ue）
