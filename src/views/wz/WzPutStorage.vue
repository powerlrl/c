<template>
  <div class="create-user">
    <div class="c-serach-bar">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="grid-content bg-purple d-flex">
            <div style="width: 100px;" class="search-item">物品名称:</div>
            <el-input
              type="text"
              size="mini"
              placeholder="请输入物品名称"
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
    <div
    v-if="show"
      style="text-align: right; padding: 10px 0;"
    >
      <el-button size="mini" type="primary" @click="addInput"
        >登记物资入库</el-button>
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
        <el-table-column label="物资分类" width="120">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.category }}</span>
          </template>
        </el-table-column>
        <el-table-column label="物品名称" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.material }}</span>
          </template>
        </el-table-column>
        <el-table-column label="数量" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.num }}</span>
          </template>
        </el-table-column>
        <el-table-column label="单价" width="100">
          <template slot-scope="scope">
            <span size="medium">{{ scope.row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column label="采购时间" width="120">
          <template slot-scope="scope" >
            <span size="medium" style="color: #aaa">{{
              scope.row.purseTime | transformTime('yyyy-mm-dd')
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="采购人员" width="100">
          <template slot-scope="scope">
            <span size="medium">{{ scope.row.purseNo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="登记时间" width="120">
          <template slot-scope="scope">
            <span size="medium" style="color: #aaa">{{
              scope.row.regTime | transformTime('yyyy-mm-dd')
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="登记人员">
          <template slot-scope="scope">
            <span size="medium">{{ scope.row.regName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" v-if="show">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" circle icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)"
              ></el-button
            >
            <el-button
              size="mini"
              type="info" icon="el-icon-delete" circle
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

    <!-- 入库登记态框 -->
    <el-dialog
      title="入库登记"
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
        <el-form-item label="物资分类" prop="category">
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
        <el-form-item label="物品名称:" prop="material">
          <el-input size="mini" v-model="addForm.material"></el-input>
        </el-form-item>
        <el-form-item label="物品数量:" prop="num">
          <el-input size="mini" v-model="addForm.num"></el-input>
        </el-form-item>
        <el-form-item label="单价:" prop="price">
          <el-input size="mini" v-model="addForm.price"></el-input>
        </el-form-item>
        <el-form-item label="采购人员:" prop="purseNo">
          <el-input size="mini" v-model="addForm.purseNo"></el-input>
        </el-form-item>
        <el-form-item label="采购时间:" prop="purseTime">
          <div class="block">
            <el-date-picker
              size="mini"
              v-model="addForm.purseTime"
              type="date"
              placeholder="选择日期"
            >
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="登记人员:" prop="regName">
          <el-input size="mini" disabled="" v-model="userInfo.username"></el-input>
        </el-form-item>
        <el-form-item label="登记时间:" prop="regTime">
          <div class="block">
            <el-date-picker
              size="mini"
              v-model="addForm.regTime"
              type="date"
              placeholder="选择日期"
            >
            </el-date-picker>
          </div>
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
        <el-form-item label="物资分类" prop="category">
          <el-input size="mini" v-model="editForm.category"></el-input>
        </el-form-item>
        <el-form-item label="物品名称:" prop="material">
          <el-input size="mini" v-model="editForm.material"></el-input>
        </el-form-item>
        <el-form-item label="物品数量:" prop="num">
          <el-input size="mini" v-model="editForm.num"></el-input>
        </el-form-item>
        <el-form-item label="单价:" prop="price">
          <el-input size="mini" v-model="editForm.price"></el-input>
        </el-form-item>
        <el-form-item label="采购人员:" prop="purseNo">
          <el-input size="mini" v-model="editForm.purseNo"></el-input>
        </el-form-item>
        <el-form-item size="mini" label="采购时间:" prop="purseTime">
          <div class="block">
            <el-date-picker
              size="mini"
              v-model="editForm.purseTime"
              type="date"
              placeholder="选择日期"
            >
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="登记人员:" prop="regName">
          <el-input size="mini" disabled="" v-model="userInfo.username"></el-input>
        </el-form-item>
        <el-form-item label="登记时间:" prop="regTime">
          <div class="block">
            <el-date-picker
              size="mini"
              v-model="editForm.regTime"
              type="date"
              placeholder="选择日期"
            >
            </el-date-picker>
          </div>
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
      dialogVisible: false,
      addForm: {
        category: "",
        material: "",
        num: "",
        price: "",
        purseTime: "",
        purseNo: "",
        regTime: "",
        regName: ""
      },
      page: 1,
      tableData: [],
      addRules: {
        category: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ],
        material: [
          { required: true, message: "请输入物品名称", trigger: "blur" }
        ],
        num: [{ required: true, message: "物品数量", trigger: "blur" }],
        price: [{ required: true, message: "请输入价格", trigger: "blur" }],
        purseTime: [{ required: true, message: "请选择日期", trigger: "blur" }],
        purseNo: [
          { required: true, message: "请填写采购人员姓名", trigger: "blur" }
        ],
        regTime: [
          { required: true, message: "请选择入库日期", trigger: "blur" }
        ]
      },
      show: true,
      dialogVisibleEdit: false,
      editForm: {
        category: "",
        material: "",
        num: "",
        price: "",
        purseNo: "",
        purseTime: "",
        regTime: "",
        regName: ""
      },
      userInfo: {},
      searchName: "",
      searchData: [],
      option: [],
    };
  },
  async mounted() {
    this.handleGetCategory()
    this.handleGetInput();
    this.userInfo = JSON.parse(localStorage.getItem("userInfo"))
    if (this.userInfo.type != '后勤人员') {
      this.show = false
    }
  },
  methods: {
    handleEdit(index, row) {
      // console.log(row);
      this.editForm.category = row.category;
      this.editForm.material = row.material;
      this.editForm.price = row.price;
      this.editForm.num = row.num;
      this.editForm.purseNo = row.purseNo;
      this.editForm.purseTime = row.purseTime;
      this.editForm.regName = this.userInfo.username;
      this.editForm.regTime = row.regTime;
      this.editForm.row = row;

      this.dialogVisibleEdit = true;
    },
    handleCurrentChange(page) {
      this.page = page;
      this.handleGetInput();
    },
    handleDelete(index, row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          axios.delete(`http://localhost:8888/input/${row._id}`).then(res => {
            this.handleGetInput();
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
    addInput() {
      this.dialogVisible = true;
      this.addForm.regName = this.userInfo.username
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
            url: "http://localhost:8888/input/add",
            data: this.addForm
          }).then(res => {
            this.dialogVisible = false;
            this.handleGetInput();
          });
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
      this.$refs[form].validate(valid => {
        if (valid) {
          let row = this.editForm.row;
          this.$http({
            method: "PUT",
            url: `http://localhost:8888/input/${row._id}`,
            data: this.editForm
          }).then(res => {
            if (res.status == 200) {
              this.$message({
                type: "success",
                message: "修改成功!"
              });
              this.dialogVisible2 = false;
              this.handleGetInput();
            }
          });

          this.dialogVisibleEdit = false;
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
    search() {
      if (this.searchName == "") {
        this.searchData = this.tableData
      }
      if (this.searchName != '') {
        this.searchData = this.searchData.filter(item => {
          return item.material == this.searchName
        });
      }
    },
    // 编辑
    handleCloseEdit() {
      this.dialogVisibleEdit = false;
    },
    // 查询用户信息
    handleGetInput() {
      this.$http({
        url: "http://localhost:8888/input",
        method: "POST",
        data: {
          page: this.page,
        }
      }).then(res => {
        this.tableData = res.data;
        this.searchData = this.tableData
      });
    },
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
.el-form-item {
  margin-bottom: 10px;
}
</style>
