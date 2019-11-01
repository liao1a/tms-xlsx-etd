# tms-xlsx-etd

将导入 excel 文件场景中碰到的常用功能提取出来，形成一个轻量级应用。

目前仅支持处理单一类型的 excel 文件

上传文件（upload）->提取数据（extract）->加工数据（transform）->发送数据（dispatch）

# 后端（back）

| API       | method | url 参数        |
| --------- | ------ | --------------- |
| upload    | POST   |                 |
| remove    | GET    | src: 文件的 url |
| extract   | GET    | src: 文件的 url |
| transform | GET    | src: 文件的 url |
| files     | GET    |                 |
| rows      | GET    | src: 文件的 url |
| dispatch  | GET    | src: 文件的 url |

# 前端（ue）
