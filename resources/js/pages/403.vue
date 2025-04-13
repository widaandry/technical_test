<template>
  <div class="container">
    <div class="card card-default">
      <div class="card-body"></div>
      <div class="forbidden-container">
        <h1>403 - {{ $t('forbidden.title') }}</h1>
        <p>
          {{ $t('forbidden.message') }}
        </p>
        <router-link to="/" class="btn-back">← {{ $t('forbidden.button') }}</router-link>
      </div>
    </div>
  </div>
  </template>
  
  <script>
  export default {
    name: 'Forbidden'
  }
  </script>
  
  <style scoped>
  .forbidden-container {
    text-align: center;
    padding: 100px 20px;
    color: #333;
  }
  
  .forbidden-container h1 {
    font-size: 3rem;
    margin-bottom: 20px;
    color: #c0392b;
  }
  
  .forbidden-container p {
    font-size: 1.2rem;
    margin-bottom: 30px;
  }
  
  .btn-back {
    display: inline-block;
    padding: 10px 20px;
    color: white;
    background-color: #007bff;
    border-radius: 4px;
    text-decoration: none;
    font-weight: bold;
  }
  
  .btn-back:hover {
    background-color: #0056b3;
  }
  </style>
  