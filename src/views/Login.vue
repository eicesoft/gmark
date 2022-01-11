<template>
  <div class="login">
    <el-form size="small" ref="form" :model="form" label-width="80px">
      <el-form-item label="用户名">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input show-password v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="login">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { get } from "@/util/axios";

export default {
  data() {
    return {
      form: {
        username: "kelezyb",
        password: "123456"
      }
    };
  },
  methods: {
    async login() {
      let resp = await get("/user/auth", this.form).catch(() => {
        console.log("发生异常");
      });

      if (resp.code == 200) {
        localStorage["token"] = resp.data.authorization;
        localStorage["user"] = JSON.stringify(resp.data.user);
        this.$event.$emit("login");
        this.$router.replace("/");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.login {
  width: 40%;
  text-align: center;
}
</style>
