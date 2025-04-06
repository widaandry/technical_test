<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <router-link :to="{ name: 'home' }" class="navbar-brand">Technical Test Laravel 5 + Vue 2</router-link>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">

      <ul class="navbar-nav mr-auto" v-if="isLoggedIn && isUser">
        <li class="nav-item" v-for="(route, key) in routes.user" :key="route.path">
          <router-link :to="{ name: route.path }" :key="key" class="nav-link">{{ route.name }}</router-link>
        </li>
      </ul>

      <ul class="navbar-nav mr-auto" v-if="isLoggedIn && isAdmin">
        <li class="nav-item" v-for="(route, key) in routes.admin" :key="route.path">
          <router-link :to="{ name: route.path }" :key="key" class="nav-link">{{ route.name }}</router-link>
        </li>
      </ul>

      <ul class="navbar-nav ml-auto" v-if="!isLoggedIn">
        <li class="nav-item" v-for="(route, key) in routes.unlogged" :key="route.path">
          <router-link :to="{ name: route.path }" :key="key" class="nav-link">{{ route.name }}</router-link>
        </li>
      </ul>

      <!-- Logout Menu: Only shows if the user is logged in -->
      <ul class="navbar-nav ml-auto" v-if="isLoggedIn">
        <li class="nav-item">
          <a class="nav-link" href="#" @click="logout">Logout</a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      routes: {
        unlogged: [
          { name: 'Register', path: 'register' },
          { name: 'Login', path: 'login' }
        ],
        user: [
          { name: 'Movie', path: 'movie' }
        ],
        admin: [
          { name: 'Dashboard', path: 'admin.dashboard' }
        ]
      }
    };
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters['auth/isAuthenticated'];
    },
    isUser() {
      const user = this.$store.getters['auth/user'];
      return user.role === "0" ? true : false;
    },
    isAdmin() {
      const admin = this.$store.getters['auth/user'];
      return admin.role === "-1" ? true : false;
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('auth/logout');
      this.$router.push({ name: 'login' });
    }
  }
};
</script>

<style>
.navbar {
  margin-bottom: 30px;
}
</style>
