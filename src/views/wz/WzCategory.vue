<template>
  <div class="create-category">
    <div class="c-serach-bar">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="grid-content bg-purple d-flex">
            <div style="width: 100px;" class="search-item">分类名称:</div>
            <el-input
              type="text"
              size="mini"
              placeholder="请输入分类名称"
              v-model="searchName"
            />
          </div>
        </el-col>
        <el-col :span="2">
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="search"
            round
            >搜索</el-button
          >
        </el-col>
      </el-row>
      <!-- <el-row> 
        <el-col :span="24" v-if="show">
          <el-button size="mini" type="primary" @click="addCategory"
            >添加物资分类</el-button
          >
        </el-col>
      </el-row> -->
      <div style="text-align: right" v-if="show">
        <el-button size="mini" type="primary" @click="addCategory"
            >添加物资分类</el-button
          >
      </div>
    </div>
    <!-- 表格部分 -->
    <div class="c-container">
      <el-table
        :data="searchData"
        border
        style="width: 100%"
        :cell-style="{ textAlign: 'center' }"
        :header-cell-style="{ background: '#fafafa', textAlign: 'center' }"
      >
        <el-table-column
          label="序号"
          type="index"
          width="50">
        </el-table-column>
        <el-table-column label="分类编码">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.code }}</span>
          </template>
        </el-table-column>
        <el-table-column label="分类名称">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="描述">
          <template slot-scope="scope">
            <span>{{ scope.row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" v-if="show">
          <template slot-scope="scope">
            <el-button
              size="mini"
              circle
              type="primary"
              icon="el-icon-edit"
              @click="handleEdit(scope.$index, scope.row)"
            ></el-button>
            <el-button
              size="mini"
              @click="handleDelete(scope.$index, scope.row)"
              type="info"
              icon="el-icon-delete"
              circle
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

    <!-- 弹出增加模态框 -->
    <el-dialog
      title="添加物资"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleCloseDialog"
    >
      <el-form
        ref="addForm"
        :model="addForm"
        label-width="auto"
        :rules="categoryRules"
      >
        <el-form-item label="分类编码:" prop="code">
          <el-input size="mini" v-model="addForm.code"></el-input>
        </el-form-item>
        <el-form-item label="分类名称:" prop="name">
          <el-input size="mini" v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="描述:" prop="description">
          <el-input v-model="addForm.description"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="handleSubmit('addForm')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 弹出修改模态框 -->
    <el-dialog
      title="修改物资"
      :visible.sync="dialogVisible2"
      width="30%"
      :before-close="handleCloseDialog2"
    >
      <el-form
        ref="editForm"
        :model="editForm"
        label-width="auto"
        :rules="categoryRules"
      >
        <el-form-item label="分类编码:" prop="code">
          <el-input size="mini" v-model="editForm.code"></el-input>
        </el-form-item>
        <el-form-item label="分类名称:" prop="name">
          <el-input size="mini" v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="描述:" prop="description">
          <el-input v-model="editForm.description"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible2 = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="handleEditSubmit()"
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
      dialogVisible: false,
      dialogVisible2: false,
      addForm: {},
      editForm: {
        code: "",
        name: "",
        description: ""
      },
      searchName: "",
      categories: [],
      categoryRules: {
        code: { required: true, message: "请填写物资分类编码" },
        name: { required: true, message: "请填写物资分类名称" },
        description: { required: true, message: "请填写物资分类的描述信息" }
      },
      show: true,
      show2: true,
      searchData: [],
      page: 1,
    };
  },
  async mounted() {
    this.handleGetCategory();
    this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (this.userInfo.type != "校管理员") {
      this.show = false;
    }
  },
  methods: {
    handleEdit(index, row) {
      this.dialogVisible2 = true;
      // console.log(row)
      this.editForm.code = row.code;
      this.editForm.name = row.name;
      this.editForm.row = row;
      this.editForm.description = row.description;
    },
    handleEditSubmit() {
      let row = this.editForm.row;
      this.$http({
        method: "PUT",
        url: `http://localhost:8888/category/${row._id}`,
        data: {
          code: this.editForm.code,
          name: this.editForm.name,
          description: this.editForm.description
        }
      }).then(res => {
        if (res.status == 200) {
          this.$message({
            type: "success",
            message: "修改成功!"
          });
          this.dialogVisible2 = false;
          this.handleGetCategory();
        }
      });
    },
    handleDelete(index, row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http({
            method: "delete",
            url: `http://localhost:8888/category/${row._id}`
          }).then(res => {
            this.handleGetCategory();
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
    addCategory() {
      this.dialogVisible = true;
    },
    handleCloseDialog() {
      this.dialogVisible = false;
    },
    handleCloseDialog2() {
      this.dialogVisible2 = false;
    },
    search() {
      if (this.searchName == "") {
        this.searchData = this.categories;
      }
      if (this.searchName != "") {
        this.searchData = this.searchData.filter(item => {
          return item.name == this.searchName;
        });
      }
    },
    // 添加物资分类
    handleSubmit(form) {
      this.$refs[form].validate(valid => {
        if (!valid) {
          this.$message.error("请仔细查看提交信息是否正确！");
          return;
        }
        this.$http({
          url: "http://localhost:8888/category/add",
          method: "POST",
          data: {
            code: this.addForm.code,
            name: this.addForm.name,
            description: this.addForm.description
          }
        }).then(res => {
          this.$message({
            message: res.data.msg,
            type: "info"
          });
          this.dialogVisible = false;
          this.handleGetCategory();
        });
      });
      // this.$refs[form].validate(valid => {
      //   console.log(valid)
      // })
    },
    handleCurrentChange(page) {
      this.page = page;
      this.handleGetCategory();
    },
    handleGetCategory() {
      this.$http({
        url: "http://localhost:8888/category",
        method: "POST",
        data: {
          page: this.page,
        }
      }).then(res => {
        this.categories = res.data;
        this.searchData = res.data;
      });
    }
  }
};
</script>
<style scoped>
.c-serach-bar {
  font-size: 15px;
  margin-bottom: 20px;
}
.search-item {
  color: #555555;
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
