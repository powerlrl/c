<template>
  <div class="create-user">
    <div class="c-serach-bar">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="grid-content bg-purple d-flex">
            <div style="width: 100px;" class="search-item">分类名称:</div>
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
    <div style="text-align: right;padding: 10px 0;">
      <el-row :gutter="22">
        <el-col :span="19"> </el-col>
        <el-col :span="2"> </el-col>
      </el-row>
      <div style="display: flex; justify-content: flex-end">
        <el-button size="mini" type="primary" v-if="show" @click="addPurchase"
          >创建采购计划</el-button
        >
        <download-excel
          :data="json_data"
          :fields="json_fields"
          name="采购物资统计表"
        >
          <el-button size="mini" style="margin-left: 10px;" type="primary">导出采购物资表</el-button>
        </download-excel>
      </div>
    </div>
    <div class="c-container">
      <el-table
        border
        :data="searchData"
        style="width: 100%"
        :cell-style="{ textAlign: 'center' }"
        :header-cell-style="{ background: '#fafafa', textAlign: 'center' }"
      >
        <el-table-column label="序号" type="index" width="50">
        </el-table-column>
        <el-table-column label="物资分类名称">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.category }}</span>
          </template>
        </el-table-column>
        <el-table-column label="物品名称">
          <template slot-scope="scope">
            <span>{{ scope.row.material }}</span>
          </template>
        </el-table-column>
        <el-table-column label="数量">
          <template slot-scope="scope">
            <span>{{ scope.row.num }}</span>
          </template>
        </el-table-column>
        <el-table-column label="单价">
          <template slot-scope="scope">
            <span size="medium">{{ scope.row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column label="采购时间">
          <template slot-scope="scope">
            <span size="medium">{{
              scope.row.purseTime | transformTime('yyyy-mm-dd')
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="采购人员">
          <template slot-scope="scope">
            <span size="medium">{{ scope.row.purseUserName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" v-if="show">
          <template slot-scope="scope">
            <div>
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-edit"
                circle
                @click="handleEdit(scope.$index, scope.row)"
              ></el-button>
              <el-button
                size="mini"
                @click="handleDelete(scope.$index, scope.row)"
                type="info"
                icon="el-icon-delete"
                circle
              ></el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="paginatioin">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="100"
          :page="page"
          :page-size="10"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </div>

    <!-- 添加人员模态框 -->
    <el-dialog
      title="添加采购计划"
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
          <!-- <el-input v-model="addForm.category" size="mini"></el-input> -->
        </el-form-item>
        <el-form-item label="物品名称:" prop="material">
          <el-input v-model="addForm.material" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="数量:" prop="num">
          <el-input v-model="addForm.num" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="单价:" prop="price">
          <el-input v-model="addForm.price" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="时间:" prop="purseTime">
          <div class="block">
            <el-date-picker
              size="mini"
              v-model="addForm.purseTime"
              type="date"
              placeholder="选择日期"
            >
            </el-date-picker>
          </div>
          <!-- <el-input v-model="addForm.purseTime" size="mini"></el-input> -->
        </el-form-item>
        <el-form-item label="采购员姓名:" prop="purseUserName">
          <el-input
            disabled=""
            v-model="userInfo.username"
            size="mini"
          ></el-input>
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
      title="编辑采购信息"
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
          <el-select
            v-model="editForm.category"
            placeholder="请选择物资分类"
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
          <!-- <el-input v-model="editForm.category" size="mini"></el-input> -->
        </el-form-item>
        <el-form-item label="物品名称:" prop="material">
          <el-input v-model="editForm.material" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="物品数量:" prop="num">
          <el-input v-model="editForm.num" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="单价:" prop="price">
          <el-input v-model="editForm.price" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="时间:" prop="purseTime">
          <el-input v-model="editForm.purseTime" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="采购员">
          <el-input
            disabled=""
            v-model="editForm.purseUserName"
            size="mini"
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
        purseUserName: ""
      },
      tableData: [],
      addRules: {
        category: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ],
        material: [
          { required: true, message: "请输入物品名称", trigger: "blur" }
        ],
        num: [{ required: true, message: "请输入物品数量", trigger: "blur" }],
        price: [{ required: true, message: "请输入价格", trigger: "blur" }],
        purseTime: [{ required: true, message: "请选择日期", trigger: "blur" }]
      },
      dialogVisibleEdit: false,
      editForm: {
        category: "",
        material: "",
        num: "",
        price: "",
        purseTime: "",
        purseUserName: ""
      },
      editRules: {
        category: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ],
        material: [
          { required: true, message: "请输入物品名称", trigger: "blur" }
        ],
        num: [{ required: true, message: "物品数量", trigger: "blur" }],
        price: [{ required: true, message: "请输入价格", trigger: "blur" }],
        purseTime: [{ required: true, message: "请选择日期", trigger: "blur" }],
        purseUserName: [
          { required: true, message: "请输入采购员姓名", trigger: "blur" }
        ]
      },
      show: true,
      searchData: [],
      searchName: "",
      categories: [],
      option: [],
      userInfo: {},
      page: 1,
      json_fields: {
        //导出Excel表格的表头设置
        物资分类名称: "category",
        物品名称: "material",
        数量: "num",
        单价: "price",
        采购时间: "purseTime",
        采购人员: "purseUserName"
      },
      json_data: []
    };
  },
  async mounted() {
    this.handleGetPurse();
    this.handleGetCategory();
    this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (this.userInfo.type != "采购员") {
      this.show = false;
    }
  },
  methods: {
    handleEdit(index, row) {
      this.editForm.category = row.category;
      this.editForm.material = row.material;
      this.editForm.price = row.price;
      this.editForm.num = row.num;
      this.editForm.purseTime = row.purseTime;
      this.editForm.purseUserName = row.purseUserName;
      this.editForm.id = row._id;
      this.dialogVisibleEdit = true;
    },
    handleDelete(index, row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          axios.delete(`http://localhost:8888/purse/${row._id}`).then(res => {
            this.handleGetPurse();
          });
          axios.delete(`http://localhost:8888/account/${row._id}`).then(res => {
            // console.log(res)
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
    search() {
      if (this.searchName == "") {
        this.searchData = this.tableData;
      }
      if (this.searchName != "") {
        this.searchData = this.searchData.filter(item => {
          return item.material == this.searchName;
        });
      }
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
    handleCurrentChange(page) {
      this.page = page;
      this.handleGetPurse();
    },
    submitAddForm(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          axios({
            method: "POST",
            url: "http://localhost:8888/purse/add",
            data: {
              category: this.addForm.category,
              material: this.addForm.material,
              num: this.addForm.num,
              price: this.addForm.price,
              purseTime: this.addForm.purseTime,
              purseUserName: this.userInfo.username
            }
          }).then(res => {
            this.handleGetPurse();
            this.dialogVisible = false;
          });
          axios({
            method: "POST",
            url: "http://localhost:8888/account/add",
            data: {
              category: this.addForm.category,
              material: this.addForm.material,
              num: this.addForm.num,
              price: this.addForm.price,
              purseName: this.userInfo.username,
              accountName: "",
              status: "未报销"
            }
          }).then(res => {
            this.dialogVisible = false;
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
      this.$refs["editForm"].validate(valid => {
        if (valid) {
          axios({
            method: "PUT",
            url: `http://localhost:8888/purse/${this.editForm.id}`,
            data: {
              category: this.editForm.category,
              material: this.editForm.material,
              num: this.editForm.num,
              price: this.editForm.price,
              purseTime: this.editForm.purseTime
            }
          }).then(res => {
            this.handleGetPurse();
            this.$message({
              type: "success",
              message: "修改成功!"
            });
            this.dialogVisible = false;
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
    // 编辑
    handleCloseEdit() {
      this.dialogVisibleEdit = false;
    },
    // 查询用户信息
    handleGetPurse() {
      this.$http({
        url: "http://localhost:8888/purse",
        method: "POST",
        data: {
          page: this.page
        }
      }).then(res => {
        this.tableData = res.data;
        this.json_data = res.data;
        for (let i in this.tableData) {
          this.tableData[i].show = false;
          if (this.tableData[i].purseUserName == this.userInfo.username) {
            this.tableData[i].show = true;
          }
        }
        this.searchData = this.tableData;
      });
    },
    // 查询物资分类信息
    handleGetCategory() {
      this.$http({
        url: "http://localhost:8888/category",
        method: "POST",
        data: {}
      }).then(res => {
        this.categories = res.data;
        this.option = this.categories.reduce((arr, item) => {
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
</style>
