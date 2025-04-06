require('./bootstrap');

import 'font-awesome/css/font-awesome.css';
import 'es6-promise/auto'
import axios from 'axios'
import Vue from 'vue'
import Vuex from 'vuex'
import VueAxios from 'vue-axios'
import VueRouter from 'vue-router'
import App from './index'
import store from './store'
import router from './router'
import VueLazyload from 'vue-lazyload';

window.Vue = Vue

Vue.router = router
Vue.use(VueLazyload, {
  loading: require('../assets/loading.gif'), 
});
Vue.use(VueAxios, axios)
Vue.use(VueRouter)
Vue.use(Vuex);

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
  store,  
  router,
  render: (h) => h(App),
});