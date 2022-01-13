<template>
  <div class="login">
    <h2>登录 / 注册</h2>
    <el-form
      status-icon
      size="small"
      ref="form"
      :rules="rules"
      :model="form"
      label-width="80px"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input show-password v-model="form.password"></el-input>
      </el-form-item>

      <el-form-item v-if="isRegistry" label="确认密码" prop="password2">
        <el-input show-password v-model="form.password2"></el-input>
      </el-form-item>

      <el-form-item>
        <div v-if="!isRegistry">
          <el-button size="small" type="primary" @click="login">登录</el-button>
          <el-button size="small" @click="isRegistry = true" type="success">
            注册
          </el-button>
        </div>
        <div v-else>
          <el-button size="small" type="primary" @click="registry">
            保存
          </el-button>
          <el-button size="small" @click="isRegistry = false">返回</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { get } from "@/util/axios";

export default {
  data() {
    var validatePass = (rule, value, callback) => {
      console.log("validatePass");
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.form.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      isRegistry: false,
      rules: {
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          { min: 5, max: 30, message: "长度在 5 到 30 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, message: "长度最少为6个字符", trigger: "blur" }
        ],
        password2: [
          { required: true, message: "请再次输入密码", trigger: "blur" },
          { validator: validatePass, trigger: "blur" }
        ]
      },
      form: {
        username: "",
        password: "",
        password2: ""
      }
    };
  },
  activated() {
    this.username = "";
    this.password = "";
    this.password2 = "";
  },
  methods: {
    async registry() {
      this.$refs.form.validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    async login() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          let resp = await get("/user/auth", this.form).catch(() => {
            console.log("发生异常");
          });

          if (resp.code == 200) {
            localStorage["token"] = resp.data.authorization;
            localStorage["user"] = JSON.stringify(resp.data.user);
            this.$event.$emit("login");
            this.$router.replace("/");
          } else {
            this.$message.error(resp.message);
            this.form.password = "";
          }
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.login {
  width: 40%;
  text-align: center;

  margin: 80px auto;
}
</style>
