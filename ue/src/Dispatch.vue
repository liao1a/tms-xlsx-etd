<template>
  <tms-frame class="etd-console" :display="{header:true,footer:true,right:true}">
    <template v-slot:center>
      <tms-flex direction="column" align-items="stretch">
        <tms-flex>
          <router-link to="/home">首页</router-link>
          <router-link :to="'/console?src='+src">返回</router-link>
        </tms-flex>
        <dispatch-logs :src="src"></dispatch-logs>
      </tms-flex>
    </template>
    <template v-slot:right>
      <tms-flex direction="column">
        <div>{{file.name}}</div>
        <div>
          <el-checkbox-group v-model="checkedDispatchers">
            <el-checkbox v-for="d in dispatchers" :key="d[0]" :label="d[0]">{{d[2].description}}</el-checkbox>
          </el-checkbox-group>
        </div>
        <div>
          <el-button type="primary" @click="dispatch">分发</el-button>
        </div>
      </tms-flex>
    </template>
  </tms-frame>
</template>
<script>
import Vue from 'vue'
import { Frame, Flex } from 'tms-vue-ui'
Vue.use(Frame).use(Flex)

import { Table, TableColumn, Button, CheckboxGroup, Checkbox } from 'element-ui'
Vue.use(Table)
  .use(TableColumn)
  .use(Button)
  .use(CheckboxGroup)
  .use(Checkbox)

import DispatchLogs from './components/DispatchLogs.vue'
import browser from '@/apis/browse'

export default {
  name: 'etd-console',
  components: { DispatchLogs },
  data() {
    return {
      file: { name: '' },
      rows: null,
      dispatchers: [],
      checkedDispatchers: []
    }
  },
  props: ['src'],
  mounted() {
    browser.fileInfo(this.src).then(file => {
      this.file = file
    })
    browser.dispatchers().then(dispatchers => {
      this.dispatchers = dispatchers
    })
  },
  methods: {
    dispatch() {
      browser.dispatch(this.src, this.checkedDispatchers).then(() => {})
    }
  }
}
</script>