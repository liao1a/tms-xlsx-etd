import Vue from 'vue'
import { TmsAxiosPlugin, TmsAxios } from 'tms-vue'
Vue.use(TmsAxiosPlugin)

let name = 'etd-api'
Vue.TmsAxios({ name })

export default {
  columns() {
    return TmsAxios.ins(name)
      .get(`${process.env.VUE_APP_API_HOST}/columns`)
      .then(rst => rst.data.result)
      .catch(err => Promise.reject(err))
  },
  files() {
    return TmsAxios.ins(name)
      .get(`${process.env.VUE_APP_API_HOST}/files`)
      .then(rst => rst.data.result)
      .catch(err => Promise.reject(err))
  },
  fileInfo(src) {
    return TmsAxios.ins(name)
      .get(`${process.env.VUE_APP_API_HOST}/fileInfo?src=${src}`)
      .then(rst => rst.data.result)
      .catch(err => Promise.reject(err))
  },
  rows(src, category) {
    return TmsAxios.ins(name)
      .get(`${process.env.VUE_APP_API_HOST}/rows?src=${src}&category=${category}`)
      .then(rst => rst.data.result)
      .catch(err => Promise.reject(err))
  },
  remove(file) {
    return TmsAxios.ins(name)
      .get(`${process.env.VUE_APP_API_HOST}/remove?src=${file.path}`)
      .then(rst => rst.data.result)
      .catch(err => Promise.reject(err))
  },
  extract(src) {
    return TmsAxios.ins(name)
      .get(`${process.env.VUE_APP_API_HOST}/extract?src=${src}`)
      .then(rst => rst.data.result)
      .catch(err => Promise.reject(err))
  },
  transform(src) {
    return TmsAxios.ins(name)
      .get(`${process.env.VUE_APP_API_HOST}/transform?src=${src}`)
      .then(rst => rst.data.result)
      .catch(err => Promise.reject(err))
  },
  dispatchers() {
    return TmsAxios.ins(name)
      .get(`${process.env.VUE_APP_API_HOST}/dispatchers`)
      .then(rst => rst.data.result)
      .catch(err => Promise.reject(err))
  },
  dispatch(src, dispatchers) {
    return TmsAxios.ins(name)
      .get(`${process.env.VUE_APP_API_HOST}/dispatch?src=${src}&dispatcher=${dispatchers}`)
      .then(rst => rst.data.result)
      .catch(err => Promise.reject(err))
  }
}
