<template>
  <div class="map-container">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="box-card" style="width: 100%;">
          <el-table
            :data="mapData"
            border
            style="width: 100%; font-size: 12px;"
          >
            <el-table-column prop="name" label="名称" width="100">
            </el-table-column>
            <!-- <el-table-column prop="econNum" label="数量" width="80">
            </el-table-column> -->
            <el-table-column prop="econNum" label="数量" width="80">
              <template slot-scope="scope">
                <el-tag effect="plain" disable-transitions size="mini"
                  >{{ scope.row.econNum }}人</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column prop="addecon_new" label="较昨日" width="100">
              <template slot-scope="scope">
                <el-tag
                  disable-transitions
                  size="mini"
                  type="danger"
                  effect="plain"
                  >{{ scope.row.addecon_new }}人</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column prop="time" label="时间"></el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card" :body-style="{paddingTop: '5px'}" style="width: 100%; color: #909399; font-size: 12px;">
          <p>Top10城市</p>
          <el-table
            :data="topTen"
            style="width: 100%; font-size: 12px;"
            stripe
          >
            <el-table-column prop="name" label="城市名称"></el-table-column>
            <el-table-column prop="ename" label="English"> </el-table-column>
            <el-table-column prop="jwsrNum" label="确诊输入">
              <template slot-scope="scope">
                <el-tag
                  disable-transitions
                  size="mini"
                  type="warning"
                  effect="plain"
                  >{{ scope.row.jwsrNum }}人</el-tag
                >
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      mapData: [],
      arr: [],
      topTen: []
    };
  },
  created() {
    this.$http({
      method: "GET",
      url: "/fymap2020_data.d.json"
    }).then(res => {
      let data = res.data.data;
      this.arr[0] = {
        name: "现存确诊",
        econNum: data.econNum,
        addecon_new: data.add_daily.addecon_new,
        time: data.times
      };
      this.arr[1] = {
        name: "累计境外输入",
        econNum: data.jwsrNum,
        addecon_new: data.add_daily.addjwsr,
        time: data.times
      };
      this.arr[2] = {
        name: "现无症状",
        econNum: data.asymptomNum,
        addecon_new: data.add_daily.wjw_addsus,
        time: data.times
      };
      this.arr[3] = {
        name: "现存确诊重症",
        econNum: data.heconNum,
        addecon_new: data.add_daily.addhecon_new,
        time: data.times
      };
      this.arr[4] = {
        name: "累计确诊",
        econNum: data.gntotal,
        addecon_new: data.add_daily.addcon_new,
        time: data.times
      };
      this.arr[5] = {
        name: "累计死亡",
        econNum: data.deathtotal,
        addecon_new: data.add_daily.adddeath_new,
        time: data.times
      };
      this.arr[6] = {
        name: "累计治愈",
        econNum: data.curetotal,
        addecon_new: data.add_daily.addcure_new,
        time: data.times
      };
      this.arr[7] = {
        name: "现存疑似",
        econNum: data.sustotal,
        addecon_new: data.add_daily.addasymptom,
        time: data.times
      };
      this.mapData = this.arr;
      this.topTen = data.jwsrTop;
      console.log(this.topTen);
    });
  },
  methods: {
    
  }
};
</script>

<style scoped>
.card-item {
  display: flex;
}
.card-item > div {
  margin-left: 5px;
}
.text {
  font-size: 14px;
}

.item {
  padding: 18px 0;
}

.box-card {
  width: 480px;
  max-height: 460px;
  overflow: auto;
  /* background: red; */
}
.el-table .warning-row {
  background: red;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>