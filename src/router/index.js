import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/login",
    name: "Login",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/Login.vue")
  },
  {
    path: "/book_view",
    name: "book_view",
    component: () =>
      import(/* webpackChunkName: "book_view" */ "../views/BookView.vue")
  },
  {
    path: "/page_edit",
    name: "page_edit",
    component: () =>
      import(/* webpackChunkName: "book_edit" */ "../views/PageEdit.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
