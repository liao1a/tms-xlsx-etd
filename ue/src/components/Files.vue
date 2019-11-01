<template>
  <el-table :data="files" border stripe style="width: 100%">
    <el-table-column prop="name" label="名称" width="280px"></el-table-column>
    <el-table-column prop="upload_at" label="上传时间" width="200px"></el-table-column>
    <el-table-column prop="remark" label="备注"></el-table-column>
    <el-table-column fixed="right" label="操作" width="160px">
      <template slot-scope="scope">
        <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        <el-button size="mini" type="primary" @click="handleConsole(scope.index,scope.row)">ETD</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
import Vue from 'vue'
import { Table, TableColumn } from 'element-ui'

Vue.use(Table).use(TableColumn)

import browser from '@/apis/browse'

export default {
  data() {
    return {
      files: null
    }
  },
  methods: {
    handleConsole(index, file) {
      this.$router.push({ path: 'console', query: { src: file.path } })
    },
    handleDelete(index, file) {
      browser.remove(file).then(() => {
        this.files.splice(index, 1)
      })
    }
  },
  mounted() {
    browser.files().then(files => (this.files = files))
  }
}
</script>
<style>
.el-drawer__body {
  padding: 20px;
}
</style>
