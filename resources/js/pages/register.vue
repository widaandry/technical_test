<template>
  <div class="container">
    <div class="row justify-content-md-center">
      <div class="col-6">
        <div class="card card-default">
          <div class="card-header">Register</div>
          <div class="card-body">
            <!-- Error Message -->
            <div class="alert alert-danger" v-if="has_error && !success">
              <p v-if="error == 'registration_validation_error'">Validation Errors.</p>
              <p v-else>Error, cannot register at the moment. If the problem persists, please contact an administrator.</p>
            </div>

            <!-- Registration Form -->
            <form autocomplete="off" @submit.prevent="register" v-if="!success" method="post">
              <div class="form-group" v-bind:class="{ 'has-error': has_error && errors.name }">
                <label for="name">Name</label>
                <input type="text" id="name" class="form-control" placeholder="Full Name" v-model="name">
                <span class="help-block" v-if="has_error && errors.name">{{ errors.name }}</span>
              </div>

              <div class="form-group" v-bind:class="{ 'has-error': has_error && errors.email }">
                <label for="email">E-mail</label>
                <input type="email" id="email" class="form-control" placeholder="user@example.com" v-model="email">
                <span class="help-block" v-if="has_error && errors.email">{{ errors.email }}</span>
              </div>

              <div class="form-group" v-bind:class="{ 'has-error': has_error && errors.password }">
                <label for="password">Password</label>
                <input type="password" id="password" class="form-control" v-model="password">
                <span class="help-block" v-if="has_error && errors.password">{{ errors.password }}</span>
              </div>

              <div class="form-group" v-bind:class="{ 'has-error': has_error && errors.password_confirmation }">
                <label for="password_confirmation">Password Confirmation</label>
                <input type="password" id="password_confirmation" class="form-control" v-model="password_confirmation">
                <span class="help-block" v-if="has_error && errors.password_confirmation">{{ errors.password_confirmation }}</span>
              </div>

              <button type="submit" class="btn btn-primary">Submit</button>
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
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      has_error: false,
      error: '',
      errors: {},
      success: false
    };
  },
  methods: {
    async register() {
      const app = this;
      try {
        await this.$store.dispatch('auth/register', {
          name: app.name,
          email: app.email,
          password: app.password,
          password_confirmation: app.password_confirmation
        });

        // On success, set success flag to true
        app.success = true;
        this.$router.push({ name: 'login', params: { successRegistrationRedirect: true } });

      } catch (error) {
        // Handle errors
        app.has_error = true;
        if (error.response && error.response.data) {
          app.error = error.response.data.error;
          app.errors = error.response.data.errors || {};
        }
      }
    }
  }
};
</script>
