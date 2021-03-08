<template>
  <div class="home">
    <el-header>
      <div class="user-info">
        <div class="user-info-avatar">
          <img
            src="https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=321977946,1513972973&fm=26&gp=0.jpg"
            alt=""
          />
        </div>
        <div class="user-info-username">待炒的鱼</div>
      </div>
    </el-header>
    <el-container>
      <el-aside style="width: 200px;">
        <nav-bar />
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar";
// import MainHome from "@/components/MainHome";

export default {
  components: {
    NavBar
    // MainHome,
  },
  created() {
    this.getUserInfo();
  },
  methods: {
    // 查询登录用户信息
    getUserInfo() {
      let token = localStorage.getItem("token");
      this.$http
        .get({
          url: "http://localhost:8888/users/profile",
          headers: {
            "Content-Type": "application/json",
             authorization: `Bearer ${token}`
          }
        })
        .then(res => {
          console.log(res);
        });
    }
  }
};
</script>

<style scoped>
.el-header {
  background: #fafafa;
  height: 50px !important;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.user-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #777777;
}
.user-info img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
.user-info-username {
  margin-left: 8px;
}
</style>
