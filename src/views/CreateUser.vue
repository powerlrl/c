<template>
  <div class="create-user" v-loading="loading">
    <div class="c-serach-bar">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="grid-content bg-purple d-flex">
            <div style="width: 100px;" class="search-item">用户名:</div>
            <el-input
              type="text"
              size="mini"
              placeholder="请输入用户名"
              v-model="searchName"
            />
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple d-flex">
            <div style="width: 80px;" class="search-item">人员类型：</div>
            <!-- <el-input type="text" size="small" placeholder="请选择人员的类型" /> -->
            <el-select v-model="selectValue" placeholder="请选择" size="mini">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="12">
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="search"
            round
            >搜索</el-button
          >
          <el-button
            size="mini"
            icon="el-icon-plus"
            type="primary"
            plain
            round
            @click="addUser"
            >添加人员</el-button
          >
          <el-button
            size="mini"
            icon="el-icon-refresh-left"
            type="info"
            plain
            round
            @click="searchData = tableData"
            >重置</el-button
          >
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px; text-align: right;">
        <download-excel
          :data="json_data"
          :fields="json_fields" 
          name="用户信息统计列表"
        >
          <el-button size="mini" type="primary">导出Excel</el-button>
        </download-excel>
      </el-row>
    </div>
    <!-- 表格部分 -->

    <div class="c-container">
      <el-table
        border
        :data="searchData"
        style="width: 100%"
        :cell-style="{ textAlign: 'center' }"
        :header-cell-style="{ background: '#fafafa', textAlign: 'center' }"
      >
      <el-table-column
          label="序号"
          type="index"
          width="50">
        </el-table-column>
        <el-table-column label="头像" width="200">
          <template slot-scope="scope">
            <img :src="scope.row.imgUrl" alt="" class="user-avatar">
          </template>
        </el-table-column>
        <el-table-column label="用户名" width="200">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.username }}</span>
          </template>
        </el-table-column>
        <el-table-column label="性别" width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.sex }}</span>
          </template>
        </el-table-column>
        <el-table-column label="手机号" width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.phone }}</span>
          </template>
        </el-table-column>
        <el-table-column label="人员类型" width="200">
          <template slot-scope="scope">
            <el-tag size="medium">{{ scope.row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              circle
              @click="handleEdit(scope.$index, scope.row)"
            ></el-button>
            <el-button
              size="mini"
              type="info"
              icon="el-icon-delete"
              circle
              @click="handleDelete(scope.$index, scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="paginatioin">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="20"
          :page="page"
          :page-size="10"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </div>

    <!-- 添加人员模态框 -->
    <el-dialog
      title="添加人员信息"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleCloseDialog"
    >
      <el-form
        ref="addForm"
        :model="addForm"
        label-width="auto"
        label-position="left"
        :rules="addRules"
      >
        <el-form-item label="上传头像">
          <el-upload
            class="avatar-uploader"
            :action="'http://localhost:8888' + '/uploads'"
            :show-file-list="false"
            :on-success="afterUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <el-form-item label="姓名:" prop="name">
          <el-input v-model="addForm.name" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="密码:" prop="password">
          <el-input v-model="addForm.password" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="性别:" prop="sex">
          <el-input v-model="addForm.sex" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="手机号:" prop="phone">
          <el-input
            v-model="addForm.phone"
            size="mini"
            maxlength="11"
          ></el-input>
        </el-form-item>
        <el-form-item label="人员类型:" prop="type">
          <!-- <el-input v-model="addForm.type" size="mini"></el-input> -->
          <el-select v-model="addForm.type" placeholder="请选择" size="small">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="submitAddForm('addForm')" size="mini"
          >确 定</el-button
        >
      </span>
    </el-dialog>

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
        :rules="addRules"
      >
      <el-form-item label="修改头像">
          <el-upload
            class="avatar-uploader"
            :action="'http://localhost:8888' + '/uploads'"
            :show-file-list="false"
            :on-success="afterUpload2"
          >
            <img v-if="editForm.imgUrl" :src="editForm.imgUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="姓名:" prop="name">
          <el-input disabled="" v-model="editForm.name" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="密码:" prop="password">
          <el-input
            v-model="editForm.password"
            size="mini"
            type="password"
          ></el-input>
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
        <el-form-item  label="人员类型:" prop="type">
          <el-input disabled="" v-model="editForm.type" size="mini"></el-input>
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
import axios from "axios";
export default {
  data() {
    return {
      imageUrl: "",
      selectValue: "",
      page: 1,
      options: [
        {
          value: "校管理员",
          label: "校管理员"
        },
        {
          value: "采购员",
          label: "采购员"
        },
        {
          value: "后勤人员",
          label: "后勤人员"
        },
        {
          value: "财务人员",
          label: "财务人员"
        }
      ],
      searchName: "",
      dialogVisible: false,
      addForm: {
        name: "",
        password: "",
        sex: "",
        phone: "",
        type: []
      },
      tableData: [],
      searchData: [],
      addRules: {
        name: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          { min: 2, max: 7, message: "长度在 2 到 7 个字符", trigger: "blur" }
        ],
        sex: [
          { required: true, message: "请输入性别", trigger: "blur" },
          { min: 1, max: 1, message: "长度在 2 到 7 个字符", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { message: "长度在 2 到 7 个字符", trigger: "blur" }
        ],
        type: [{ required: true, message: "请选择人员类型", trigger: "change" }]
      },
      dialogVisibleEdit: false,
      editForm: {
        name: "",
        password: "",
        sex: "",
        phone: "",
        type: "",
        imgUrl: "",
      },
      editRules: {
        name: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          { min: 2, max: 7, message: "长度在 2 到 7 个字符", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        sex: [
          { required: true, message: "请输入性别", trigger: "blur" },
          { min: 1, max: 1, message: "长度在 2 到 7 个字符", trigger: "blur" }
        ],
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { message: "长度在 2 到 7 个字符", trigger: "blur" }
        ],
        type: [
          { required: true, message: "请输入人员类型", trigger: "blur" },
          { min: 2, max: 7, message: "长度在 2 到 7 个字符", trigger: "blur" }
        ]
      },
      json_fields: {
        //导出Excel表格的表头设置
        用户名: "username",
        性别: "sex",
        手机号: "phone",
        人员类型: "type"
      },
      json_data: [],
      loading: false,
      total: 10,
    };
  },
  async mounted() {
    this.handleGetUsers();
  },
  methods: {
    handleEdit(index, row) {
      axios.get(`http://localhost:8888/users/${row._id}`).then(res => {
        this.editForm.name = res.data.username;
        this.editForm.password = res.data.password;
        this.editForm.sex = res.data.sex;
        this.editForm.phone = res.data.phone;
        this.editForm.type = res.data.type;
        this.editForm.id = row._id;
        this.editForm.imgUrl = row.imgUrl;
      });
      this.dialogVisibleEdit = true;
    },
    handleDelete(index, row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          axios
            .delete(`http://localhost:8888/users/delete/${row._id}`)
            .then(res => {
              this.handleGetUsers();
            });
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    addUser() {
      this.dialogVisible = true;
      // console.log("添加人员")
    },
    handleCloseDialog() {
      this.dialogVisible = false;
    },
    handleValidate() {
      this.$refs[form].validate(valid => {
        if (valid) {
          alert("submit");
          this.dialogVisible = false;
        } else {
          const h = this.$createElement;
          this.$notify({
            title: "Tips",
            message: h(
              "i",
              { style: "color: teal" },
              "请检查提交信息是否符合规范"
            )
          });
          return false;
        }
      });
    },
    submitAddForm(form) {
      // this.handleValidate(form)
      this.$refs[form].validate(valid => {
        if (valid) {
          axios({
            method: "POST",
            url: "http://localhost:8888/users/create",
            data: {
              username: this.addForm.name,
              password: this.addForm.password,
              sex: this.addForm.sex,
              phone: this.addForm.phone,
              type: this.addForm.type,
              imgUrl: this.imageUrl
            }
          }).then(res => {
            this.dialogVisible = false;
            this.$message({
              type: res.data.type,
              message: res.data.msg
            });
            this.handleGetUsers();
          });
          // this.dialogVisible = false;
        } else {
          const h = this.$createElement;
          this.$notify({
            title: "Tips",
            message: h(
              "i",
              { style: "color: teal" },
              "请检查提交信息是否符合规范"
            )
          });
          return false;
        }
      });
    },
    submitEditForm(form) {
      // this.$refs[form].validate(valid => {
      //   if (valid) {
      //     alert("submit");
      //     this.dialogVisibleEdit = false;
      //   } else {
      //     const h = this.$createElement;
      //     this.$notify({
      //       title: "Tips",
      //       message: h(
      //         "i",
      //         { style: "color: teal" },
      //         "请检查提交信息是否符合规范"
      //       )
      //     });
      //     return false;
      //   }
      // });

      axios({
        method: "POST",
        url: `http://localhost:8888/users/update/${this.editForm.id}`,
        data: {
          username: this.editForm.name,
          sex: this.editForm.sex,
          password: this.editForm.password,
          phone: this.editForm.phone,
          imgUrl: this.editForm.imgUrl,
        }
      }).then(res => {
        this.handleGetUsers()
        this.dialogVisibleEdit = false;
        this.$message({
          type: res.data.type,
          message: "修改成功"
        });
      });
    },
    // 编辑
    handleCloseEdit() {
      this.dialogVisibleEdit = false;
    },
    // 查询用户信息列表的
    handleGetUsers() {
      this.loading = true
      axios({
        method: "POST",
        url: "http://localhost:8888/users",
        data: {
          page: this.page
        }
      }).then(res => {
        this.loading = false;
        this.tableData = res.data;
        this.searchData = res.data;
        this.json_data = this.searchData;
        this.total = res.data.length;
      });
    },
    search() {
      this.searchData = this.tableData.filter(item => {
        if (this.searchName && this.selectValue) {
          this.json_data = this.searchData;
          return (
            this.searchName == item.username && this.selectValue == item.type
          );
        }
        if (this.searchName && this.selectValue == "") {
          this.json_data = this.searchData;
          return this.searchName == item.username;
        }
        if (this.searchName == "" && this.selectValue) {
          this.json_data = this.searchData;
          return this.selectValue == item.type;
        }
      });
    },
    handleCurrentChange(page) {
      this.page = page;
      this.handleGetUsers();
    },
    afterUpload(url) {
      this.imageUrl = url;
    },
    afterUpload2(url) {
      this.editForm.imgUrl = url
      this.$message("上传成功")
    }
  }
};
</script>
<style scoped>
.c-serach-bar {
  font-size: 15px;
}
.search-item {
  color: #555555;
}
.c-container {
  margin-top: 10px;
}
.paginatioin {
  margin-top: 30px;
  width: 100%;
  text-align: right;
}
.d-flex {
  display: flex;
  justify-content: center;
  align-items: center;
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
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}
</style>
