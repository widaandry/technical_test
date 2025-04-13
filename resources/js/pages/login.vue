<template>
    <div class="container">
      <loading :active.sync="isLoading"
        :is-full-page="fullPage"></loading>

      <div class="row justify-content-md-center">
        <div class="col-lg-6 col-md-12">
          <div class="card card-default">
            <div class="card-body">
              <div class="alert alert-danger" v-if="has_error && !success">
                <p v-if="error == 'login_error'">Validation Errors.</p>
                <p v-else>Error, unable to connect with these credentials.</p>
              </div>
              <form autocomplete="off" @submit.prevent="authLogin">
                <div class="form-group">
                  <label for="login">
                    {{ $t('login.username') }}
                  </label>
                  <input id="login" class="form-control" placeholder="Username or Email" v-model="login" required>
                </div>
                <div class="form-group">
                  <label for="password">
                    {{ $t('login.password') }}
                  </label>
                  <input type="password" id="password" class="form-control" v-model="password" required>
                </div>
                <button class="btn float-right">{{ $t('login.button') }}</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  <script>
    import Loading from 'vue-loading-overlay';
    import 'vue-loading-overlay/dist/vue-loading.css';

    export default {
      components: {
        Loading
      },
      data() {
        return {
          login: null,
          password: null,
          success: false,
          has_error: false,
          error: '',
          isLoading: false,
          fullPage: true
        }
      },
      mounted() {
        //
      },
      computed: {
        userRole() {
          return this.$store.getters['auth/role'];  // Vuex getter for the role
        }
      },
      methods: {
        async authLogin() {
          try {
            this.isLoading = true;

            const user = {
                login: this.login,
                password: this.password
            };
  
            await this.$store.dispatch('auth/login', user); 
            this.isLoading = false;
            this.$toasted.success('Logged in successfully!');
            if(this.userRole === "-1")
            {
                this.$router.push({ name: 'admin.dashboard' })
            }
            else
            {
              this.$router.push({ name: 'movie' })
            }
          } catch (error) {
            this.isLoading = false;
            if (error.response && error.response.data.message) {
              this.$swal.fire('Login Failed', error.response?.data?.message || 'Please try again.', 'error');
            } else {
              this.$swal.fire('Error', 'Login Failed', 'Login failed. Please try again.', 'error');
            }
          }
        },
      }
    }
  </script>