<template>
  <div class="login-box">
    <div class="login-left">
      <div class="login-title">
        <div class="login-title-text">信息技术与校园深度结合</div>
      </div>
      <h1 class="login-left-text">校园物资调度平台</h1>
      <div>资源管理 & 智能分析</div>
    </div>

    <div class="login-form-wrap">
      <h2 class="form-text">校园物资调度平台</h2>
      <el-form
        :model="loginForm"
        status-icon
        :rules="loginRules"
        ref="ruleForm"
        class="demo-ruleForm"
      >
        <el-form-item class="login-form-item">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item class="login-form-item">
          <el-input
            type="password"
            v-model="loginForm.password"
            placeholder="请输入密码"
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item class="login-form-item">
          <el-button type="primary" size="mini" @click="toLogin">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: "小林",
        password: "123456"
      },
      loginRules: {}
    }
  },
  methods: {
    toLogin() {
      this.$http({
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        url: "http://localhost:8888/users/login",
        data: {
          username: this.loginForm.username,
          password: this.loginForm.password
        }
      }).then(res => {
        let data = res.data
         this.$message({
          message: data.msg,
          type: data.success? 'success': 'warning'
        });
        if (data.success) {
          localStorage.setItem("token", data.token)
          setTimeout(() => {
            this.$router.push("/home")
          }, 1000)
        }
      })
    }
  },
};
</script>

<style scoped>

.login-box {
  background: #378ace;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-left {
  color: #f1f1f1;
  width: 400px;
  text-align: center;
  padding: 50px 0;
  border-top: 1px solid rgba(255, 255, 255, .3);;
  border-bottom: 1px solid rgba(255, 255, 255, .3);
  margin-right: 80px;
}
.login-form-wrap {
  width: 300px;
  height: 300px;
  background: #f1f1f1;
  box-shadow: 5px 5px 10px #888888;
  padding: 35px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.form-text {
  color: #6599ff;
  border-bottom: 1px solid #6599ff;
  text-align: center;
  padding-bottom: 10px;
  width: 250px;
}
.login-form-item {
  width: 100%;
  text-align: left;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-type-tips {
  color: #f1f1f1f1;
  font-size: 13px;
  text-align: center;
}
.el-form-item {
    margin-bottom: 10px;
}
.el-input {
  width: 250px;
}
.el-button {
  width: 250px !important;
}
.form-login-btn {
  /* background: #0081dc !important; */
}
</style>
