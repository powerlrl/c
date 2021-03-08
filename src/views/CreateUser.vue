<template>
  <div class="create-user">
    <div class="c-serach-bar">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="grid-content bg-purple d-flex">
            <div style="width: 100px;" class="search-item">用户名:</div>
            <el-input type="text" size="small" placeholder="请输入用户名" />
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple d-flex">
            <div style="width: 120px;" class="search-item">人员类型：</div>
            <el-input type="text" size="small" placeholder="请选择人员的类型" />
          </div>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" icon="el-icon-search" size="small">搜索</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 表格部分 -->
    <div style="margin-top: 10px; text-align: right">
      <el-button size="mini" type="primary" @click="addUser">添加人员</el-button>
    </div>
    <div class="c-container">
      <el-table
        :data="tableData"
        style="width: 100%"
        :cell-style="{textAlign: 'center'}"
        :header-cell-style="{background: '#fafafa', textAlign: 'center'}"
      >
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
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="paginatioin">
        <el-pagination background layout="prev, pager, next" :total="1000"></el-pagination>
      </div>
    </div>

    <!-- 添加人员模态框 -->
    <el-dialog title="添加人员信息" :visible.sync="dialogVisible" width="30%" :before-close="handleCloseDialog">
      <el-form ref="addForm" :model="addForm" label-width="auto" label-position="left" :rules="addRules">
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
          <el-input v-model="addForm.phone" size="mini" maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="人员类型:" prop="type">
          <el-input v-model="addForm.type" size="mini"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="submitAddForm('addForm')" size="mini">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑人员信息模态框 -->
    <el-dialog title="编辑人员信息" :visible.sync="dialogVisibleEdit" width="30%" :before-close="handleCloseEdit">
      <el-form ref="editForm" :model="editForm" label-width="auto" label-position="left" :rules="editRules">
        <el-form-item label="姓名:" prop="name">
          <el-input v-model="editForm.name" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="密码:">
          <el-input v-model="editForm.password" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="性别:" prop="sex">
          <el-input v-model="editForm.sex" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="手机号:" prop="phone">
          <el-input v-model="editForm.phone" size="mini" maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="人员类型:" prop="type">
          <el-input v-model="editForm.type" size="mini"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleEdit = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="submitEditForm('editForm')" size="mini">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      dialogVisible: false,
      addForm: {
        name: "",
        password: "",
        sex: "",
        phone: "",
        type: ""
      },
      tableData: [],
      addRules: {
        name: [
          {required: true, message: "请输入用户名称", trigger: "blur"},
          {min: 2, max: 7, message: "长度在 2 到 7 个字符", trigger: "blur"}
        ],
        sex: [
          {required: true, message: "请输入性别", trigger: "blur"},
          {min: 1, max: 1, message: "长度在 2 到 7 个字符", trigger: "blur"}
        ],
        phone: [
          {required: true, message: "请输入手机号", trigger: "blur"},
          {message: "长度在 2 到 7 个字符", trigger: "blur"}
        ],
        type: [
          {required: true, message: "请输入人员类型", trigger: "blur"},
          {min: 2, max: 7, message: "长度在 2 到 7 个字符", trigger: "blur"}
        ]
      },
      dialogVisibleEdit: false,
      editForm: {
        name: "",
        password: "",
        sex: "",
        phone: "",
        type: ""
      },
      editRules: {
        name: [
          {required: true, message: "请输入用户名称", trigger: "blur"},
          {min: 2, max: 7, message: "长度在 2 到 7 个字符", trigger: "blur"}
        ],
        password: [
          {required: true, message: "请输入密码", trigger: "blur"},
          {min: 2, max: 7, message: "长度在 2 到 7 个字符", trigger: "blur"}
        ],
        sex: [
          {required: true, message: "请输入性别", trigger: "blur"},
          {min: 1, max: 1, message: "长度在 2 到 7 个字符", trigger: "blur"}
        ],
        phone: [
          {required: true, message: "请输入手机号", trigger: "blur"},
          {message: "长度在 2 到 7 个字符", trigger: "blur"}
        ],
        type: [
          {required: true, message: "请输入人员类型", trigger: "blur"},
          {min: 2, max: 7, message: "长度在 2 到 7 个字符", trigger: "blur"}
        ]
      }
    };
  },
  async mounted() {
    this.handleGetUsers()
    // this.getUserInfo()
  },
  methods: {
    handleEdit(index, row) {
      // console.log(row);
      axios.get(`http://localhost:8888/users/${row._id}`).then(res => {
        console.log(res)
        this.editForm.name = res.data.username
        this.editForm.password = res.data.password
        this.editForm.sex = res.data.sex
        this.editForm.phone = res.data.phone
        this.editForm.type = res.data.type
        
      })
      this.dialogVisibleEdit = true;
    },
    handleDelete(index, row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          axios.delete(`http://localhost:8888/users/delete/${row._id}`).then(res => {
            console.log(res)
            this.handleGetUser()
          })
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
            message: h("i", {style: "color: teal"}, "请检查提交信息是否符合规范")
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
            },
          }).then(res => {
            console.log(res)
            this.dialogVisible = false
            this.handleGetUser()
          })
          // this.dialogVisible = false;
        } else {
          const h = this.$createElement;
          this.$notify({
            title: "Tips",
            message: h("i", {style: "color: teal"}, "请检查提交信息是否符合规范")
          });
          return false;
        }
      });
    },
    submitEditForm(form) {
      // console.log(form)
      this.$refs[form].validate(valid => {
        if (valid) {
          alert("submit");
          this.dialogVisibleEdit = false;
        } else {
          const h = this.$createElement;
          this.$notify({
            title: "Tips",
            message: h("i", {style: "color: teal"}, "请检查提交信息是否符合规范")
          });
          return false;
        }
      });
    },
    // 编辑
    handleCloseEdit() {
      
      this.dialogVisibleEdit = false;
      
    },
    // 查询用户信息列表的
    handleGetUsers() {
      axios.get("http://localhost:8888/users").then(res => {
        this.tableData = res.data;
      });
    },
   
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
</style>
