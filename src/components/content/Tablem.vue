<template>
  <div>
    <el-table :data="tableData" style="width: 100%" border>
      <el-table-column v-for="item in tableDataKey" :prop="item.prop" :label="item.propName">

      </el-table-column>
      <!-- <el-table-column prop="date" label="日期" width="180">
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="180">
      </el-table-column>
      <el-table-column prop="address" label="地址"> </el-table-column> -->
    </el-table>
  </div>
</template>
<script>
export default {
  created() {
    console.log(this.tableDataKey)
  },
  props: {
    tableData: {
      type: Array,
      default() { return [] }
    },
    tableDataKey: {
      type: Array,
      default() { return [] }
    }
  },
  data() {
    return {
      
    }
  },
}
</script>>