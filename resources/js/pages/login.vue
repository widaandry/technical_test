<template>
  <div class="container">
    <div class="row justify-content-md-center">
      <div class="col-lg-6 col-md-12">
        <div class="card card-default">
          <div class="card-header">Login</div>
          <div class="card-body">
            <div class="alert alert-danger" v-if="has_error && !success">
              <p v-if="error == 'login_error'">Validation Errors.</p>
              <p v-else>Error, unable to connect with these credentials.</p>
            </div>
            <form autocomplete="off" @submit.prevent="login" method="post">
              <div class="form-group">
                <label for="email">E-mail</label>
                <input type="email" id="email" class="form-control" placeholder="user@example.com" v-model="email" required>
              </div>
              <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" class="form-control" v-model="password" required>
              </div>
              <button type="submit" class="btn btn-primary">Signin</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        email: null,
        password: null,
        success: false,
        has_error: false,
        error: ''
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
      async login() {
        try {
          var app = this
          const user = {
              email: app.email,
              password: app.password
          };

          await this.$store.dispatch('auth/login', user); 
          if(this.userRole === "-1")
          {
              this.$router.push({ name: 'admin.dashboard' })
          }
          else
          {
            this.$router.push({ name: 'movie' })
          }
        } catch (error) {
            console.error('Login failed:', error);
        }
      },
    }
  }
</script>