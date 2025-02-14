<style scoped>
</style>
<template>
  <div ref="chartDom"
       style="height:400px;width:800px;">
  </div>
</template>
<script>
import * as echarts from 'echarts'
import echartsOption from '@/config/echartsOption'
import { getComData } from '@/api/data'
import { echartTools } from '../../public/echartUtil';
var chart = null
export default {
  data () {
    return {
      chartOption: this.getFilterEchartOption('showMode0'),
      // chart: null,
      DataQueryCondition: null,
      sensorIdcards: [],
      sensorList: []
    }
  },
  computed: {
    sensorTypeInfo () {
      let result = null
      for (const a of this.sensorList) {
        if (result === null) {
          result = a.sensorTypeInfo
        } else {
          if (a.sensorTypeInfo.id !== result.id) {
            result = null
            break
          }
        }
      }
      return result
    }
  },
  methods: {
    getSensorInfos () {
      var _this = this
      let count = 0
      if (this.sensorIdcards.length > 0) {
        this.sensorIdcards.forEach(a => {
          getComData({
            method: 'sensor_info',
            sensorIdcard: a
          }).then(res => {
            console.log(789798)
            count++
            if (res.data.code === 200) {
              res = res.data
              _this.sensorList.push(res.data.sensorInfo)
            }
            if (count === _this.sensorIdcards.length) {
              console.log('getSensorData')
              _this.getSensorData()
            }
          })
        })
      } else {
        this.showTextChart('没发现可加载的图表1')
      }
    },
    getSensorData () {
      var _this = this
      if (this.sensorList.length > 0) {
        if (this.sensorTypeInfo !== null) {
          this.chartOption = this.getFilterEchartOption('showMode'+this.sensorTypeInfo.showMode)
          switch (this.sensorTypeInfo.showMode) {
            case 0:
            case 3:
              var count = 0
              this.sensorList.forEach(a => {
                let DataQueryCondition = JSON.parse(JSON.stringify(_this.DataQueryCondition))
                DataQueryCondition.sensorIdcard = a.idcard
                getComData({
                  method: 'sensor_data_list',
                  DataQueryCondition: DataQueryCondition
                }).then(res => {
                  count++
                  if (res.data.code === 200) {
                    res = res.data
                    console.log(res.data)
                    let seriesData = echartTools.createDataSeries(res.data);
                    seriesData.forEach(a => {
                      _this.chartOption.series.push(a)
                    })
                    _this.chartOption = echartTools.labelScale(_this.chartOption, this.sensorTypeInfo.id, res.data.sensorInfo)
                  }
                  if (count === this.sensorList.length) {
                    _this.chartOption.yAxis[0].name = _this.sensorTypeInfo.dataUnit
                    _this.chartOption.legend.data = echartTools.getLegendData(_this.chartOption.series)
                    chart.setOption(_this.chartOption)
                  }
                })
              })
              break;
            case 1:
              if (this.sensorList.length > 0) {
                let sensorInfo = this.sensorList[0]
                let DataQueryCondition = JSON.parse(JSON.stringify(_this.DataQueryCondition))
                DataQueryCondition.sensorIdcard = sensorInfo.idcard
                try {
                  getComData({
                    method: 'sensor_data_list_sb',
                    DataQueryCondition: DataQueryCondition
                  }).then(res => {
                    if (res.data.code === 200) {
                      res = res.data
                      _this.chartOption = echartTools.handlerSBChartData2(res.data.data, _this.chartOption, DataQueryCondition, this.sensorList[0])
                      if (_this.chartOption.series.length > 0) {
                        chart.setOption(_this.chartOption, true)
                      } else {
                        this.showTextChart('当前没有数据')
                      }
                    }
                  }).catch(err => {
                    console.log(err)
                  })
                } catch (error) {
                  console.log(error)
                }
              }
              break;
            case 2:
              this.showTextChart('该传感器不支持图表生成')
              break;
            default:
              this.showTextChart('该传感器不支持图表生成')
              break;
          }
        } else {
          this.showTextChart('同组的传感器类型不一致，无法生成图表')
        }
      } else {
        this.showTextChart('没发现可加载的图表2')
      }
    },
    showTextChart (msg) {
      chart.setOption({
        title: {
          text: msg,
          left: "center",
          top: "center",
          textStyle: {
            fontSize: 30
          },
          subtextStyle: {
            fontSize: 20
          }
        }
      })
    },
    initChart () {
      if (!chart) {
        chart = echarts.init(this.$refs.chartDom)
      }
      chart.setOption(this.chartOption)
      chart.on('finished', function () {
        console.log('finished')
      })
    },
    GetQueryString (name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)")
      var r = location.search.substr(1).replace(new RegExp("JKYDKHL", "gm"), "{").replace(new RegExp("JKYDKHR", "gm"), "}").replace(new RegExp("JKYZKHL", "gm"), "[").replace(new RegExp("JKYZKHR", "gm"), "]").replace(new RegExp("JKYLJF", "gm"), "&").replace(new RegExp("JKYDH", "gm"), ",").replace(new RegExp("JKYYH", "gm"), '"').replace(new RegExp("JKYKG", "gm"), " ")
      r = r.match(reg)
      if (r != null) return unescape(r[2]); return null
    },
    async getUrlParams(){
      let dataQueryConditionKey= this.GetQueryString('dataQueryConditionKey')
      if (dataQueryConditionKey) {
        try {
          let res=  await getComData({
                    method: 'get_data_query_condition',
                    dataQueryConditionKey: dataQueryConditionKey
                  });
                  res=res.data
                  if (res.code===200) {
                    console.log(res.data)
                    this.DataQueryCondition=res.data.DataQueryCondition
                    this.sensorIdcards=res.data.sensorIdcards
                  }
        } catch (error) {
          console.log(error)
        }
      }else{
        try {
        this.DataQueryCondition = this.GetQueryString('DataQueryCondition')
        this.DataQueryCondition = JSON.parse(this.DataQueryCondition)
      } catch (error) {
        this.DataQueryCondition = null
        console.log(error)
      }
      try {
        this.sensorIdcards = this.GetQueryString('sensorIdcards')
        this.sensorIdcards = JSON.parse(this.sensorIdcards)
        if (!this.sensorIdcards) {
          this.sensorIdcards = []
        }
      } catch (error) {
        this.sensorIdcards = []
        console.log(error)
      }
      }
      if (this.DataQueryCondition) {
        if (!this.sensorIdcards || this.sensorIdcards.length === 0) {
          this.sensorIdcards = [this.DataQueryCondition.sensorIdcard]
        }
      }
    },
    getFilterEchartOption(OptionKey){
      let result=echartsOption[OptionKey]
      if (result.toolbox) {
        result.toolbox=null
      }
      result.animation=false
      if (result.dataZoom) {
        result.dataZoom=null
      }
      return result
    }
  },
  async mounted () {
    var _this = this
   await _this.getUrlParams()
    _this.initChart()
    _this.getSensorInfos()
  }
}
</script>

