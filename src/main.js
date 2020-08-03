import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import 'bootstrap';
import App from './App.vue';
import dateFiliter from './filters/date';
import weekFiliter from './filters/Week';
import idCardFiliter from './filters/IdCard';

Vue.config.productionTip = false;
Vue.use(VueAxios, axios);
Vue.filter('date', dateFiliter);
Vue.filter('week', weekFiliter);
Vue.filter('idCard', idCardFiliter);

new Vue({
  render: (h) => h(App),
}).$mount('#app');
