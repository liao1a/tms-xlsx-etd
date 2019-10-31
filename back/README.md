基于 tms-koa 实现的后端服务

上传文件（upload）->提取数据（extract）->加工数据（transform）->发送数据（load）

# 配置文件

xlsx.js

# 上传 excel 文件

新建文件 config/fs.js

新建目录 files/upload

文件解析规则

# MongoDB

## Collection

xlsx-upload

xlsx-raw

xlsx-passed

xlsx-failed

schema 是可以改变的，并不影响已有的数据

## upload

上传文件时坚持是否和 columns 的定义一致

## extract

从文件中提取数据

重复执行的逻辑是什么？

## transform

从本地取插件

filter 插件 符合条件的保留，不符合的被过滤

重复做会先情况数据

## load

log 插件

是否允许多次执行 load 的过程

如何嵌入到别的应用中
