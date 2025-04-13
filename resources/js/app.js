require('./bootstrap');

import 'font-awesome/css/font-awesome.css';
import 'es6-promise/auto'
import axios from 'axios'
import Vue from 'vue'
import Vuex from 'vuex'
import VueAxios from 'vue-axios'
import VueRouter from 'vue-router'
import App from './app.vue'
import store from './store'
import router from './router'
import VueLazyload from 'vue-lazyload'
import Toasted from 'vue-toasted'
import Swal from 'sweetalert2'
import VueI18n from 'vue-i18n'
import en from './lang/en'
import id from './lang/id'

window.Vue = Vue

Vue.router = router
Vue.use(VueLazyload, {
  loading: require('../assets/loading.gif'), 
});
Vue.use(VueAxios, axios)
Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(VueI18n)

Vue.prototype.$swal = Swal;
Vue.use(Toasted, {
  duration: 3000,
  position: 'top-right',
  theme: 'bubble'
});

const i18n = new VueI18n({
  locale: 'en', // default locale
  messages: {
    en,
    id
  }
})

axios.defaults.baseURL = `${process.env.MIX_APP_URL}/api/v1`
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;  
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});
axios.interceptors.response.use(
  response => response, 
  error => {
    if (error.response && error.response.status === 400) { 
      localStorage.removeItem('auth_token');
      store.auth.commit('auth/logout'); 
      router.push({ name: 'login' }); 
    }
    return Promise.reject(error); 
  }
);

// Global computed properties
Vue.mixin({
  computed: {
    isAuthenticated() {
      return this.$store.getters.isAuthenticated; 
    },
    authToken() {
      return this.$store.getters.getToken; 
    }
  }
});

const app = new Vue({
  el: '#app',
  i18n,
  store,  
  router,
  render: (h) => h(App),
});