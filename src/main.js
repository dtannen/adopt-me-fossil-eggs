import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'

import Amplify from 'aws-amplify';
import '@aws-amplify/ui-vue';
import aws_exports from './aws-exports';
import router from './router';

Amplify.configure(aws_exports);
Vue.use(VueRouter)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
