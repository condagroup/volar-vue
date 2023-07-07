<template>
    <div class="loading">
      <p v-for="index in loadingBars" :key="index" class="loading-bar"></p>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      loadingBars: {
        type: Number,
        default: 3
      }
    }
  };
  </script>
  
  <style scoped>
  .loading {
    position: absolute;
    right: 0;
    bottom: 4rem;
    display: flex;
  }
 .loading-bar {
    width: 6px;
    height: 6px;
    margin: 0 2px;
    border-radius: 4px;
    background-color: #ccc;
    animation: loading 1s ease-in-out infinite;
}

@keyframes loading {
    0% {
        opacity: .2;
    }

    20% {
        opacity: 1;
    }

    100% {
        opacity: .2;
    }
}
  </style>