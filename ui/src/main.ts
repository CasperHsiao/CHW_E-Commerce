import Vue from 'vue'
import VueRouter from 'vue-router'
import App from '@/App.vue'
import CustomerScreen from '@/views/CustomerScreen.vue'
import OperatorScreen from '@/views/OperatorScreen.vue'
import HomeScreen from '@/views/HomeScreen.vue'
import OperatorAddItemScreen from '@/views/OperatorAddItemScreen.vue'

import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue"

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.use(VueRouter)

const router = new VueRouter({
  mode: "history",
  routes: [
    {
      path: "/operator/:operatorId",
      component: OperatorScreen,
      props: ({ params: { operatorId }}) => ({ operatorId }),
    },
    {
      path: "/operator/additem",
      name: "operatoradditemscreen",
      component: OperatorAddItemScreen,
      // props: { params: { operatorId }}) => ({ operatorId }),
    },
    {
      path: "/",
      component: HomeScreen,
    },
    {
      path: "/customer",
      component: CustomerScreen,
    },
  ],
})

Vue.config.productionTip = false
Vue.config.devtools = true

/* eslint-disable no-new */
new Vue({
  router,
  el: '#app',
  render: h => h(App),
})
