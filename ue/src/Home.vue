<template>
  <tms-frame class="etd-home" :display="{header:true,footer:true,right:true}">
    <template v-slot:center>
      <files></files>
    </template>
    <template v-slot:right>
      <bench></bench>
    </template>
  </tms-frame>
</template>
<script>
import Vue from 'vue'
import { Frame } from 'tms-vue-ui'
Vue.use(Frame)

import Files from './components/Files.vue'
import Bench from './components/Bench.vue'

export default {
  name: 'etd-home',
  components: { Files, Bench }
}
</script>