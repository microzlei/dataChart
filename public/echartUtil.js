
export const echartTools = {
  strToDate: function (str) {
    return new Date(str.substring(0, 19).replace(/-/g, '/'))
  },
  dateAddDays: function (date, days) {
    return new Date((date / 1000 + (86400 * days)) * 1000)
  },
  stateColor: {
    invalid: "#C0C0C0",
    rank1: "#2d8cf0",
    rank2: "#fadb14",
    rank3: "#f90",
    rank4: "#f5222d"
  },
  rainDataTypeConvert: function (data, rainQueryType) {
    var tempData = []
    var interval = 0
    switch (rainQueryType) {
      case '1小时降雨量':
        interval = 0
        break
      case '6小时降雨量':
        interval = -0.25
        break
      case '24小时降雨量':
        interval = -1
        break
      default:
        break;
    }
    if (interval !== 0) {
      for (var i = data.data.length - 1; i >= 0; i--) {
        var e = data.data[i]
        if (tempData.length === 0) {
          tempData.push(e)
        } else {
          var tempDate = echartTools.dateAddDays(new Date(tempData[tempData.length - 1].dataTime), interval)
          if (tempDate < new Date(e.dataTime)) {
            tempData[tempData.length - 1].data.originalData[0] += e.data.originalData[0]
            tempData[tempData.length - 1].data.realData[0] += e.data.realData[0]
            tempData[tempData.length - 1].data.resultData[0] += e.data.resultData[0]
          } else {
            tempData.push(e)
          }
        }
      }
      data.data = tempData
    }
    return data
  },
  createDataSeries: function (item, dataType, markLineDisabled) {
    var series = []
    var series_tmps = []
    var names = item.sensorInfo.sensorTypeInfo.dataItemNames

    for (var i = 0; i < names.length; i++) {
      var seriesData = []
      for (var j = 0; j < item.data.length; j++) {
        var dataVal = []
        switch (dataType) {
          case '结果数据':
            dataVal = item.data[j].data.resultData
            break
          case '真实数据':
            dataVal = item.data[j].data.realData
            break
          case '原始数据':
            dataVal = item.data[j].data.originalData
            break
          default:
            dataVal = item.data[j].data.resultData
            break
        }
        if (item.sensorInfo.sensorTypeInfo.id + '' === '8') {
          var design_data = 0
          if (item.sensorInfo.extraParams && item.sensorInfo.extraParams.design_data) {
            design_data = parseFloat(item.sensorInfo.extraParams.design_data)
          }
          dataVal[i] = dataVal[i] + design_data
        }
        var seriesDataItem = {
          value: [echartTools.strToDate(item.data[j].dataTime), dataVal[i]],
          data: item.data[j],
          sensorInfo: item.sensorInfo,
          dataType: dataType,
          symbol: 'circle'
        }
        if (!item.data[j].invalid) {
          switch (item.data[j].dataStat) {
            case 1:
              seriesDataItem.symbolSize = 5
              seriesDataItem.itemStyle = {
                color: echartTools.stateColor.rank1
              }
              break
            case 2:
              seriesDataItem.symbolSize = 5
              seriesDataItem.itemStyle = {
                color: echartTools.stateColor.rank2
              }
              break
            case 3:
              seriesDataItem.symbolSize = 5
              seriesDataItem.itemStyle = {
                color: echartTools.stateColor.rank3
              }
              break
            case 4:
              seriesDataItem.symbolSize = 5
              seriesDataItem.itemStyle = {
                color: echartTools.stateColor.rank4
              }
              break
            default:
              break
          }
        } else {
          seriesDataItem.symbolSize = 5
          seriesDataItem.itemStyle = {
            color: echartTools.stateColor.invalid
          }
        }
        seriesData.push(seriesDataItem)
      }
      series_tmps.push({
        sensorInfo: item.sensorInfo,
        data: seriesData,
        name: names[i]
      })
    }
    var markLine = echartTools.markLineHandler(item.sensorInfo)
    for (var k = 0; k < series_tmps.length; k++) {
      const a = series_tmps[k];
      if (item.sensorInfo.sensorTypeInfo.showMode === 3) {
        series.push({
          name: a.sensorInfo.location + (a.name.length > 0 ? ('-' + a.name) : '') + (dataType ? '-' + dataType : ''),
          type: 'bar',
          emphasis: {
            scale: false
          },
          data: a.data,
          smooth: true,
          sampling: 'average',
          barWidth: 30
        })
      } else {
        series.push({
          name: a.sensorInfo.location + (a.name.length > 0 ? ('-' + a.name) : '') + (dataType ? '-' + dataType : ''),
          type: 'line',
          emphasis: {
            scale: false,
            focus: 'series'
          },
          data: a.data,
          smooth: true,
          symbolSize: a.data.length > 50 ? 0 : 4,
          sampling: 'average',
          markLine: !markLineDisabled ? markLine : false
        })
      }
    }
    return series
  },
  createDeformationRateDataSeries: function (item) {
    var series = []
    var series_tmps = []
    var names = item.sensorInfo.sensorTypeInfo.dataItemNames

    for (var i = 0; i < names.length; i++) {
      var seriesData = []
      for (var j = 0; j < item.data.length; j++) {
        var dataVal = item.data[j].data
        var seriesDataItem = {
          value: [echartTools.strToDate(item.data[j].dataTime), dataVal[i]],
          data: item.data[j],
          sensorInfo: item.sensorInfo,
          symbol: 'circle',
          dataType: '变化率数据'
        }
        switch (item.data[j].dataStat) {
          case 1:
            seriesDataItem.symbolSize = 5
            seriesDataItem.itemStyle = {
              color: echartTools.stateColor.rank1
            }
            break
          case 2:
            seriesDataItem.symbolSize = 5
            seriesDataItem.itemStyle = {
              color: echartTools.stateColor.rank2
            }
            break
          case 3:
            seriesDataItem.symbolSize = 5
            seriesDataItem.itemStyle = {
              color: echartTools.stateColor.rank3
            }
            break
          case 4:
            seriesDataItem.symbolSize = 5
            seriesDataItem.itemStyle = {
              color: echartTools.stateColor.rank4
            }
            break
          default:
            break
        }
        seriesData.push(seriesDataItem)
      }
      series_tmps.push({
        sensorInfo: item.sensorInfo,
        data: seriesData,
        name: names[i],

      })
    }
    for (var k = 0; k < series_tmps.length; k++) {
      const a = series_tmps[k];
      if (item.sensorInfo.sensorTypeInfo.showMode === 3) {
        series.push({
          name: a.sensorInfo.location + (a.name.length > 0 ? ('-' + a.name) : ''),
          type: 'bar',
          emphasis: {
            scale: false
          },
          data: a.data,
          smooth: true,
          sampling: 'average',
          barWidth: 30
        })
      } else {
        series.push({
          name: a.sensorInfo.location + (a.name.length > 0 ? ('-' + a.name) : ''),
          type: 'line',
          emphasis: {
            scale: false,
            focus: 'series'
          },
          data: a.data,
          smooth: true,
          symbolSize: a.data.length > 50 ? 0 : 4,
          sampling: 'average',
        })
      }
    }
    return series
  },
  createEdgeDataSeries(item, sensorInfo, name) {
    var series = []
    var series_tmps = []
    var seriesData = []
    for (var j = 0; j < item.dataList.length; j++) {
      var dataVal = item.dataList[j].data
      var seriesDataItem = {
        value: [echartTools.strToDate(item.dataList[j].dataTime), dataVal],
        data: item.dataList[j],
        sensorInfo: sensorInfo,
        symbol: 'circle',
        dataType: name,
      }
      seriesData.push(seriesDataItem)
    }
    series_tmps.push({
      sensorInfo: sensorInfo,
      data: seriesData,
      name: name
    })
    for (var i = 0; i < series_tmps.length; i++) {
      const a = series_tmps[i];
      series.push({
        name: a.sensorInfo.location + (a.name.length > 0 ? ('-' + a.name) : ''),
        type: 'line',
        emphasis: {
          scale: false,
          focus: 'series'
        },
        data: a.data,
        smooth: true,
        symbolSize: a.data.length > 50 ? 0 : 4,
        sampling: 'average',
      })
    }
    return series
  },
  getLegendData: function (series) {
    var temp = []
    for (var i = 0; i < series.length; i++) {
      const a = series[i];
      temp.push(a.name)
    }
    return temp
  },
  handlerSBChartData: function (data, option, queryParams, sensorInfo) {
    // console.log('handlerSBChartData1S|' + new Date())
    if (!queryParams.dataSource) {
      queryParams.dataSource = "X轴累计量"
    }
    option.title.text = sensorInfo.location + queryParams.dataSource + ' - (' + sensorInfo.sensorTypeInfo.sensorName + ')'
    var accumulation = true
    if (queryParams.dataSource.indexOf('变化量') > -1) {
      accumulation = false
    }
    var dtData = {}
    for (var i = 0; i < data.length; i++) {
      for (var j = 0; j < data[i].data.length; j++) {
        if (dtData[data[i].data[j].dataTime] === undefined) {
          dtData[data[i].data[j].dataTime] = {}
        }
      }
    }
    // console.log('handlerSBChartData1E|' + new Date())
    var legendData = []
    option.series = []
    option.legend.data = []
    option.legend.scrollDataIndex = 0
    var totalDesignData = 0
    var designDataArray = []
    var lengthDataArray = []

    for (var key in dtData) {
      // 计算总设计深度
      if (totalDesignData === 0) {
        for (i = 0; i < data.length; i++) {
          var designData = parseFloat(data[i].sensorInfo.extraParams.design_data)
          designData = isNaN(designData) ? 5 : designData
          designDataArray.push(designData)
          totalDesignData += designData
          var lengthData = parseFloat(data[i].sensorInfo.extraParams.length_data)
          lengthData = isNaN(lengthData) ? 5 : lengthData
          lengthDataArray.push(lengthData)
        }
      }
      dtData[key].angleData = []
      dtData[key].offsetData = [{
        sensorInfo: null,
        value: [0, totalDesignData * -1]
      }]
      var prevCoord = {
        sensorInfo: null,
        value: [0, totalDesignData * -1]
      }
      for (i = 0; i < data.length; i++) {
        var a = [0, 0]
        var b = null
        for (j = 0; j < data[i].data.length; j++) {
          if (data[i].data[j].dataTime.substring(0, 16) === key.substring(0, 16)) {
            if (queryParams.dataSource.indexOf('变化量') > -1) {
              a = data[i].data[j].data
            } else {
              a = data[i].data[j].data.resultData
            }
            b = data[i].data[j]
            break
          }
        }
        if (b !== null) {
          dtData[key].angleData.push(a)
          let _tempVal = 0
          if (queryParams.dataSource.indexOf('X轴') > -1) {
            _tempVal = a[0]
          } else if (queryParams.dataSource.indexOf('Y轴') > -1) {
            _tempVal = a[1]
          }
          if (data[i].monitorInfo && [272, 241, 242, 243, 248, 244, 245, 246, 247].indexOf(data[i].monitorInfo.id) >= 0 && (new Date(Date.parse(key)) < new Date(Date.parse('2019-10-14 15:01:01')))) {
            prevCoord = {
              sensorInfo: data[i].sensorInfo,
              data: b,
              value: [Math.sin(Math.PI * (_tempVal / 180)) * designDataArray[i] + (accumulation ? prevCoord.value[0] : 0), prevCoord.value[1] + Math.cos(Math.PI * (_tempVal / 180)) * designDataArray[i]]
            }
            dtData[key].offsetData.push(prevCoord)
          } else {
            prevCoord = {
              sensorInfo: data[i].sensorInfo,
              data: b,
              value: [Math.sin(Math.PI * (_tempVal / 180)) * lengthDataArray[i] * 1000 + (accumulation ? prevCoord.value[0] : 0), prevCoord.value[1] + Math.cos(Math.PI * (_tempVal / 180)) * designDataArray[i]]
            }
            dtData[key].offsetData.push(prevCoord)
          }
        } else {
          break
        }
      }
      // 检查每个时间是否整齐
      if ((data.length + 1) === dtData[key].offsetData.length) {
        legendData.push(key)
      } else {
        delete dtData[key]
        continue
      }
      if (option.series.length === 0) {
        designData = parseFloat(sensorInfo.extraParams.design_data)
        designData = isNaN(designData) ? -2 : designData
        option.series.push({
          id: key,
          name: key,
          type: 'line',
          smooth: true,
          data: dtData[key].offsetData,
          markLine: {
            silent: true,
            lineStyle: {
              type: 'dotted'
            },
            data: [{
              name: '最小值到最大值',
              yAxis: totalDesignData * -1
            }],
            label: {
              normal: {
                formatter: '孔深(' + (totalDesignData * -1 + designData) + ')'
              }
            }
          }
        })
      } else {
        option.series.push({
          id: key,
          name: key,
          type: 'line',
          smooth: true,
          data: dtData[key].offsetData
        })
      }
      option.legend.data = legendData
    }
    // console.log(dtData)
    // console.log('handlerSBChartData2E|' + new Date())
    legendData.sort().reverse()
    // console.log('handlerSBChartData3E|' + new Date())
    option.yAxis[0].axisLabel.formatter = (value) => {
      let designData = parseFloat(sensorInfo.extraParams.design_data)
      designData = isNaN(designData) ? -2 : designData
      return value + designData
    }
    var baseValue = 40
    option.xAxis.max = function (value) {
      baseValue = 40
      var tempValue = Math.abs(value.min) < Math.abs(value.max) ? Math.abs(value.max) : Math.abs(value.min)
      for (var i = 0; i < echartTools.calcInterval(tempValue); i++) {
        baseValue *= 2
      }
      return baseValue
    }
    option.xAxis.min = function (value) {
      baseValue = 40
      var tempValue = Math.abs(value.min) < Math.abs(value.max) ? Math.abs(value.max) : Math.abs(value.min)
      for (var i = 0; i < echartTools.calcInterval(tempValue); i++) {
        baseValue *= 2
      }
      return baseValue * -1
    }
    option.xAxis.splitNumber = 8
    // console.log('handlerSBChartData4E|' + new Date())
    // console.log(JSON.stringify(option))
    return option
  },
  handlerSBChartData2: function (dtData, option, queryParams, sensorInfo) {
    // console.log('handlerSBChartData1S|' + new Date())
    if (!queryParams.data_position) {
      queryParams.data_position = { name: 0, text: "X轴累计量" }
    }
    option.title.text = sensorInfo.location + queryParams.data_position.text + ' - (' + sensorInfo.sensorTypeInfo.sensorName + ')'
    var accumulation = true
    if ('23'.indexOf(queryParams.data_position.name + '') >= 0) {
      accumulation.valueOf = false
    }
    var legendData = []
    var designData = 0
    for (var key in dtData.data) {
      legendData.push(key)
      if (option.series.length === 0) {
        designData = parseFloat(sensorInfo.extraParams.design_data)
        designData = isNaN(designData) ? -2 : designData

        option.series.push({
          id: key,
          name: key,
          type: 'line',
          smooth: true,
          data: dtData.data[key].offsetDatas[0],
          markLine: {
            silent: true,
            lineStyle: {
              type: 'dotted'
            },
            data: [{
              name: '最小值到最大值',
              yAxis: dtData.extraParams.totalDesignData * -1
            }],
            label: {
              normal: {
                formatter: '孔深(' + (dtData.extraParams.totalDesignData * -1 + designData) + ')'
              }
            }
          }
        })
      } else {
        option.series.push({
          id: key,
          name: key,
          type: 'line',
          smooth: true,
          data: dtData.data[key].offsetDatas[0]
        })
      }
      option.legend.data = legendData
    }
    legendData.sort().reverse()

    var baseValue = 100
    option.xAxis.max = function (value) {
      baseValue = 100
      var tempValue = Math.abs(value.min) < Math.abs(value.max) ? Math.abs(value.max) : Math.abs(value.min)
      for (var i = 0; i < echartTools.calcInterval(tempValue); i++) {
        baseValue *= 2
      }
      return baseValue
    }
    option.xAxis.min = function (value) {
      baseValue = 100
      var tempValue = Math.abs(value.min) < Math.abs(value.max) ? Math.abs(value.max) : Math.abs(value.min)
      for (var i = 0; i < echartTools.calcInterval(tempValue); i++) {
        baseValue *= 2
      }
      return baseValue * -1
    }
    // console.log(JSON.stringify(option))
    return option
  },
  calcInterval: function (val) {
    var newVal = val
    var count = 0
    while (newVal > 40) {
      count++
      newVal /= 2
    }
    return count
  },
  labelScale: function (option, sensorType, sensorInfo) {
    let baseVal, N;
    switch (sensorType) {
      case 2:// 激光
        {
          baseVal = 50
          N = 2
          option.yAxis[0].max = function (value) {
            if ((value.max < (baseVal / 2) && value.min > -(baseVal / 2))) {
              return baseVal
            } else {
              if (value.max < 0 && value.min < 0) {
                return (Math.ceil((value.max - value.min * N) / 10) * 10)
              } else if (value.max > 0 && value.min > 0) {
                return (Math.ceil(value.max / 10) * 10) * (N + 1)
              } else {
                if (Math.abs(value.max) < Math.abs(value.min)) {
                  return (Math.ceil((value.max - value.min * N) / 10) * 10)
                } else {
                  return (Math.ceil(value.max / 10) * 10) * (N + 1)
                }
              }
            }
          }
          option.yAxis[0].min = function (value) {

            if ((value.max < (baseVal / 2) && value.min > -(baseVal / 2))) {
              return -baseVal
            } else {
              if (value.max < 0 && value.min < 0) {
                return (Math.floor(value.min / 10) * 10) * (N + 1)
              } else if (value.max > 0 && value.min > 0) {
                return (Math.floor((value.min - value.max * N) / 10) * 10)
              } else {
                if (Math.abs(value.max) < Math.abs(value.min)) {
                  return (Math.floor(value.min / 10) * 10) * (N + 1)
                } else {
                  return (Math.floor((value.min - value.max * N) / 10) * 10)
                }
              }
            }
          }
        }
        break
      case 21: // NB测斜
      case 3:// 测斜仪
      case 6:// 深部（独立）
        {
          baseVal = 4
          N = 5
          option.yAxis[0].max = function (value) {
            if (value.max < (baseVal / N) && value.min > -(baseVal / N)) {
              return baseVal
            } else {
              if (value.max < 0 && value.min < 0) {
                return Math.ceil(value.max - Math.floor(value.min) * N)
              } else if (value.max > 0 && value.min > 0) {
                return Math.ceil(value.max) * (N + 1)
              } else {
                if (Math.abs(value.max) < Math.abs(value.min)) {
                  return Math.ceil(value.max - Math.floor(value.min) * N)
                } else {
                  return Math.ceil(value.max) * (N + 1)
                }
              }
            }
          }
          option.yAxis[0].min = function (value) {
            if (value.max < (baseVal / N) && value.min > -(baseVal / N)) {
              return -baseVal
            } else {
              if (value.max < 0 && value.min < 0) {
                return Math.floor(value.min) * (N + 1)
              } else if (value.max > 0 && value.min > 0) {
                return Math.floor(value.min - Math.ceil(value.max) * N)
              } else {
                if (Math.abs(value.max) < Math.abs(value.min)) {
                  return Math.floor(value.min) * (N + 1)
                } else {
                  return Math.floor(value.min - Math.ceil(value.max) * N)
                }
              }
            }
          }
        }
        break
      case 4:// 降雨
        {
          option.yAxis[0].max = function (value) {
            return Math.ceil(value.max) * 2
          }
          option.yAxis[0].min = 0
        }
        break
      case 5:// 地表位移
        {
          baseVal = 50
          option.yAxis[0].splitNumber = 8
          option.yAxis[0].max = function (value) {
            if (value.max < 50) {
              return 50
            } else {
              return Math.ceil(value.max * 2 / 5) * 5
            }
          }
          option.yAxis[0].min = function (value) {
            if (value.min > -10) {
              return -10
            } else {
              return Math.floor(value.min * 2 / 5) * 5
            }
          }
        }
        break
      case 7:// 锚索预应力监测设备
        {
          baseVal = 1000
          N = 4
          option.yAxis[0].max = function (value) {
            if ((value.max < (baseVal / N) && value.min > -(baseVal / N))) {
              return baseVal
            } else {
              if (value.max < 0 && value.min < 0) {
                return (Math.ceil((value.max - value.min * N) / 10) * 10)
              } else if (value.max > 0 && value.min > 0) {
                return (Math.ceil(value.max / 10) * 10) * (N + 1)
              } else {
                if (Math.abs(value.max) < Math.abs(value.min)) {
                  return (Math.ceil((value.max - value.min * N) / 10) * 10)
                } else {
                  return (Math.ceil(value.max / 10) * 10) * (N + 1)
                }
              }
            }
          }
          option.yAxis[0].min = 0
        }

        break
      case 8:// 地下水位监测设备
        {
          var design_data = 0
          if (sensorInfo.extraParams.design_data !== undefined) {
            design_data = parseFloat(sensorInfo.extraParams.design_data)
          }
          if (design_data === 0) {
            option.yAxis[0].minInterval = 2
            option.yAxis[0].max = function (value) {
              var max = 2
              while (max < value.max) {
                max += 2
              }
              return max
            }
            option.yAxis[0].min = function (value) {
              var min = 2 * parseInt(value.min / 2)
              while (min > value.min) {
                min -= 2
              }
              return min
            }
          } else {
            option.yAxis[0].max = 0
            option.yAxis[0].min = design_data
          }
        }
        break
      case 10:// 北斗监测设备
        {
          baseVal = 100
          option.yAxis[0].max = function (value) {
            return baseVal + parseInt(value.max / 100) * baseVal
          }
          option.yAxis.min = function (value) {
            return parseInt(value.min / 100) * baseVal - baseVal
          }
        }
        break
      case 12:// 静力水准
        {
          baseVal = 50
          option.yAxis[0].splitNumber = 10
          option.yAxis[0].max = function (value) {
            if (value.max < 50) {
              return 50
            } else {
              return Math.ceil(value.max * 2 / 5) * 5
            }
          }
          option.yAxis[0].min = function (value) {
            if (value.min > -50) {
              return -50
            } else {
              return Math.floor(value.min * 2 / 5) * 5
            }
          }
        }
        break
      default:
        {
          baseVal = 50
          N = 4
          option.yAxis[0].max = function (value) {
            if ((value.max < (baseVal / 2) && value.min > -(baseVal / 2))) {
              return baseVal
            } else {
              if (value.max < 0 && value.min < 0) {
                return (Math.ceil((value.max - value.min * N) / 10) * 10)
              } else if (value.max > 0 && value.min > 0) {
                return (Math.ceil(value.max / 10) * 10) * (N + 1)
              } else {
                if (Math.abs(value.max) < Math.abs(value.min)) {
                  return (Math.ceil((value.max - value.min * N) / 10) * 10)
                } else {
                  return (Math.ceil(value.max / 10) * 10) * (N + 1)
                }
              }
            }
          }
          option.yAxis[0].min = function (value) {
            if ((value.max < (baseVal / 2) && value.min > -(baseVal / 2))) {
              return -baseVal
            } else {
              if (value.max < 0 && value.min < 0) {
                return (Math.floor(value.min / 10) * 10) * (N + 1)
              } else if (value.max > 0 && value.min > 0) {
                return (Math.floor((value.min - value.max * N) / 10) * 10)
              } else {
                if (Math.abs(value.max) < Math.abs(value.min)) {
                  return (Math.floor(value.min / 10) * 10) * (N + 1)
                } else {
                  return (Math.floor((value.min - value.max * N) / 10) * 10)
                }
              }
            }
          }
        }
        break
    }
    return option
  },
  markLineHandler: function (sensorInfo) {
    let tempValue;
    var markLine = {
      data: []
    }
    if (sensorInfo) {
      if (sensorInfo.sensorTypeInfo && sensorInfo.sensorTypeInfo.dataType && sensorInfo.sensorTypeInfo.dataType === 0) {
        markLine.data.push({
          type: 'average', name: '平均值'
        })
      }
      if (sensorInfo.sensorTypeInfo.id === 3 || sensorInfo.sensorTypeInfo.id === 6 || sensorInfo.sensorTypeInfo.id === 21) {
        if (sensorInfo.extraParams) {
          if (sensorInfo.extraParams.aggregateThresholdValue1) {
            tempValue = parseFloat(sensorInfo.extraParams.aggregateThresholdValue1)
            markLine.data.push({
              label: {
                formatter: '蓝色预警线(' + tempValue + ')\n(累计值)'
              },
              yAxis: tempValue,
              lineStyle: {
                color: echartTools.stateColor.rank1
              }
            })
          }
          if (sensorInfo.extraParams.aggregateThresholdValue2) {
            tempValue = parseFloat(sensorInfo.extraParams.aggregateThresholdValue2)
            markLine.data.push({
              label: {
                formatter: '黄色预警线(' + tempValue + ')\n(累计值)'
              },
              yAxis: tempValue,
              lineStyle: {
                color: echartTools.stateColor.rank2
              }
            })
          }
          if (sensorInfo.extraParams.aggregateThresholdValue3) {
            tempValue = parseFloat(sensorInfo.extraParams.aggregateThresholdValue3)
            markLine.data.push({
              label: {
                formatter: '橙色预警线(' + tempValue + ')\n(累计值)'
              },
              yAxis: tempValue,
              lineStyle: {
                color: echartTools.stateColor.rank3
              }
            })
          }
          if (sensorInfo.extraParams.aggregateThresholdValue4) {
            tempValue = parseFloat(sensorInfo.extraParams.aggregateThresholdValue4)
            markLine.data.push({
              label: {
                formatter: '红色预警线(' + tempValue + ')\n(累计值)'
              },
              yAxis: tempValue,
              lineStyle: {
                color: echartTools.stateColor.rank4
              }
            })
          }
          if (sensorInfo.extraParams.aggregateThresholdValue1) {
            tempValue = parseFloat(sensorInfo.extraParams.aggregateThresholdValue1) * -1
            markLine.data.push({
              label: {
                formatter: '蓝色预警线(' + tempValue + ')\n(累计值)'
              },
              yAxis: tempValue,
              lineStyle: {
                color: echartTools.stateColor.rank1
              }
            })
          }
          if (sensorInfo.extraParams.aggregateThresholdValue2) {
            tempValue = parseFloat(sensorInfo.extraParams.aggregateThresholdValue2) * -1
            markLine.data.push({
              label: {
                formatter: '黄色预警线(' + tempValue + ')\n(累计值)'
              },
              yAxis: tempValue,
              lineStyle: {
                color: echartTools.stateColor.rank2
              }
            })
          }
          if (sensorInfo.extraParams.aggregateThresholdValue3) {
            tempValue = parseFloat(sensorInfo.extraParams.aggregateThresholdValue3) * -1
            markLine.data.push({
              label: {
                formatter: '橙色预警线(' + tempValue + ')\n(累计值)'
              },
              yAxis: tempValue,
              lineStyle: {
                color: echartTools.stateColor.rank3
              }
            })
          }
          if (sensorInfo.extraParams.aggregateThresholdValue4) {
            tempValue = parseFloat(sensorInfo.extraParams.aggregateThresholdValue4) * -1
            markLine.data.push({
              label: {
                formatter: '红色预警线(' + tempValue + ')\n(累计值)'
              },
              yAxis: tempValue,
              lineStyle: {
                color: echartTools.stateColor.rank4
              }
            })
          }
        }
      }
      else if (sensorInfo.sensorTypeInfo.id === 5) {
        if (sensorInfo.extraParams) {
          if (sensorInfo.extraParams.aggregateThresholdValue1) {
            tempValue = parseFloat(sensorInfo.extraParams.aggregateThresholdValue1)
            markLine.data.push({
              label: {
                formatter: '蓝色预警线(' + tempValue + ')\n(累计值)'
              },
              yAxis: tempValue,
              lineStyle: {
                color: echartTools.stateColor.rank1
              }
            })
          }
          if (sensorInfo.extraParams.aggregateThresholdValue2) {
            tempValue = parseFloat(sensorInfo.extraParams.aggregateThresholdValue2)
            markLine.data.push({
              label: {
                formatter: '黄色预警线(' + tempValue + ')\n(累计值)'
              },
              yAxis: tempValue,
              lineStyle: {
                color: echartTools.stateColor.rank2
              }
            })
          }
          if (sensorInfo.extraParams.aggregateThresholdValue3) {
            tempValue = parseFloat(sensorInfo.extraParams.aggregateThresholdValue3)
            markLine.data.push({
              label: {
                formatter: '橙色预警线(' + tempValue + ')\n(累计值)'
              },
              yAxis: tempValue,
              lineStyle: {
                color: echartTools.stateColor.rank3
              }
            })
          }
          if (sensorInfo.extraParams.aggregateThresholdValue4) {
            tempValue = parseFloat(sensorInfo.extraParams.aggregateThresholdValue4)
            markLine.data.push({
              label: {
                formatter: '红色预警线(' + tempValue + ')\n(累计值)'
              },
              yAxis: tempValue,
              lineStyle: {
                color: echartTools.stateColor.rank4
              }
            })
          }
        }
      }
      else if (sensorInfo.sensorTypeInfo.id === 7 || sensorInfo.sensorTypeInfo.id === 28) {
        if (sensorInfo.extraParams) {
          if (sensorInfo.extraParams.design_data) {
            tempValue = parseFloat(sensorInfo.extraParams.design_data)
            markLine.data.push({
              label: {
                formatter: '设计值(' + tempValue + ')'
              },
              yAxis: tempValue,
              lineStyle: {
                color: echartTools.stateColor.rank1
              }
            })
          }
        }
      }
    }
    return markLine
  }
}
// window.echartTools = echartTools
// export default echartTools;
