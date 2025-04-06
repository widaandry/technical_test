import Vue from 'vue';
import Vuex from 'vuex';

import auth from './modules/auth';
import movie from './modules/movie';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    movie
  },
});
