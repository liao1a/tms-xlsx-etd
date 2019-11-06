<template>
  <el-table :data="logs" border stripe style="width: 100%">
    <el-table-column prop="dispatcher" label="操作" width="280px"></el-table-column>
    <el-table-column prop="dispatch_at" label="发送时间" width="200px"></el-table-column>
    <el-table-column prop="strResult" label="结果"></el-table-column>
  </el-table>
</template>
<script>
import Vue from 'vue'
import { Table, TableColumn } from 'element-ui'
Vue.use(Table).use(TableColumn)

import browser from '@/apis/browse'

export default {
  name: 'dispatch-logs',
  props: ['src'],
  data() {
    return {
      logs: []
    }
  },
  mounted() {
    browser.dispatchLogs(this.src).then(logs => {
      logs.forEach(l => {
        l.strResult = JSON.stringify(l.result)
      })
      this.logs = logs
    })
  }
}
</script>