<template>
  <div class="create-category">
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
        <el-table-column label="物资分类">
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
            <span>{{ scope.row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column label="采购人员">
          <template slot-scope="scope">
            <span>{{ scope.row.purseName }}</span>
          </template> 
        </el-table-column>
        <el-table-column label="审核人员">
          <template slot-scope="scope">
            <span>{{ scope.row.accountName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="审核状态" width="140">
          <template slot-scope="scope">
            <el-tag size="mini" :type="scope.row.status=='已报销'? 'success': 'danger'">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" v-if="show">
          <template slot-scope="scope">
            <el-button size="mini"  type="primary" icon="el-icon-check" circle @click="handleAudit(scope.row)"></el-button>
            <el-button
              size="mini"
              @click="handleDelete(scope.row._id)"
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
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      dialogVisible: false,
      addForm: {},
      tableData: [],
      show: true,
      searchData: [],
      searchName: "",
      userInfo: {},
      page: 1,
    };
  },
  async mounted() {
    this.handleGetAccount();
    this.userInfo = JSON.parse(localStorage.getItem("userInfo"))
    if (this.userInfo.type != '财务人员') {
      this.show = false
    }
  },
  methods: {
    // 查询用户信息
    handleGetAccount() {
      this.$http({
        url: "http://localhost:8888/account",
        method: "POST",
        data: {
          page: this.page,
        }
      }).then(res => {
        this.tableData = res.data;
        this.searchData = res.data
      });
    },
    handleCurrentChange(page) {
      this.page = page;
      this.handleGetAccount();
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
    handleDelete(id) {
      this.$confirm("是否审核该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(res => {
          this.$http({
            method: "DELETE",
            url: `http://localhost:8888/account/${id}`,
          }).then(() => {
            this.handleGetAccount();
            this.$message({
                type: "success",
                message: "删除成功!"
              });
          })
        })
        .catch(err => {
          this.$message({
            type: "info",
            message: "已取消删除操作"
          });
        })
    },
    handleAudit(row) {
      let params = {
        status: "已报销",
        accountName: this.userInfo.username
      }
      this.$confirm("是否审核该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          axios({
            method: "POST",
            url: `http://localhost:8888/account/${row._id}`,
            data: params,
          }).then(res => {
            this.handleGetAccount();
            this.$message({
              type: "success",
              message: "审核成功!"
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消审核"
          });
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
