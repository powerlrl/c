<template>
  <div class="wz-count">
    <div class="charts-panel-wrapper">
      <div
        class="charts-panel-item"
        v-for="panel in panelTotal"
        :key="panel.name"
        :style="{ background: panel.panelColor }"
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
        { name: "分类总数", total: 0.0, panelColor: "#6cc9b6" },
        { name: "采购统计", total: 0, panelColor: "#71a1d1" },
        { name: "入库统计", total: 0, panelColor: "#8c96de" },
        { name: "财务报销总计", total: 0, panelColor: "#deae79" },
        { name: "申领人总计", total: 0, panelColor: "#b03a5b" },
        { name: "用户数量", total: 0, panelColor: "#676980" }
      ],
      bxcount: 0,
      categoryTypeText: [],
      categoryTypeValue: [],
      putCount: []
    };
  },
  methods: {
    drawLine() {
      let myChart = this.$echarts.init(document.getElementById("myChart"));
      // 绘制图表
      myChart.setOption({
        title: { text: "采购物资统计分类" },
        tooltip: {},
        xAxis: {
          data: this.categoryTypeText
        },
        yAxis: {},
        series: [
          {
            name: "库存",
            type: "bar",
            data: this.categoryTypeValue
          }
        ]
      });
    },
    drawLineBt() {
      let myPie = this.$echarts.init(document.getElementById("myPie"));
      // 绘制饼图
      myPie.setOption({
        tooltip: {
          trigger: "item"
        },
        title: { text: "入库物资统计分类" },
        series: {
          name: "物资入库统计",
          type: "pie",
          radius: "55%",
          data: this.putCount
        }
      });
    },
    // 查询用户信息
    handleGetUser() {
      axios.get("http://localhost:8888/users").then(res => {
        this.panelTotal[5].total = res.data.length;
      });
    },
    handleGetCategory() {
      axios.get("http://localhost:8888/category").then(res => {
        this.panelTotal[0].total = res.data.length;
      });
    },
    handleGetPurse() {
      axios.get("http://localhost:8888/purse").then(res => {
        this.panelTotal[1].total = res.data.length;
        let temp = {};
        this.categoryTypeText = res.data.reduce((item, next) => {
          if (!temp[next.category]) {
            temp[next.category] = 1;
            item.push(next.category);
          } else {
            temp[next.category]++;
          }
          return item;
        }, []);
        this.categoryTypeValue = Object.values(temp);
        this.drawLine();
      });
    },
    handleGetApply() {
      this.$http({
        url: "http://localhost:8888/apply",
        method: "GET"
      }).then(res => {
        this.panelTotal[4].total = res.data.length;
      });
    },
    handleGetAccount() {
      axios.get("http://localhost:8888/account").then(res => {
        let bx = res.data;
        for (let i of bx) {
          if (i.status == "已报销") {
            this.bxcount++;
          }
        }
        this.panelTotal[3].total = this.bxcount;
      });
    },
    // 入库统计
    handleGetInput() {
      axios.get("http://localhost:8888/input").then(res => {
        this.panelTotal[2].total = res.data.length;
        let result = {};
        res.data.forEach(item => {
          if (result[item.category]) {
            result[item.category] += item.num;
          } else {
            result[item.category] = item.num;
          }
        });
        for (let k in result) {
          this.putCount.push({ value: result[k], name: k});
        }
        this.drawLineBt()
      });
    }
  },
  mounted() {
    this.handleGetUser();
    this.handleGetCategory();
    this.handleGetPurse();
    this.handleGetApply();
    this.handleGetAccount();
    this.handleGetInput();
    // this.drawLine();
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
