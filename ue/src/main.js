import Vue from 'vue'
import Shell from './Shell.vue'
import router from './router.js'
// eslint-disable-next-line no-unused-vars
import { Message } from 'element-ui'
import { TmsAxiosPlugin } from 'tms-vue'
Vue.use(TmsAxiosPlugin)

const rule = Vue.TmsAxios.newInterceptorRule({
  onResultFault: res => {
    return new Promise(resolve => {
      Message({ message: res.data.msg, type: 'error', showClose: true })
      resolve(true)
    })
  }
})
const name = 'etd-api'
Vue.TmsAxios({
  name,
  rules: [rule]
})

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(Shell)
}).$mount('#app')
