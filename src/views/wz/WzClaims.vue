<template>
  <div class="create-category">
    <div class="c-serach-bar">
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="grid-content bg-purple d-flex">
            <div style="width: 150px;" class="search-item">申领人工号:</div>
            <el-input
              type="text"
              size="mini"
              placeholder="请输入申领人工号"
              v-model="searchName"
            />
          </div>
        </el-col>
        <el-col :span="6">
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
    </div>
    <!-- 表格部分 -->
    <div style="margin-top: 10px; text-align: right">
      <el-button size="mini" type="primary" 
      v-if="show"
      @click="addCategory"
        >添加申领人信息</el-button
      >
    </div>
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
        <el-table-column label="申领人工号/学号">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.no }}</span>
          </template>
        </el-table-column>
        <el-table-column label="申领人姓名">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="物资分类">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.category }}</span>
          </template>
        </el-table-column>
        <el-table-column label="物品名称">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.material }}</span>
          </template>
        </el-table-column>
        <el-table-column label="物品数量">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.num }}</span>
          </template>
        </el-table-column>
        <el-table-column label="选择时间">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.applyTime | transformTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="申领状态" width="120">
          <template slot-scope="scope">
            <el-tag size="mini" effect="dark" style="margin-left: 10px">{{ scope.row.applyStatus == 0 ? '申领中': ''}}</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" v-if="show">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" circle @click="handleEdit(scope.$index, scope.row)"
              ></el-button
            >
            <el-button
              size="mini" type="info" icon="el-icon-delete" circle
              @click="handleDelete(scope.$index, scope.row)"
              ></el-button
            >
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
      title="申领"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleCloseDialog"
    >
      <el-form
        ref="addForm"
        :model="addForm"
        label-width="auto"
        :rules="applyRules"
      >
        <el-form-item label="申领人工号/学号:" prop="no" width="100">
          <el-input size="mini" v-model="addForm.no" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="申领人姓名:" prop="name" width="100">
          <el-input size="mini" v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="物资分类" prop="category" width="100">
          <el-select
            v-model="addForm.category"
            placeholder="请选择"
            size="mini"
          >
            <el-option
              v-for="item in option"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <!-- <el-input size="mini" v-model="addForm.category"></el-input> -->
        </el-form-item>
        <el-form-item label="物品名称" prop="material" width="100">
          <el-input size="mini" v-model="addForm.material"></el-input>
        </el-form-item>
        <el-form-item label="申领数量" prop="num" width="100">
          <el-input  size="mini" v-model="addForm.num"></el-input>
        </el-form-item>
        <el-form-item label="申领时间" prop="applyTime" width="100">
          <div class="block">
            <el-date-picker
             size="mini"
              v-model="addForm.applyTime"
              type="date"
              placeholder="选择日期"
            >
            </el-date-picker>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="handleSubmit('addForm')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 修改模态框 -->
     <el-dialog
      title="修改申领人信息"
      :visible.sync="dialogVisible2"
      width="30%"
      :before-close="handleCloseDialog3"
    >
      <el-form
        ref="editForm"
        :model="editForm"
        label-width="auto"
        :rules="applyRules"
      >
        <el-form-item label="申领人学号/工号:" prop="no" width="100">
          <el-input size="mini" v-model="editForm.no" type="number"></el-input>
        </el-form-item>
        <el-form-item label="申领人姓名:" prop="name" width="100">
          <el-input size="mini" v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="物资分类" prop="category" width="100">
          <!-- <el-input size="mini" v-model="editForm.category"></el-input> -->
          <el-select
            v-model="editForm.category"
            placeholder="请选择"
            size="mini"
          >
            <el-option
              v-for="item in option"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物品名称" prop="material" width="100">
          <el-input size="mini" v-model="editForm.material"></el-input>
        </el-form-item>
        <el-form-item label="申领数量" prop="num" width="100">
          <el-input  size="mini" v-model="editForm.num"></el-input>
        </el-form-item>
        <el-form-item label="申领时间" prop="applyTime" width="100">
          <div class="block">
            <el-date-picker
             size="mini"
              v-model="editForm.applyTime"
              type="date"
              placeholder="选择日期"
            >
            </el-date-picker>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible2 = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="handleEditSubmit"
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
      addForm: {
        no: "",
        name: "",
        category: "",
        material: "",
        num: "",
        applyTime: "",
        applyStatus: 0
      },
      editForm: {
        no: "",
        name: "",
        category: "",
        material: "",
        num: "",
        applyTime: "",
        applyStatus: 0
      },
      apply: [],
      dialogVisible2: false,
      applyRules: {
        no: { required: true, message: "请填写申领人学号", mix: 10, max: 10},
        name: { required: true, message: "请填写申领人姓名" },
        category: { required: true, message: "请填写物资分类" },
        material: { required: true, message: "请填写物品名称" },
        num: { required: true, message: "请填写需要申请的物品数量" },
        applyTime: { required: true, message: "请选择申请日期" }
      },
      show: true,
      userInfo: "",
      searchName: "",
      searchData: [],
      option: [],
      page: 1,
    };
  },
  async mounted() {
    this.handleGetCategory()
    this.handleGetApply()
    this.userInfo = JSON.parse(localStorage.getItem("userInfo"))
    if (this.userInfo.type != '后勤人员') {
      this.show = false
    }
  },
  methods: {
    handleGetApply() {
      this.$http({
        url: "http://localhost:8888/apply",
        method: "POST",
        data: {
          page: this.page,
        }
      }).then(res => {
        this.apply = res.data;
        this.searchData = this.apply
      });
    },
    handleCurrentChange(page) {
       this.page = page;
       this.handleGetApply();
    },
    handleEdit(index, row) {
      this.handleCloseDialog2()
      this.editForm.no = row.no
      this.editForm.name = row.name
      this.editForm.category = row.category
      this.editForm.material = row.material
      this.editForm.num = row.num
      this.editForm.applyTime = row.applyTime
      this.editForm.row = row
    },
    handleEditSubmit() {
      let row = this.editForm.row
      this.$refs["editForm"].validate(valid => {
        if (!valid) {
          this.$message.error("请仔细查看提交信息是否正确！");
          return;
        }
        this.$http({
          method: "PUT",
          url: `http://localhost:8888/apply/${row._id}`,
          data: this.editForm
        }).then(res => {
          if (res.status == 200) {
            this.$message({
              type: "success",
              message: "修改成功!"
            })
            this.dialogVisible2 = false
            this.handleGetApply()
          }
        })
      });
    },
    search() {
      if (this.searchName == "") {
        this.searchData = this.apply
      }
      if (this.searchName != '') {
        this.searchData = this.searchData.filter(item => {
          return item.no == this.searchName
        });
      }
    },
    handleCloseDialog2() {
      this.dialogVisible2 = true
    },
    handleCloseDialog3() {
      this.dialogVisible2 = false
      
    },
    handleDelete(index, row) {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          axios.delete(`http://localhost:8888/apply/${row._id}`).then(res => {
            this.handleGetApply();
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
      this.addForm.no = ""
      this.addForm.name = ""
      this.addForm.category = ""
      this.addForm.material = ""
      this.addForm.num = ""
      this.addForm.applyTime = ""
    },
    // 添加物资分类
    handleSubmit(form) {
      this.$refs[form].validate(valid => {
        if (!valid) {
          this.$message.error("请仔细查看提交信息是否正确！");
          return;
        }
        this.$http({
          url: "http://localhost:8888/apply/add",
          method: "POST",
          data: this.addForm
        }).then(res => {
          // this.apply = res.data
          this.handleGetApply()
        });
        this.dialogVisible = false;
      });
    },
    // 查询物资分类信息
    handleGetCategory() {
      this.$http({
        url: "http://localhost:8888/category",
        method: "POST",
        data: {}
      }).then(res => {
        this.option = res.data.reduce((arr, item) => {
          let obj = {};
          obj["value"] = item.name;
          obj["label"] = item.name;
          arr.push(obj);
          return arr;
        }, []);
        console.log(this.option)
      });
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
</style>
