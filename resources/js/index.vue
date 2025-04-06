<template>
  <div id="main">
      <header id="header">
          <Menu></Menu>
      </header>
      <div id="content">
          <router-view></router-view>
      </div>
  </div>
</template>
<script>
import Menu from './components/Menu.vue'
export default {
  data() {
    return {
      //
    }
  },
  components: {
    Menu
  }
}
</script>

<style>
    .card {
      position: relative;
      display: flex;
      flex-direction: column;
      min-width: 0;
      word-wrap: break-word;
      background-color: #fff;
      background-clip: border-box;
      border: 0px;
      border-radius: 0.25rem;
      box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
    }

    .card-header {
      padding: 0.75rem 1.25rem;
      margin-bottom: 0;
      border-bottom: 0px;
      background-color: rgba(0, 0, 0, 0.03);
      box-shadow: rgba(14, 63, 126, 0.06) 0px 0px 0px 1px, rgba(42, 51, 70, 0.03) 0px 1px 1px -0.5px, rgba(42, 51, 70, 0.04) 0px 2px 2px -1px, rgba(42, 51, 70, 0.04) 0px 3px 3px -1.5px, rgba(42, 51, 70, 0.03) 0px 5px 5px -2.5px, rgba(42, 51, 70, 0.03) 0px 10px 10px -5px, rgba(42, 51, 70, 0.03) 0px 24px 24px -8px;
    }
  </style>