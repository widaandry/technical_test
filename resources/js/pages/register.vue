<template>
    <div class="container">
      <loading :active.sync="isLoading"
        :is-full-page="fullPage"></loading>

      <div class="row justify-content-md-center">
        <div class="col-lg-6 col-md-12">
          <div class="card card-default">
            <div class="card-body">
              <!-- Registration Form -->
              <div class="alert alert-danger" v-if="has_error && !success">
                <p v-if="error == 'login_error'">Validation Errors.</p>
                <p v-else>Error, unable to connect with these credentials.</p>
              </div>
              <form autocomplete="off" @submit.prevent="register">
                <div class="form-group" v-bind:class="{ 'has-error': has_error && errors.name }">
                  <label for="name">
                    {{ $t('register.name') }}
                  </label>
                  <input type="text" id="name" class="form-control" placeholder="Full Name" v-model="name" required>
                </div>

                <div class="form-group">
                  <label for="username">
                    {{ $t('register.username') }}
                  </label>
                  <input type="text" id="username" class="form-control" placeholder="Username" v-model="username" required>
                </div>
  
                <div class="form-group">
                  <label for="email">
                    {{ $t('register.email') }}
                  </label>
                  <input type="email" id="email" class="form-control" placeholder="user@example.com" v-model="email" required>
                </div>
  
                <div class="form-group">
                  <label for="password">
                    {{ $t('register.password') }}
                  </label>
                  <input type="password" id="password" class="form-control" v-model="password" required>
                </div>
  
                <div class="form-group">
                  <label for="password_confirmation">
                    {{ $t('register.passwordConfirmation') }}
                  </label>
                  <input type="password" id="password_confirmation" class="form-control" v-model="password_confirmation" required>
                </div>
  
                <button class="btn float-right">
                    {{ $t('register.button') }}
                  </button>
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
        name: '',
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
        has_error: false,
        error: '',
        success: false,
        isLoading: false,
        fullPage: true
      };
    },
    methods: {
      async register() {
        try {
          this.$swal.fire({
            title: this.$t('register.confirmation'),
            draggable: true,
            showCancelButton: true,
            confirmButtonText: this.$t('register.confirmationAdd'),
          }).then((result) => {
            if (result.isConfirmed) {
              this.isLoading = true;
              this.$store.dispatch('auth/register', {
                name: this.name,
                username: this.username,
                email: this.email,
                password: this.password,
                password_confirmation: this.password_confirmation
              });
              this.success = true;
              this.isLoading = false;
              this.$swal.fire(this.$t('register.confirmationAddSuccess'), "", "success");
              this.$router.push({ name: 'login', params: { successRegistrationRedirect: true } });
            } else if (result.isDenied) {
              //Do Nothing!
            }
          });
        } catch (error) {
            this.isLoading = false;
            if (error.response && error.response.data.message) {
              this.$swal.fire('Register Failed', error.response?.data?.message || 'Please try again.', 'error');
            } else {
              this.$swal.fire('Error', 'Register Failed', 'Register failed. Please try again.', 'error');
            }
          }
      }
    }
  };
  </script>
  