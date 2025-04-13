<template>
  <div id="main">
    <div class="background-image"></div>
      <header id="header">
          <Menu></Menu>
      </header>
      <div id="content">
          <router-view></router-view>
      </div>
    </div>
  </template>
  <script>
  import Menu from './components/layouts/menu.vue'
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
    #main {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 2);
      z-index: 1;
    }

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

    .background-image {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
                  url('/images/background-poster.jpg') center center / cover no-repeat;
      z-index: -1;
      pointer-events: none;
    }

    img.bg {
      opacity: 0.3;
      min-height: 100%;
      min-width: 1024px;
      width: 100%;
      height: auto;
      position: fixed;
      top: 0;
      left: 0;
    }

    .btn {
      padding: 6px 12px;
      font-size: 13px;
      font-weight: 500;
      color: #fff;
      background: #007bff;
      border: none;
      border-radius: 20px;
      cursor: pointer;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
      transition: background 0.3s ease, transform 0.2s ease;
    }

    .btn:hover {
      background: #007bff;
      transform: scale(1.05);
    }

    .btn:active {
      transform: scale(0.95);
    }

    .btn-danger { background: #e63946; }
    .btn-success { background: #2a9d8f; }
    .btn-outline { background: transparent; border: 1px solid #ccc; color: #333; }
  </style>