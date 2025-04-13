<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <router-link :to="{ name: 'home' }" class="navbar-brand">MyMovie</router-link>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
  
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
  
        <ul class="navbar-nav ml-auto" v-if="!isLoggedIn">
          <select v-model="$i18n.locale">
            <option value="en">EN</option>
            <option value="id">ID</option>
          </select>
          <li class="nav-item" v-for="(route, key) in routes.unlogged" :key="route.path">
            <router-link 
              :to="{ name: route.path }" 
              :key="key" 
              class="nav-link"
              @click.native="closeMenu">{{ route.name }}</router-link>
          </li>
        </ul>

        <!-- Logout Menu: Only shows if the user is logged in -->
        <ul class="navbar-nav ml-auto" v-if="isLoggedIn">
          <select v-model="$i18n.locale">
            <option value="en">EN</option>
            <option value="id">ID</option>
          </select>
          <template v-for="(route, index) in routes.user">
            <li class="nav-item" :key="route.path">
              <router-link 
                :to="{ name: route.path }" 
                class="nav-link" 
                @click.native="closeMenu">
                <span v-if="index !== 0" class="separator">|</span>
                {{ route.name }}
              </router-link>
            </li>
          </template>

          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="userDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false">
              <span class="separator">|</span>
              Hi, {{ userProfile.name }}
            </a>
            <div class="dropdown-menu dropdown-menu-right dropdown-menu-dark" aria-labelledby="userDropdown">
              <a class="dropdown-item" href="#" @click="logout">
                {{ $t('menu.logout') }}
              </a>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  </template>
  
  <script>
  export default {
    data() {
      return {
        userProfile: null,
      };
    },
    computed: {
      isLoggedIn() {
        this.userProfile = this.$store.getters['auth/user'];
        return this.$store.getters['auth/isAuthenticated'];
      },
      routes() {
        return {
          unlogged: [
            { name: this.$t('menu.register'), path: 'register' },
            { name: this.$t('menu.login'), path: 'login' }
          ],
          user: [
            { name: this.$t('menu.movie'), path: 'movie' },
            { name: this.$t('menu.favoriteMovie'), path: 'favorite-movie' }
          ],
          admin: [
            { name: 'Dashboard', path: 'admin.dashboard' }
          ]
        };
      }
    },
    methods: {
      logout() {
        this.closeMenu();
        this.$swal.fire({
          title: "Are you want to log out?",
          draggable: true,
          showCancelButton: true,
          confirmButtonText: "Yes",
        }).then((result) => {
          if (result.isConfirmed) {
            this.$store.dispatch('auth/logout');
            this.$toasted.success('Logout successfully!');
            this.$router.push({ name: 'login' });
          } else if (result.isDenied) {
            //Do Nothing!
          }
        });
      },
      closeMenu() {
        const navbar = document.getElementById('navbarSupportedContent');
        if (navbar && navbar.classList.contains('show')) {
          navbar.classList.remove('show');
        }
      },
      switchLang(lang) {
        this.$i18n.locale = lang;
      }
    }
  };
  </script>
  
  <style>
  .navbar {
    margin-bottom: 30px;
  }

  .separator {
    margin: 0 10px 0 0px;
    color: #ccc;
  }

  @media (max-width: 767.98px) {
    .separator {
      display: none;
    }
  }

  .dropdown-menu {
    background-color: #343a40; /* Same as bg-dark */
    color: white;
  }

  .dropdown-menu .dropdown-item {
    color: white;
  }

  .dropdown-menu .dropdown-item:hover {
    background-color: #495057; /* Darker hover effect */
    color: #fff;
  }
  </style>
  