<template>
  <div class="wz-count">
    <div class="charts-panel-wrapper">
      <div
        class="charts-panel-item"
        v-for="panel in panelTotal"
        :key="panel.name"
        :style="{background: panel.panelColor}"
      >
        <div>
          <p>{{ panel.name }}</p>
          <p>{{ panel.total }}</p>
        </div>
      </div>
    </div>
    <div class="charts-content">
      <div id="myChart"></div>
      <!-- 饼图 -->
      <div id="myPie"></div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      panelTotal: [
        {name: "分类总数", total: 101, panelColor: "#6cc9b6"},
        {name: "出库统计", total: 93, panelColor: "#71a1d1"},
        {name: "入库统计", total: 2220, panelColor: "#8c96de"},
        {name: "财务报销总计", total: 34939, panelColor: "#deae79"},
        {name: "申领总计", total: 101, panelColor: "#b03a5b"},
        {name: "用户数量", total: 88, panelColor: "#676980"}
      ]
    };
  },
  methods: {
    drawLine() {
      let myChart = this.$echarts.init(document.getElementById("myChart"));
      let myPie = this.$echarts.init(document.getElementById("myPie"));
      // 绘制图表
      myChart.setOption({
        title: {text: "采购物资统计分类"},
        tooltip: {},
        xAxis: {
          data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
        },
        yAxis: {},
        series: [
          {
            name: "销量",
            type: "bar",
            data: [5, 20, 36, 10, 10, 20]
          }
        ]
      });
      // 绘制饼图
      myPie.setOption({
        tooltip: {
          trigger: "item"
        },
        series: {
          name: "物资出库统计",
          type: "pie",
          radius: "55%",
          data: [
            {value: 235, name: "视频广告"},
            {value: 274, name: "联盟广告"},
            {value: 310, name: "邮件营销"},
            {value: 335, name: "直接访问"},
            {value: 400, name: "搜索引擎"}
          ]
        }
      });
    },
    // 查询用户信息
    handleGetUser() {
      axios.get("http://localhost:8888/users").then(res => {
        console.log(res.data.length)
        this.panelTotal[5].total = res.data.length
      });
    },
  },
  mounted() {
    this.drawLine();
    this.handleGetUser()
  }
};
</script>
<style scoped>
.charts-container {
  display: flex;
}
.charts-panel-wrapper {
  display: flex;
  flex-wrap: wrap;
}
.charts-panel-item {
  margin-bottom: 5px;
  color: #eeee;
  border-radius: 5px;
  width: 30%;
  height: 90px;
  margin-left: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.charts-content {
  display: flex;
  margin-top: 100px;
  justify-content: flex-start;
}
.charts-content > div {
  width: 400px;
  height: 300px;
}
</style>
