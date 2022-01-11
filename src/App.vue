<template>
  <div id="app">
    <keep-alive>
      <Layout></Layout>
    </keep-alive>
  </div>
</template>

<script>
import Layout from "@/views/Layout";
export default {
  components: { Layout }
};
</script>

<style lang="scss">
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
}
a {
  color: #1f5d9b;
  text-decoration-line: none;
}

a:hover {
  color: #64b1fd;
}
#app {
  height: 100%;

  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
/* CSS */
::-webkit-scrollbar {
  width: 6px;
}
/* 滚动槽 */
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(117, 117, 117, 0.3);
  border-radius: 10px;
}
::-webkit-scrollbar-corner {
  background: #fff;
}
/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: rgb(216, 216, 216);
  -webkit-box-shadow: inset 0 0 3px rgba(187, 183, 183, 0.5);
}
::-webkit-scrollbar-thumb:window-inactive {
  background: rgba(197, 197, 197, 0.4);
  width: 3px;
}
.userinfo {
  font-size: 13px;
}
</style>
