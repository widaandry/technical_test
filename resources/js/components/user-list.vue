<template>
    <div>
        <div class="alert alert-danger" v-if="has_error">
            <p>Erreur, impossible de récupérer la liste des utilisateurs.</p>
        </div>
        <table class="table">
            <tr>
                <th scope="col">Id</th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Created At</th>
                <th scope="col">Action</th>
            </tr>
            <tr v-for="user in users" v-bind:key="user.id" style="margin-bottom: 5px;">
                <th scope="row">{{ user.id }}</th>
                <td>{{ user.name }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.created_at}}</td>
                <td>
                    <a class="nav-link" href="#" @click="deleteUser">Delete</a>
                    <a class="nav-link" href="#" @click="deleteUser">Delete</a>
                </td>
            </tr>
        </table>
    </div>
    </template>
    <script>
      export default {
        data() {
          return {
            has_error: false,
          }
        },
        computed: {
          users() {
            return this.$store.getters['auth/userList'];  
          }
        },
        mounted() {
          this.getUsers()
        },
        methods: {
          async getUsers() {
            await this.$store.dispatch('auth/user'); 
          },
          async deleteUser() {
            await this.$store.dispatch('auth/user'); 
          }
        }
      }
    </script>