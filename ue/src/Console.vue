 <template>
  <tms-frame class="etd-console" :display="{header:true,footer:true,right:true}">
    <template v-slot:center>
      <tms-flex direction="column" align-items="stretch">
        <tms-flex>
          <router-link to="/home">返回</router-link>
          <el-radio-group v-model="category" size="mini" v-on:change="shiftCategory">
            <el-radio-button label="raw">全部</el-radio-button>
            <el-radio-button label="passed">通过</el-radio-button>
            <el-radio-button label="failed">去除</el-radio-button>
          </el-radio-group>
        </tms-flex>
        <rows :columns="columns" :rows="rows"></rows>
      </tms-flex>
    </template>
    <template v-slot:right>
      <tms-flex direction="column">
        <div>{{file.name}}</div>
        <div>
          <el-button size="mini" type="primary" @click="extract">提取</el-button>
          <el-button size="mini" type="primary" @click="transform">加工</el-button>
        </div>
        <div>
          <el-checkbox-group v-model="checkedDispatchers">
            <el-checkbox v-for="d in dispatchers" :key="d[0]" :label="d[0]">{{d[2]}}</el-checkbox>
          </el-checkbox-group>
        </div>
        <div>
          <el-button size="mini" type="primary" @click="dispatch">分发</el-button>
        </div>
      </tms-flex>
    </template>
  </tms-frame>
</template>
<script>
import Vue from 'vue'
import { Frame, Flex } from 'tms-vue-ui'
Vue.use(Frame).use(Flex)

import {
  Button,
  RadioGroup,
  RadioButton,
  CheckboxGroup,
  Checkbox
} from 'element-ui'
Vue.use(Button)
  .use(RadioGroup)
  .use(RadioButton)
  .use(CheckboxGroup)
  .use(Checkbox)

import Rows from './components/Rows.vue'
import browser from '@/apis/browse'

export default {
  name: 'etd-console',
  components: { Rows },
  data() {
    return {
      file: { name: '' },
      category: 'raw',
      columns: null,
      rows: null,
      dispatchers: [],
      checkedDispatchers: []
    }
  },
  props: ['src'],
  mounted() {
    browser.fileInfo(this.src).then(file => {
      this.file = file
      browser.columns().then(cols => {
        this.columns = cols
        browser.rows(this.src).then(rows => {
          this.rows = rows
        })
      })
    })
    browser.dispatchers().then(dispatchers => {
      this.dispatchers = dispatchers
    })
  },
  methods: {
    shiftCategory() {
      browser.rows(this.src, this.category).then(rows => {
        this.rows = rows
      })
    },
    extract() {
      browser.extract(this.src).then(() => {
        this.shiftCategory()
      })
    },
    transform() {
      browser.transform(this.src).then(() => {
        this.shiftCategory()
      })
    },
    dispatch() {
      browser.dispatch(this.src, this.checkedDispatchers).then(() => {
        this.shiftCategory()
      })
    }
  }
}
</script>