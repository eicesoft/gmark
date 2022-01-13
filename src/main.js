import Vue from "vue";
import App from "./App.vue";
// import "./registerServiceWorker";
import router from "./router";

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import htmlToPdf from "./util/htmlToPdf";

import mavonEditor from "mavon-editor";

import "mavon-editor/dist/css/index.css";

Vue.use(mavonEditor);
Vue.use(ElementUI);
Vue.use(htmlToPdf);

Vue.config.productionTip = false;

new Vue({
  beforeCreate() {
    Vue.prototype.$event = this;
  },
  router,
  render: h => h(App)
}).$mount("#app");
