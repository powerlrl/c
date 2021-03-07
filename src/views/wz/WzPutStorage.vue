<template>
  <div class="create-user">
    <div class="c-serach-bar">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="grid-content bg-purple d-flex">
            <div style="width: 100px;" class="search-item">物资分类:</div>
            <el-input type="text" size="small" placeholder="请输入用户名" />
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple d-flex">
            <div style="width: 120px;" class="search-item">物品名称：</div>
            <el-input type="text" size="small" placeholder="请选择人员的类型" />
          </div>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" icon="el-icon-search" size="small"
            >搜索</el-button
          >
        </el-col>
      </el-row>
    </div>
    <!-- 表格部分 -->
    <div
      style="margin-top: 40px; text-align: left; background: #fafafa; padding: 10px 0;"
    >
      <el-button size="mini" type="primary" @click="addPurchase"
        >添加物资</el-button
      >
    </div>
    <div class="c-container">
      <el-table
        :data="tableData"
        style="width: 100%"
        :cell-style="{ textAlign: 'center' }"
        :header-cell-style="{ background: '#fafafa', textAlign: 'center' }"
      >
        <el-table-column label="物资分类名称" width="120">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.category }}</span>
          </template>
        </el-table-column>
        <el-table-column label="物品名称" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.wzName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="数量" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.count }}</span>
          </template>
        </el-table-column>
        <el-table-column label="单价" width="100">
          <template slot-scope="scope">
            <span size="medium">{{ scope.row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column label="采购时间" width="100">
          <template slot-scope="scope">
            <el-tag size="medium">{{ scope.row.time }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="采购人员" width="100">
          <template slot-scope="scope">
            <span size="medium">{{ scope.row.staffName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="登记时间">
          <template slot-scope="scope">
            <el-tag size="medium">{{ scope.row.checkDate }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="登记人员">
          <template slot-scope="scope">
            <span size="medium">{{ scope.row.checkName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="paginatioin">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="1000"
        ></el-pagination>
      </div>
    </div>

    <!-- 添加人员模态框 -->
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
        <el-form-item label="物资分类名称:" prop="category">
          <el-input v-model="addForm.category" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="物品名称:" prop="wzName">
          <el-input v-model="addForm.wzName" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="数量:" prop="count">
          <el-input v-model="addForm.count" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="单价:" prop="price">
          <el-input v-model="addForm.price" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="时间:" prop="time">
          <el-input v-model="addForm.time" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="员工名称:" prop="staffName">
          <el-input v-model="addForm.staffName" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="登记时间:" prop="checkDate">
          <el-input v-model="addForm.checkDate" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="登记人员:" prop="checkName">
          <el-input v-model="addForm.checkName" size="mini"></el-input>
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
        :rules="editRules"
      >
        <el-form-item label="物资分类名称:" prop="category">
          <el-input v-model="editForm.category" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="物品名称:" prop="wzName">
          <el-input v-model="editForm.wzName" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="物品数量:" prop="count">
          <el-input v-model="editForm.count" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="单价:" prop="price">
          <el-input v-model="editForm.price" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="时间:" prop="time">
          <el-input v-model="editForm.time" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="采购人员:" prop="staffName">
          <el-input v-model="editForm.staffName" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="登记时间:" prop="checkName">
          <el-input v-model="editForm.checkDate" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="登记人员:" prop="staffName">
          <el-input v-model="editForm.checkName" size="mini"></el-input>
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
        wzName: "",
        count: "",
        price: "",
        time: "",
        staffName: "",
        checkName: "",
        checkDate: ""
      },
      tableData: [
        {
          category: "护目镜1",
          wzName: "A级别",
          count: 50,
          price: 55,
          time: "2020-10-04",
          staffName: "liuyun",
          checkName: "小林",
          checkDate: "2011-11-01"
        },
        {
          category: "护目镜2",
          wzName: "A级别",
          count: 50,
          price: 55,
          time: "2020-10-04",
          staffName: "liuyun",
          checkName: "小林2",
          checkDate: "2012-12-1"
        },
        {
          category: "护目镜3",
          wzName: "A级别",
          count: 50,
          price: 55,
          time: "2020-10-04",
          staffName: "liuyun",
          checkName: "小林3",
          checkDate: "2013-02-03"
        }
      ],
      addRules: {
        category: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ],
        wzName: [
          { required: true, message: "请输入物品名称", trigger: "blur" }
        ],
        count: [{ required: true, message: "物品数量", trigger: "blur" }],
        price: [{ required: true, message: "请输入价格", trigger: "blur" }],
        time: [{ required: true, message: "请选择日期", trigger: "blur" }],
        staffName: [
          { required: true, message: "请输入采购员姓名", trigger: "blur" }
        ],
        checkName: [
          { required: true, message: "请输入登记员的名称", trigger: "blur"},
        ],
        checkDate: [
          { required: true, message: "请选择入库日期", trigger: "blur"}
        ],
      },
      dialogVisibleEdit: false,
      editForm: {
        category: "",
        wzName: "",
        count: "",
        price: "",
        time: "",
        staffName: "",
        checkName: "",
        checkDate: "",
      },
      editRules: {
        category: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ],
        wzName: [
          { required: true, message: "请输入物品名称", trigger: "blur" }
        ],
        count: [{ required: true, message: "物品数量", trigger: "blur" }],
        price: [{ required: true, message: "请输入价格", trigger: "blur" }],
        time: [{ required: true, message: "请选择日期", trigger: "blur" }],
        staffName: [
          { required: true, message: "请输入采购员姓名", trigger: "blur" }
        ]
      }
    };
  },
  async mounted() {
    // this.handleGetUser()
  },
  methods: {
    handleEdit(index, row) {
      // console.log(row);
      console.log(row);
      this.editForm.category = row.category;
      this.editForm.wzName = row.wzName;
      this.editForm.price = row.price;
      this.editForm.count = row.count;
      this.editForm.time = row.time;
      this.editForm.staffName = row.staffName;
      this.editForm.checkName = row.checkName;
      this.editForm.checkDate = row.checkDate;
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
              console.log(res);
              this.handleGetUser();
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
    addPurchase() {
      this.dialogVisible = true;
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
              type: this.addForm.type
            }
          }).then(res => {
            this.dialogVisible = false;
            this.handleGetUser();
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
      // console.log(form)
      this.$refs[form].validate(valid => {
        if (valid) {
          alert("submit");
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
    // 编辑
    handleCloseEdit() {
      this.dialogVisibleEdit = false;
    },
    // 查询用户信息
    handleGetUser() {
      axios.get("http://localhost:8888/users").then(res => {
        console.log(res);
        this.tableData = res.data;
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
