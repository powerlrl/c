<template>
  <div class="create-category">
    <!-- 表格部分 -->
    <div style="margin-top: 10px; text-align: right">
      <el-button size="mini" type="primary" @click="addCategory">添加物资</el-button>
    </div>
    <div class="c-container">
      <el-table
        :data="categories"
        style="width: 100%"
        :cell-style="{textAlign: 'center'}"
        :header-cell-style="{background: '#fafafa', textAlign: 'center'}"
      >
        <el-table-column label="分类编码" width="200">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.categoryId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="分类名称" width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.categoryName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="描述" width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.description }}</span>
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

    <!-- 弹出模态框 -->
    <el-dialog title="添加物资" :visible.sync="dialogVisible" width="30%" :before-close="handleCloseDialog">
      <el-form ref="addForm" :model="addForm" label-width="auto" :rules="categoryRules">
        <el-form-item label="分类编码:" prop="categoryId">
          <el-input size="mini" v-model="addForm.categoryId"></el-input>
        </el-form-item>
        <el-form-item label="分类名称:" prop="categoryName">
          <el-input size="mini" v-model="addForm.categoryName"></el-input>
        </el-form-item>
         <el-form-item label="描述:" prop="description">
          <el-input  v-model="addForm.description"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="handleSubmit('addForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  data() {
    return {
      dialogVisible: false,
      addForm: {},
      categories: [
        {
          categoryId: "01",
          categoryName: "消毒水",
          description: "这是一个消毒水"
        },
        {
          categoryId: "02",
          categoryName: "消毒水",
          description: "这是一个消毒水"
        },
        {
          categoryId: "03",
          categoryName: "消毒水",
          description: "这是一个消毒水"
        },
        {
          categoryId: "04",
          categoryName: "消毒水",
          description: "这是一个消毒水"
        },
        {
          categoryId: "05",
          categoryName: "消毒水",
          description: "这是一个消毒水"
        }
      ],
      categoryRules: {
        categoryId: {required: true, message: "请填写物资分类编码"},
        categoryName: {required: true, message: "请填写物资分类名称"},
        description: {required: true, message: "请填写物资分类的描述信息"},
      },
    };
  },
 async mounted() {
    
  },
  methods: {
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
    addCategory() {
      this.dialogVisible = true;
      
    },
    handleCloseDialog() {
      this.dialogVisible = false;
    },
    // 添加物资分类
    handleSubmit(form) {
      this.$refs[form].validate(valid => {
        if (!valid) {
          this.$message.error('请仔细查看提交信息是否正确！');
          return
        }
        this.$message({
          message: '提交成功！',
          type: 'success'
        });
        this.dialogVisible = false
      })
      // this.$refs[form].validate(valid => {
      //   console.log(valid)
      // })
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
