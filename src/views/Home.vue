<template>
  <div class="home">
    <el-header>
      <div class="header-title">
        <i class="el-icon-connection"></i>
        校园物资调度平台</div>
      <div class="user-info">
        <div class="user-info-avatar">
          <img :src="userInfo.imgUrl" alt="" />
        </div>
        <div class="user-info-username">Hi, {{ userInfo.username }}</div>
        <div class="user-info-edit" @click="modify">修改个人信息</div>
        <div class="user-info-exit" @click="exit">退出登录</div>
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

    <!-- 编辑人员信息模态框 -->
    <el-dialog
      title="编辑人员信息"
      :visible.sync="dialogVisibleEdit"
      width="30%"
      :before-close="handleCloseEdit"
    >
      <el-form
        ref="editForm"
        :model="editForm"
        label-width="auto"
        label-position="left"
      >
        <el-form-item label="修改头像">
          <el-upload
            class="avatar-uploader"
            :action="'http://localhost:8888' + '/uploads'"
            :show-file-list="false"
            :on-success="afterUpload"
          >
            <img v-if="editForm.imgUrl" :src="editForm.imgUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="姓名:" prop="name">
          <el-input v-model="editForm.name" size="mini" disabled=""></el-input>
        </el-form-item>
        <el-form-item label="密码:">
          <el-input v-model="editForm.password" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="性别:" prop="sex">
          <el-input v-model="editForm.sex" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="手机号:" prop="phone">
          <el-input
            v-model="editForm.phone"
            size="mini"
            maxlength="11"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleEdit = false" size="mini"
          >取 消</el-button
        >
        <el-button
          type="primary"
          @click="submitEditForm('editForm')"
          size="mini"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar";
import axios from "axios";

export default {
  components: {
    NavBar
  },
  created() {
    this.getUserInfo();
    this.editForm.name = this.userInfo.username;
    this.editForm.sex = this.userInfo.sex;
    this.editForm.phone = this.userInfo.phone;
    this.editForm.imgUrl = this.userInfo.imgUrl
  },
  data() {
    return {
      userInfo: "",
      editForm: {
        name: "",
        password: "",
        sex: "",
        phone: "",
        imgUrl: "",
      },
      dialogVisibleEdit: false,
      userInfo: ""
    };
  },
  methods: {
    handleCloseEdit() {
      this.dialogVisibleEdit = false;
    },
    afterUpload(url) {
      this.editForm.imgUrl = url
    },
    // 查询登录用户信息
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
        localStorage.setItem("userInfo", JSON.stringify(res.data));
      });
    },
    exit() {
      this.$alert("请确认是否退出该账号？", "退出", {
        confirmButtonText: "确定",
        callback: action => {
          if (action == "confirm") {
            this.$message({
              type: "success",
              message: `退出成功`
            });
            localStorage.setItem("token", "");
            this.$router.push("/");
          }
        }
      });
    },
    modify() {
      this.dialogVisibleEdit = true;
      this.editForm.name = this.userInfo.username;
      this.editForm.sex = this.userInfo.sex;
      this.editForm.phone = this.userInfo.phone;
      this.editForm.password = this.userInfo.password;
    },
    submitEditForm() {
      axios({
        method: "POST",
        url: `http://localhost:8888/users/update/${this.userInfo._id}`,
        data: {
          username: this.editForm.name,
          sex: this.editForm.sex,
          password: this.editForm.password,
          phone: this.editForm.phone,
          imgUrl: this.editForm.imgUrl,
        }
      }).then(res => {
        this.dialogVisible = false;
        this.$message({
          type: res.data.type,
          message: res.data.msg + "，请重新登录"
        });
        localStorage.setItem("token", "");
        this.$router.push("/");
        // this.handleGetUsers();
      });
    }
  }
};
</script>

<style scoped>
.el-header {
  background: #378ace;
  height: 50px !important;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #f1f1f1;
}
.header-title {
  font-weight: bold;
  font-size: 18px;
}
.user-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #ffffff;
}
.user-info img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
}
.user-info-username {
  margin: 0 8px;
}
.user-info-edit,
.user-info-exit {
  cursor: pointer;
  padding: 5px;
  margin-left: 15px;
  /* border: 1px solid #f5f5f5f5; */
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  line-height: 100px;
  text-align: center;
  border: 1px dotted #aaa;
}
.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: block;
  object-fit: cover;
}
.user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}
</style>
