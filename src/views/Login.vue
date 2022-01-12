<template>
  <div class="login">
    <h2>登录 / 注册</h2>
    <el-form
      v-if="!isRegistry"
      size="small"
      ref="logForm"
      :model="form"
      label-width="80px"
    >
      <el-form-item label="用户名">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input show-password v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" @click="login">登录</el-button>
        <el-button size="small" @click="isRegistry = true" type="success">
          注册
        </el-button>
      </el-form-item>
    </el-form>

    <el-form
      v-else
      :rules="rules"
      size="small"
      ref="regForm"
      :model="form"
      label-width="80px"
    >
      <el-form-item label="用户名" prop="name">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pass">
        <el-input show-password v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input show-password v-model="form.check_password"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button size="small" type="primary" @click="registry">
          保存
        </el-button>
        <el-button size="small" @click="isRegistry = false">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { get } from "@/util/axios";

// var validatePass = (rule, value, callback) => {
//   console.log("validatePass");
//   if (value === "") {
//     callback(new Error("请再次输入密码"));
//   } else if (value !== this.form.password) {
//     callback(new Error("两次输入密码不一致!"));
//   } else {
//     callback();
//   }
// };

export default {
  data() {
    return {
      isRegistry: false,
      rules: {
        name: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          { min: 5, max: 30, message: "长度在 5 到 30 个字符", trigger: "blur" }
        ]
        // pass: [{ required: true, message: "请输入密码", trigger: "blur" }],
        // checkPass: [
        //   { required: true, message: "请输入密码", trigger: "blur" },
        //   { validator: validatePass, trigger: "blur" }
        // ]
      },
      form: {
        username: "",
        password: "",
        check_password: ""
      }
    };
  },
  methods: {
    async registry() {
      this.$refs.regForm.validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    async login() {
      let resp = await get("/user/auth", this.form).catch(() => {
        console.log("发生异常");
      });

      if (resp.code == 200) {
        localStorage["token"] = resp.data.authorization;
        localStorage["user"] = JSON.stringify(resp.data.user);
        this.$event.$emit("login");
        this.$router.replace("/");
      } else {
        this.$message(resp.message);
      }
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
