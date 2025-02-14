<!-- 数据变化趋势组件 -->
<template>
  <div>
    <div ref="chartDom" style="width: 30%; height: 300.5px;" />
  </div>
</template>
  
<script setup>
import { ref, onMounted, defineProps } from "vue";
import * as echarts from "echarts";

const props = defineProps({
  data: Array,
  bottom: Number,
  legendWidth: String,
  colors: Array
});

const chartDom = ref(null);

onMounted(() => {
  var myChart = echarts.init(chartDom.value);
  var option = {
    tooltip: {
      trigger: "axis"
    },
    grid: {
      top: "5%", // 增加这个值可以使图表整体向上移动
      bottom: "10%", // 图例的相对位置
      left: "3%",
      right: "4%",
      containLabel: true // 确保标签被包含在 grid 内
    },
    legend: {
      data: props.data.map(item => (item.name ? item.name : "")),
      bottom: props.bottom,
      width: props.legendWidth,
      icon: "circle",
      textStyle: {
        fontSize: 12
      },
      itemWidth: 9,
      itemHeight: 9
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: [
        "1月",
        "2月",
        "3月",
        "4月",
        "5月",
        "6月",
        "7月",
        "8月",
        "9月",
        "10月",
        "11月",
        "12月"
      ],
      axisLine: {
        show: false
      },
      axisTick: {
        show: false // 隐藏x轴刻度线
      },
      axisLabel: {
        rotate: -50, // 倾斜显示
        fontSize: 11, // 设置字体大小
        color: "#999999",
        margin: 25,
        align: "center",
        verticalAlign: "middle"
      }
    },
    yAxis: {
      type: "value",
      axisLabel: {
        fontSize: 11,
        color: "#999999"
      }
    },
    series: props.data.map(item => ({
      name: item.name ? item.name : "",
      type: "line",
      smooth: true,
      symbol: "none",
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: "rgba(74, 144, 226, 0.5)"
          },
          {
            offset: 1,
            color: "rgba(74, 144, 226, 0)"
          }
        ])
      },
      data: item.data
    })),
    color: props.colors
  };

  myChart.setOption(option);
});
</script>
  
  <style>
</style>