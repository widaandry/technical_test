import axios from 'axios';

const state = {
  token: localStorage.getItem('auth_token') || '',
  user: (() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || null;
    } catch (e) {
      console.error('Failed to parse user from localStorage:', e);
      return null;
    }
  })(),
  userList: null,
  loggedIn: false,
};

const getters = {
  isAuthenticated: (state) => !!state.token,
  getToken: (state) => state.token,
  loggedIn: (state) => state.loggedIn,
  user: (state) => state.user,
  role: (state) => {
    return state.user ? state.user.role : null;
  },
  userList: (state) => {
    return state.userList ? state.userList : null;
  },
};

const mutations = {
  setUser(state, user) {
    state.user = user;
    state.loggedIn = true;
    try {
      localStorage.setItem('user', JSON.stringify(user));  // Ensure the user is stringified
    } catch (e) {
      console.error('Error saving user to localStorage:', e);
    }
  },
  setToken(state, token) {
    state.token = token;
  },
  setUserList(state, data) {
    state.userList = data;
  },
  logout(state) {
    state.token = '';
    state.user = null;
    state.loggedIn = false;
  },
};

const actions = {
  async user({ commit }) {
    try {
        const response = await axios.get('/auth/user');
        const { data } = response.data;
        commit('setUserList', data);
    } catch (error) {
        throw error; 
    }
  },
  async register({ commit }, { name, username, email, password, password_confirmation }) {
    try {
        const response = await axios.post('/auth/register', {
            name,
            username,
            email,
            password,
            password_confirmation,
        });

        const { status } = response.data;
    } catch (error) {
        throw error; 
    }
  },
  async login({ commit }, { login, password }) {
    try {
        const response = await axios.post('/auth/login', { login, password });
        const { userData, token } = response.data;
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        commit('setUser', userData);
        commit('setToken', token);
    } catch (error) {
        throw error; 
    }
  },

  async logout({ commit }) {
    try {
        await axios.post('/auth/logout');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        commit('logout');
    } catch (error) {
        console.error('Logout failed:', error);
    }
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};