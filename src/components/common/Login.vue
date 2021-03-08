<template>
  <div class="login-box">
    <div class="login-topbar">
      <div class="login-title">
        <div class="login-title-text">校园物资调度平台</div>
      </div>
      <div class="login-type-tips">学校各部门管理人员</div>
    </div>
    <div class="login-form-wrap">
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
        username: "待炒的鱼7",
        password: "888888"
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
.login-topbar {
  height: 300px;
  width: 100%;
  background: #0081dc;
}
.login-title {
  color: #f5f5f5;
  font-size: 25px;
  height: 160px;
  /* background: red; */
  display: flex;
  justify-content: center;
  align-items: flex-end;
}
.login-title-text {
  padding-bottom: 10px;
}
.login-form-wrap {
  width: 300px;
  margin: -100px auto;
  background: #ffffffff;
  box-shadow: 5px 5px 10px #888888;
  padding: 35px;
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
