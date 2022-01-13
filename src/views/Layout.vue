<template>
  <el-container>
    <el-header class="header" style="height: 38px; line-height: 38px">
      <div>GMark</div>
      <div>
        <el-input
          v-show="isLogin"
          @change="search"
          size="mini"
          placeholder="请输入内容"
          prefix-icon="el-icon-search"
          v-model="keyword"
          clearable
        ></el-input>
      </div>
      <div class="userinfo">
        <div v-show="isLogin">
          当前用户: {{ user.Name }}
          <el-link :underline="false" @click="exit">退出</el-link>
        </div>
      </div>
    </el-header>

    <!-- <keep-alive> -->
    <router-view :key="key" />
    <!-- </keep-alive> -->
  </el-container>
</template>

<script>
export default {
  name: "gmark-layout",
  computed: {
    key() {
      let path = this.$route.fullPath.split("#");
      return this.$route.fullPath !== undefined ? path[0] : "/";
    }
  },
  data() {
    return {
      keyword: "",
      user: {},
      isLogin: false
    };
  },
  created() {
    this.$event.$on("login", () => {
      this.load();
    });

    this.$event.$on("back", () => {
      this.keyword = "";
    });
    this.load();
  },
  methods: {
    load() {
      if (localStorage["token"] == undefined) {
        this.isLogin = false;
        this.$router.replace("/login");
      } else {
        try {
          this.user = JSON.parse(localStorage["user"]);
          this.isLogin = true;
        } catch {
          console.log("err");
        }
      }
    },

    exit() {
      delete localStorage["token"];
      delete localStorage["user"];
      this.load();
    },
    search() {
      this.$router.push({
        path: "/book_view",
        query: { keyword: this.keyword }
      });
    }
  }
};
</script>

<style>
.header {
  border-bottom: 1px solid #f0f0f0;
  text-align: left;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  flex-wrap: wrap;
}
</style>
