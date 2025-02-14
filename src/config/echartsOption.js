export default {
  //曲线图（常规数据）
  showMode0: {
    title: [
      {
        text: '',
        left: 'center',
        top: 10,
      },
    ],
    color: ['#2d8cf0', '#003300', '#993399', '#2db7f5', '#19be6b', '#6eeaff', '#ffdf33', '#968ade'],
    legend: {
      type: 'scroll',
      top: 10,
      data: [],
    },
    toolbox: {
      show: true,
      feature: {
        saveAsImage: {
          title: '保存曲线图',
          excludeComponents: [['toolbox']],
        },
      },
    },
    grid: {
      top: 80,
    },
    dataZoom: [
      {
        type: 'slider',
        show: true,
        xAxisIndex: [0],
        start: 0,
        end: 100,
      },
      {
        type: 'slider',
        show: true,
        start: 94,
        end: 100,
        handleSize: 8,
      },
      {
        type: 'inside',
        start: 0,
        end: 100,
      },
    ],
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'time',
      // axisTick: {
      //   show: false,
      // },
      // splitLine: {
      //   show: false,
      // },
      axisLabel: {
        fontSize: 16,
        hideOverlap: true,
        show: true,
        margin: -5,
        formatter: function (value) {
          const date = new Date(value);
          const yearStart = new Date(value);
          yearStart.setMonth(0);
          yearStart.setDate(1);
          // 判断一个刻度值知否为一年的开始
          if (date.getTime() === yearStart.getTime()) {
            return (
              '{test||}\n{year|' +
              date.getFullYear() +
              '年}' +
              '{month|' +
              (date.getMonth() + 1) +
              '月}'
            );
          } else {
            return (
              '{test||}\n{month|' + (date.getMonth() + 1) + '月}' + '{day|' + date.getDate() + '日}'
            );
          }
        },
        rich: {
          test: {
            fontSize: 5,
            fontWeight: 'bold',
            lineHeight: 15,
          },
        },
      },
      axisLine: {
        onZero: false,
      },
    },
    yAxis: [
      {
        nameTextStyle: {
          fontSize: 25,
        },
        type: 'value',
        // splitLine: {
        //   show: false,
        // },
        axisLine: {
          show: true,
          symbol: ['none', 'arrow'],
          symbolOffset: [0, 11],
        },
        axisTick: {
          show: true,
        },
        axisLabel: {
          fontSize: 20,
          formatter: function (value) {
            return parseFloat(parseFloat(value).toFixed(3) + '');
          },
        },
      },
    ],
    series: [],
  },
  //纵向曲线图（深部专用）
  showMode1: {
    title: [
      {
        text: '',
        textStyle: {
          // color: com.base_color
        },
        left: 'center',
      },
    ],
    toolbox: {
      show: true,
      feature: {
        saveAsImage: {
          // backgroundColor: 'rgba(1,1,1)',
          excludeComponents: [['toolbox']],
        },
      },
    },
    grid: {
      left: 140,
    },
    tooltip: {
      trigger: 'item',
      // formatter: function (params) {
      //   this_vm.echart_tooltip_data_array = []
      //   if (params.data.data !== null && params.data.sensor_info !== null) {
      //     params.data.data.series_name = params.data.sensor_info.addr + '(' + params.data.sensor_info.sensorTypeName + ')'
      //     params.data.data.sensor_info = params.data.sensor_info
      //     params.data.data.color = params.color
      //     params.data.data.value = params.data.value
      //     this_vm.echart_tooltip_data_array.push(params.data.data)
      //   }
      //   if (this_vm.echart_tooltip_data_array.length === 0) {
      //     return '参照点(原点)'
      //   } else {
      //     return this_vm.$refs.tooltip.$el.innerHTML
      //   }
      // }
    },
    xAxis: {
      name: '横坐标单位：mm\n\n纵坐标单位：  m',
      nameLocation: 'start',
      nameTextStyle: {
        fontSize: 13,
        align: 'right',
      },
      nameGap: 30,
      min: -100,
      max: 100,
      type: 'value',
      splitLine: {
        show: false,
      },
      axisLine: {
        onZero: false,
        lineStyle: {
          // color: com.base_color
        },
      },
      axisLabel: {
        fontSize: 17,
        formatter: function (value) {
          return value;
        },
      },
      position: 'top',
    },
    yAxis: [
      {
        name: '',
        max: 0,
        minInterval: 5,
        maxInterval: 5,
        interval: 5,
        type: 'value',
        splitLine: {
          lineStyle: {
            // color: com.base_color,
            type: 'dashed',
          },
        },
        axisLine: {
          lineStyle: {
            // color: com.base_color
          },
        },
        axisLabel: {
          fontSize: 17,
          // formatter: function (value, index) {
          //   var design_data = parseFloat(this_vm.sensor_info.extraParams.design_data)
          //   design_data = isNaN(design_data) ? -2 : design_data
          //   return value + design_data
          // }
        },
        // offset:-310
      },
    ],
    series: [],
    legend: {
      type: 'scroll',
      scrollDataIndex: 0,
      bottom: 20,
      data: [],
      textStyle: {
        // color: com.base_color
      },
      // pageIconColor: com.base_color,
      pageTextStyle: {
        // color: com.base_color
      },
    },
  },
  showMode3: {
    title: [
      {
        text: '',
        left: 'center',
      },
    ],
    color: ['#2d8cf0', '#003300', '#993399', '#2db7f5', '#19be6b', '#6eeaff', '#ffdf33', '#968ade'],
    legend: {
      type: 'scroll',
      top: 30,
      data: [],
    },
    toolbox: {
      show: true,
      feature: {
        dataView: { readOnly: false },
        saveAsImage: {
          excludeComponents: [['toolbox']],
        },
      },
    },
    grid: {
      top: 100,
    },
    dataZoom: [
      {
        type: 'slider',
        show: true,
        xAxisIndex: [0],
        start: 0,
        end: 100,
      },
      {
        type: 'slider',
        show: true,
        start: 94,
        end: 100,
        handleSize: 8,
      },
      {
        type: 'inside',
        start: 0,
        end: 100,
      },
    ],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        animation: false,
      },
      borderWidth: 1,
      padding: 0,
      textStyle: {
        overflow: 'breakAll',
      },
      extraCssText: 'width:230px;word-break:break-all;white-space: normal;',
    },
    xAxis: {
      type: 'time',
      axisTick: {
        show: false,
      },
      splitLine: {
        show: false,
      },
      axisLabel: {
        fontSize: 16,
        hideOverlap: true,
        show: true,
        margin: -5,
        formatter: function (value) {
          const date = new Date(value);
          const yearStart = new Date(value);
          yearStart.setMonth(0);
          yearStart.setDate(1);
          // 判断一个刻度值知否为一年的开始
          if (date.getTime() === yearStart.getTime()) {
            return (
              '{test||}\n{year|' +
              date.getFullYear() +
              '年}' +
              '{month|' +
              (date.getMonth() + 1) +
              '月}'
            );
          } else {
            return (
              '{test||}\n{month|' + (date.getMonth() + 1) + '月}' + '{day|' + date.getDate() + '日}'
            );
          }
        },
        rich: {
          test: {
            fontSize: 5,
            fontWeight: 'bold',
            lineHeight: 15,
          },
        },
      },
      axisLine: {
        onZero: false,
      },
    },
    yAxis: [
      {
        nameTextStyle: {
          fontSize: 25,
        },
        type: 'value',
        splitLine: {
          show: false,
        },
        axisLine: {
          show: true,
          symbol: ['none', 'arrow'],
          symbolOffset: [0, 11],
        },
        axisTick: {
          show: true,
        },
        axisLabel: {
          fontSize: 20,
          formatter: function (value) {
            return parseFloat(parseFloat(value).toFixed(3) + '');
          },
        },
      },
    ],
    series: [],
  },
};
