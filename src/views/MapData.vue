<template>
  <div class="map-container" v-loading="loading">
    <el-row>
      <div class="map-panel" v-if="Object.keys(chinaTotal).length !== 0">
        <div class="num-card">
          <h3>境外输入</h3>
          <div class="num color-o">{{ chinaTotal.total.input }}</div>
          <span class="num-yes">较昨日</span><span class="color-o">+{{ chinaTotal.today.input }}</span>
        </div>
        <div class="num-card">
          <h3>无症状感染者</h3>
          <div class="num color-h">{{ chinaTotal.extData.noSymptom }}</div>
          <span class="num-yes">较昨日</span><span class="color-h">+{{ chinaTotal.extData.incrNoSymptom }}</span> 
        </div>
        <div class="num-card">
          <h3>现有确诊</h3>
          <div class="num color-r">{{ storeConfirm }}</div>
          <span class="num-yes">较昨日</span><span class="color-r">+{{ chinaTotal.today.storeConfirm }}</span>
        </div>
        <div class="num-card">
          <h3>累计确诊</h3>
          <div class="num color-e">{{ chinaTotal.total.confirm }}</div>
          <span class="num-yes">较昨日</span><span class="color-e">+{{ chinaTotal.today.confirm }}</span>
        </div>
        <div class="num-card">
          <h3>累计死亡</h3>
          <div class="num color-e">{{ chinaTotal.total.dead }}</div>
          <span class="num-yes">较昨日</span><span class="color-e">+{{ chinaTotal.today.dead }}</span>
        </div>
        <div class="num-card">
          <h3>累计治愈</h3>
          <div class="num color-g">{{ chinaTotal.total.heal }}</div>
          <span class="num-yes">较昨日</span><span class="color-g">+{{ chinaTotal.today.heal }}</span>
        </div>
      </div>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="13">
        <!-- 疫情地图 -->
        <div class="map-yq">
          <div id="chart" style="width: 600px;height: 500px"></div>
        </div>
      </el-col>
      <el-col :span="11">
        <el-card
        >
          <p>Top10城市</p>
          <el-table :data="topTen" style="width: 100%; font-size: 12px; height: 400px;overflow: auto" stripe>
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
import "echarts/map/js/china.js";
export default {
  data() {
    return {
      mapData: [],
      arr: [],
      topTen: [],
      myChinaChart: "",
      lists: [],
      chinaTotal: {
      },
      chinaDayList: [],
      storeConfirm: "",
      loading: false,
    };
  },
  created() {
    this.loading = true
    this.$http({
      method: "GET",
      url: "/163"
    }).then(res => {
      this.chinaTotal = res.data.data.chinaTotal
      this.chinaDayList = res.data.data.chinaDayList
      this.storeConfirm = this.chinaDayList[this.chinaDayList.length - 1].total.storeConfirm
      console.log(this.storeConfirm)
    })

    this.$http({
      method: "GET",
      url: "/api/fymap2020_data.d.json"
    }).then(res => {
      let data = res.data.data;
      this.lists = res.data.data.list;
      this.mapData = this.arr;
      this.topTen = data.jwsrTop;
      this.loading = false
      this.getData();
    });
  },
  mounted() {

  },
  methods: {
    getData() {
      this.myChinaChart = this.$echarts.init(document.getElementById("chart"));
      let option = {
        title: {
          text: "疫情地图一览",
          x: "center",
          textStyle: {
            color: "#9c0505"
          }
        },
        tooltip: {
          tirgger: "item",
          formatter: "地区：{b}<br/>确诊：{c}"
        },
        series: [
          {
            type: "map",
            map: "china",
            data: [],
            label: {
              show: true,
              color: "black",
              fontSize: 10
            },
            zoom: 1.25,
            itemStyle: {
              borderColor: "gray"
            },
            emphasis: {
              label: {},
              itemStyle: {}
            }
          }
        ]
      };
      option.series[0].data = this.lists;
      // 使用刚指定的配置项和数据显示图表。
      this.myChinaChart.setOption(option);
    }
  }
};
</script>

<style scoped>
* {
  padding: 0;
  margin: 0;
}
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
  /* max-height: 460px;
  overflow: auto; */
  /* background: red; */
}
.el-table .warning-row {
  background: red;
}

.el-table .success-row {
  background: #f0f9eb;
}
.map-panel {
  padding: 20px 80px 50px 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.num {
  font-size: 35px;
  font-weight: 900;
  padding: 10px 0;
}
.color-o {
  color: #ffa352;
}
.color-h {
  color: #791618;
}
.color-r {
  color: #e44a3d;
}
.color-e {
  color: #a31d13;
}
.color-b {
  color: #333333;
}
.color-g {
  color: #34aa70;
}
.num-card {
  /* padding: 20px; */
  padding-right: 20px;
  border-right: 1px solid #eeeeee;
}
.num-card .num-yes {
  font-size: 14px;
  color: #777777;
}
</style>