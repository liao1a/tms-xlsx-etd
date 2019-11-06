import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from './Home.vue'
import Console from './Console.vue'
import Dispatch from './Dispatch.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/console', name: 'console', component: Console, props: route => ({ src: route.query.src }) },
  { path: '/dispatch', name: 'dispatch', component: Dispatch, props: route => ({ src: route.query.src }) },
  { path: '/*', name: 'home', component: Home, props: true }
]

const router = new VueRouter({ mode: 'history', routes })

export default router
