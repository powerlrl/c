<template>
  <div class="navbar">
    <el-menu
      :default-active="this.$router.path"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      @select="handleSelect"
      router
    >
      <el-menu-item v-for="(item, i) in navList" :key="i" :index="item.navItem">
        <i :class="item.icon"></i>
        <span slot="title">{{ item.name }}</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      navList: [
        { name: "人员信息", navItem: "/home/createUser", icon: "el-icon-user" },
        {
          name: "物资分类",
          navItem: "/home/wzCategory",
          icon: "el-icon-s-grid"
        },
        {
          name: "物资采购",
          navItem: "/home/wzPurchase",
          icon: "el-icon-s-goods"
        },
        {
          name: "物资统计",
          navItem: "/home/wzCount",
          icon: "el-icon-pie-chart"
        },
        {
          name: "入库登记",
          navItem: "/home/warehouseReg",
          icon: "el-icon-folder-add"
        },
        { name: "申领管理", navItem: "/home/claims", icon: "el-icon-suitcase" },
        {
          name: "财务报销",
          navItem: "/home/financial",
          icon: "el-icon-receiving"
        },
        { name: "全国疫情", navItem: "/home/map", icon: "el-icon-map-location" }
      ]
    };
  },
  created() {
    this.getUserInfo();
  },
  methods: {
    handleOpen() {},
    handleClose() {},
    getUserInfo() {
      let token = localStorage.getItem("token");
      this.$http({
        type: "GET",
        url: "http://localhost:8888/users/profile",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`
        }
      }).then(res => {
        this.userInfo = res.data;
        if (this.userInfo.type == "后勤人员") {
          this.navList = [
            {
              name: "物资采购",
              navItem: "/home/wzPurchase",
              icon: "el-icon-s-goods"
            },
            {
              name: "物资统计",
              navItem: "/home/wzCount",
              icon: "el-icon-pie-chart"
            },
            {
              name: "入库登记",
              navItem: "/home/warehouseReg",
              icon: "el-icon-folder-add"
            },
            {
              name: "全国疫情",
              navItem: "/home/map",
              icon: "el-icon-map-location"
            },
            { name: "申领管理", navItem: "/home/claims", icon: "el-icon-suitcase" },
          ];
        }
        if (this.userInfo.type == "采购员") {
          this.navList = [
            {
              name: "物资分类",
              navItem: "/home/wzCategory",
              icon: "el-icon-s-grid"
            },
            {
              name: "物资采购",
              navItem: "/home/wzPurchase",
              icon: "el-icon-s-goods"
            },
            {
              name: "财务报销",
              navItem: "/home/financial",
              icon: "el-icon-receiving"
            },
            {
              name: "全国疫情",
              navItem: "/home/map",
              icon: "el-icon-map-location"
            }
          ];
        }
        if (this.userInfo.type == "财务人员") {
          this.navList = [
            {
              name: "物资采购",
              navItem: "/home/wzPurchase",
              icon: "el-icon-s-goods"
            },
            {
              name: "财务报销",
              navItem: "/home/financial",
              icon: "el-icon-receiving"
            },
            {
              name: "全国疫情",
              navItem: "/home/map",
              icon: "el-icon-map-location"
            }
          ];
        }
      });
    },
    handleSelect(key, keyPath) {}
  }
};
</script>

<style scoped>
.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 160px;
}
.el-menu {
  background: #f7f7f7;
  height: calc(100vh - 50px);
}
/* .el-aside ul {
  width: 200px;
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
} */
</style>
