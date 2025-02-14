<template>
  <div class="box">
    <div class="header">
    <h2 class="title">Get Word</h2>
    <div class="buttons">
      <el-button type="primary" class="login" @click="login" plain>登录</el-button>
      <el-button type="success" class="get" @click="getWord" plain>导出word</el-button>
    </div>
  </div>
    <div class="form">
      <el-form style="margin-top: 30px; margin-left: 50px;">
        <el-row>
          <el-col :span="12">
            <div style="display: flex;margin-left: 13.5px;">
              <el-form-item label="边坡ID" class="custom-label">
                <el-input type="number" v-model="slopeId" placeholder="ID" style="width: 100px;" />
              </el-form-item>
              <el-form-item label="监测点" class="custom-label" style="margin-left: 127.5px;">
                <el-input
                  type="text"
                  v-model="monitorType"
                  placeholder="Point"
                  style="width: 100px;"
                />
              </el-form-item>
            </div>
            <div style="display: flex;">
              <el-form-item label="方向类型" class="custom-label">
                <el-select v-model="dirType" clearable placeholder="Select" style="width: 100px">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="趋势图数量" class="custom-label" style="margin-left: 100px;">
                <el-input
                  type="number"
                  v-model="imgsCount"
                  placeholder="Number"
                  style="width: 100px;"
                />
              </el-form-item>
            </div>
            <div style="display: flex;">
              <el-form-item label="日期范围" class="custom-label">
                <div class="block">
                  <el-date-picker
                    v-model="dateRange"
                    type="daterange"
                    range-separator="To"
                    start-placeholder="Start date"
                    end-placeholder="End date"
                    style="width: 362px;"
                  />
                </div>
              </el-form-item>
            </div>
            <div style="display: flex;margin-top: 20px;">
              <el-button type="info" @click="get_sensor" style="font-weight: bold;" plain>获取传感器ID</el-button>
              <el-button
                type="info"
                @click="sensor_data_list"
                style="margin-left: 32px;font-weight: bold;"
                plain
              >获取传感器列表</el-button>
              <label style="margin-left: 32px; margin-top: 4px;">||</label>
              <el-button type="info" @click="get_slope_info" style="margin-left: 32px;font-weight: bold;" plain>获取平面图</el-button>
            </div>
            <div style="display: flex;margin-top: 20px;">
              <el-button type="info" @click="add_project" style="font-weight: bold;" plain>添加数据</el-button>
            </div>
            <div style="display: flex;margin-top: 20px;width: 540px;">
              <div class="message-container">
                <div v-for="(msg, index) in messages" :key="index" class="message">{{ msg }}</div>
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="upload-demo">
              <input
                type="file"
                @change="uploadImage"
                accept="image/*"
                class="custom-file-upload"
                multiple
              />
              <!-- 展示图片 -->
              <div class="images-container">
                <div v-for="(img, index) in totalProject.imgs" :key="index" class="image-wrapper">
                  <!-- <img :src="img" alt="Uploaded Image" class="uploaded-image" /> -->
                  <p style="text-align: center;" class="image-filename">{{ filesName[index] }}</p>
                  <!-- <button @click="removeImage(index)" class="delete-button">删除</button> -->
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from "vue";
import axios from "axios";
import md5 from "md5";
import { ElMessage, ElLoading } from "element-plus";

const API = "http://api.cloudeyes.cn/api/method";
const params = ref({
  ver: 3,
  sign: "",
  key: 1731565488,
  time: Date.now().toString(),
  method: ""
});

const slopeId = ref(""); // 输入的边坡ID
const monitorType = ref(""); // 输入的监测点
const deviceName = ref(""); // 输入的监测项目名
const imgsCount = ref(0); // 趋势图数量
const tableIndex = ref(0);
const messages = ref([]); // 显示信息

const dateRange = ref("");

const idcards = ref([]); // 传感器ID列表
const DataQueryCondition = ref({}); // 传感器数据查询条件

const dirType = ref("");
const options = [
  {
    value: "1",
    label: "坡向"
  },
  {
    value: "2",
    label: "XY轴"
  },
  {
    value: "3",
    label: "高程"
  }
];

// 一个项目
const totalProject = ref({
  monitorDate: [], // 监测日期
  imgs: [], // 趋势图
  singleProjects: [] // 单个项目数据
});

// 显示加载中的函数
const showLoading = () => {
  return ElLoading.service({
    lock: true,
    text: '文档正在导出，请稍后...',
    background: 'rgba(0, 0, 0, 0.7)',
  });
};

// 关闭加载中的函数
const hideLoading = (loading) => {
  if (loading && typeof loading.close === 'function') {
    loading.close();
  }
};

// 一个工点
const singleProject = ref({
  tableIndex: "", // 表格索引
  imgsCount: "", // 趋势图数量
  projectMaxPoint: "",
  projectMaxPointTotal: "",
  projectMaxPointDir: "",
  projectMaxChange: "",
  singleDevices: [] // 单个设备数据
});

// 获取签名
const secret = "51965a4449c74e8f80ccf82e4b823548";
params.value.sign = md5(params.value.time + secret);

const openMessage = (message, type) => {
  ElMessage({
    message: message,
    type: type,
    plain: true
  });
};

const addMessage = message => {
  messages.value.push(message);
  // 保证滚动条始终显示最后一条消息
  nextTick(() => {
    const messageContainer = document.querySelector(".message-container");
    messageContainer.scrollTop = messageContainer.scrollHeight;
  });
};

// 登录
const login = async () => {
  const backupParams = JSON.parse(JSON.stringify(params.value));
  params.value.method = "login";
  params.value.loginName = "zhanglei";
  params.value.password = "#{z2J5Va&S";
  const res = await axios.post(API, params.value);
  if (res.data.code === 200) {
    params.value = backupParams;
    params.value.token = res.data.data.accessToken;
    openMessage("登录成功", "success");
    addMessage("登录成功");
  } else {
    openMessage("登录失败", "error");
  }
};

// 获取边坡ID
/*const get_monitor = async () => {
  const backupParams = JSON.parse(JSON.stringify(params.value));
  params.value.method = "get_monitor";
  // params.value.pageCurrent = 1;
  // params.value.pageSize = 10;
  //params.value.searchVal = "";
  //params.value.monitorStat = "";
  const res = await axios.post(API, params.value);
  if (res.data.code === 200) {
    params.value = backupParams;
    params.value.slopeId = 1170;
    console.log("边坡ID列表：", res.data);
  } else {
    console.log("get_monitor failed");
  }
};*/

// 检查点和idcard
/*const id = ref({
  location: "",
  idcard: ""
});*/

// 获取传感器ID
const get_sensor = async () => {
  const backupParams = JSON.parse(JSON.stringify(params.value));
  params.value.method = "get_sensor";
  params.value.slopeId = slopeId.value;
  //params.value.pageCurrent = 1;
  //params.value.pageSize = 10;
  //params.value.searchVal = "";
  const res = await axios.post(API, params.value);
  if (res.data.code === 200) {
    params.value = backupParams;
    for (let i = 0; i < res.data.data.sensorList.length; i++) {
      idcards.value.push(res.data.data.sensorList[i].idcard);
    }
    idcards.value = res.data.data.sensorList
      .filter(item => {
        // 使用正则表达式匹配格式为 "数字-数字" 的 location
        const locationPattern = new RegExp(`^[${monitorType.value}]+-[0-9]+$`);
        return locationPattern.test(item.location);
      })
      .map(item => item.idcard);
    // console.log("传感器ID列表：", res.data.data.sensorList);
    // id.value = res.data.data.sensorList.filter(item => {
    //   const locationPattern = new RegExp(`^[${monitorType.value}]+-[23]+-[0-9]+$`);
    //   return locationPattern.test(item.location);
    // }).map(item => {
    //   return {
    //     location: item.location,
    //     idcard: item.idcard
    //   };
    // });
    openMessage("获取传感器ID成功", "success");
    addMessage(idcards.value);
  } else {
    openMessage("获取传感器ID失败", "error");
  }
};

// 处理图片
const convertImageToBase64 = async imageUrl => {
  try {
    const response = await axios.get(imageUrl, {
      responseType: "arraybuffer"
    });

    const blob = new Blob([response.data], { type: "image/jpeg" });
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onloadend = () => {
        const base64data = reader.result;
        resolve(base64data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    openMessage("图片处理失败", "error");
  }
};

// 获取处理好的图片、监测日期
const get_slope_info = async () => {
  const backupParams = JSON.parse(JSON.stringify(params.value));
  params.value.method = "get_slope_info";
  params.value.updateTime = "";
  params.value.id = slopeId.value;
  const res = await axios.post(API, params.value);
  if (res.data.code === 200) {
    params.value = backupParams;
    // 处理图片
    convertImageToBase64(res.data.data.slopeInfo.slopeImgs[0].imgUrl).then(
      base64 => {
        //console.log(base64);
        const base64Image = base64;
        // 检查数组中是否已经存在相同的图片
        if (!singleProject.value.imgs.includes(base64Image)) {
          singleProject.value.imgs.push(base64Image);
        }
        //console.log("图片：", singleProject.value);
      }
    );
    openMessage("获取平面图成功", "success");
  } else {
    openMessage("获取平面图失败", "error");
  }
};

const filesName = ref([]);
// 上传趋势图
const uploadImage = event => {
  const files = event.target.files;
  for (const file of files) {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result;
        // 检查数组中是否已经存在相同的图片
        if (!totalProject.value.imgs.includes(base64Image)) {
          totalProject.value.imgs.push(base64Image);
          filesName.value.push(file.name);
        }
      };
      reader.readAsDataURL(file);
    }
  }
  openMessage("上传成功", "success");
};
// 删除图片
/*const removeImage = index => {
  totalProject.value.imgs.splice(index, 1);
  filesName.value.splice(index, 1);
};*/

// 获取传感器数据列表
const sensor_data_list = async () => {
  const singleDevice = ref({
    idcards: [],
    deviceName: "", // 监测项目
    maxPoint: "",
    maxPointTotal: "",
    maxPointDir: "",
    maxChange: "",
    minChange: "",
    singlePoints: []
  });
  singleDevice.value.idcards = idcards.value;
  const maxDailyChange = ref(0);
  const minDailyChange = ref(0);
  const maxDailyChangeIndex = ref(0);
  params.value.method = "sensor_data_list";
  //DataQueryCondition.value.dataType = 0;
  //DataQueryCondition.value.isLas = false;
  //DataQueryCondition.value.timeRanges = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
  DataQueryCondition.value.startDt = inputDate(dateRange.value[0]);
  DataQueryCondition.value.endDt = inputDate(dateRange.value[1]);
  //DataQueryCondition.value.startId = 0;
  //DataQueryCondition.value.pageCurrent = 1;
  //DataQueryCondition.value.pageSize = 10;

  // 添加监测日期
  if (tableIndex.value === 0) {
    totalProject.value.monitorDate[0] = formatDate(
      DataQueryCondition.value.startDt,
      "sensor_data_list"
    );
    totalProject.value.monitorDate[1] = formatDate(
      DataQueryCondition.value.endDt,
      "sensor_data_list"
    );
  }
  singleDevice.value.deviceName = deviceName.value;
  // 循环获取传感器数据
  singleDevice.value.singlePoints = [];
  let bool = false;
  for (let i = 0; i < idcards.value.length; i++) {
    const singlePoint = ref({
      point: "", // 监测点位
      direction: "", // 方向
      change: "", // 周期变形量
      total: "" // 累计变形量
    });
    DataQueryCondition.value.sensorIdcard = idcards.value[i];
    params.value.DataQueryCondition = JSON.stringify(DataQueryCondition.value);

    const res = await axios.post(API, params.value);
    if (res.data.code === 200) {
      // console.log(res.data);
      const length = res.data.data.data.length;
      // 监测点位
      const monitor_point = res.data.data.sensorInfo.location.replace(
        /移动站/g,
        ""
      );
      const total_change = ref("——");
      const daily_change = ref("——");
      //const dirNumber = res.data.data.sensorInfo.data.length;
      for (let j = 0; j < dirType.value; j++) {
        if (length > 0) {
          let fixed = 1; // 保留小数位数
          if (monitorType.value == "5") {
            fixed = 2;
          } // 将单位为度数的数据保留两位小数

          total_change.value = parseFloat(
            res.data.data.data[length - 1].data.resultData[j]
          ).toFixed(fixed);
          if (Math.abs(total_change.value) === 0) {
            total_change.value = 0;
          }
          // 日变形量，保留一位小数
          daily_change.value = (
            total_change.value - res.data.data.data[0].data.resultData[j]
          ).toFixed(fixed);
          if (Math.abs(daily_change.value) === 0) {
            daily_change.value = 0;
          }
          if (dirType.value == 2) {
            if (j === 0) {
              singlePoint.value.direction = "X轴";
            } else if (j === 1) {
              singlePoint.value.direction = "Y轴";
            }
          } else if (dirType.value == 3) {
            let type = 0;
            if (
              res.data.data.sensorInfo.sensorTypeInfo.sensorName.includes(
                "一体机"
              )
            ) {
              type = 1;
            }
            if (j === 0) {
              if (total_change.value >= 0) {
                singlePoint.value.direction = type === 0 ? "东" : "北";
              } else if (total_change.value < 0) {
                singlePoint.value.direction = type === 0 ? "西" : "南";
              }
              total_change.value = parseFloat(
                Math.abs(total_change.value)
              ).toFixed(1);
            } else if (j === 1) {
              if (total_change.value >= 0) {
                singlePoint.value.direction = type === 0 ? "北" : "东";
              } else if (total_change.value < 0) {
                singlePoint.value.direction = type === 0 ? "南" : "西";
              }
              total_change.value = parseFloat(
                Math.abs(total_change.value)
              ).toFixed(1);
            } else if (j === 2) {
              singlePoint.value.direction = "高程";
            }
          } else if (dirType.value == 1) {
            if (total_change.value >= 0) {
              singlePoint.value.direction = "坡外";
            } else if (total_change.value < 0) {
              singlePoint.value.direction = "坡内";
            }
          }
        } else {
          singlePoint.value.direction = "——";
        }
        if (daily_change.value != "——" && !bool) {
          maxDailyChange.value = daily_change.value;
          minDailyChange.value = daily_change.value;
          bool = true;
        }
        singlePoint.value.point = monitor_point;
        singlePoint.value.change = daily_change.value.toString();
        singlePoint.value.total = total_change.value.toString();

        singleDevice.value.singlePoints.push(
          JSON.parse(JSON.stringify(singlePoint.value))
        );
        
        // 计算日变形量绝对值，并更新最大值和最小值
        const absDailyChange = Math.abs(daily_change.value);
        if (absDailyChange >= Math.abs(maxDailyChange.value)) {
          maxDailyChange.value = daily_change.value;
          maxDailyChangeIndex.value = i * dirType.value + j;
        }
        if (absDailyChange <= Math.abs(minDailyChange.value)) {
          minDailyChange.value = daily_change.value;
        }
      }
    } else {
      openMessage("获取传感器数据失败", "error");
    }
  }
  idcards.value = [];

  singleDevice.value.maxPoint =
    singleDevice.value.singlePoints[maxDailyChangeIndex.value].point;
  singleDevice.value.maxPointDir =
    singleDevice.value.singlePoints[maxDailyChangeIndex.value].direction;
  singleDevice.value.maxPointTotal =
    singleDevice.value.singlePoints[maxDailyChangeIndex.value].total;
  singleDevice.value.maxChange = maxDailyChange.value.toString();
  singleDevice.value.minChange = minDailyChange.value.toString();
  // console.log(
  //   "最大变形监测点：" +
  //     singleDevice.value.maxPoint +
  //     " 最大变形量：" +
  //     singleDevice.value.maxChange +
  //     " 最大累计变形量：" +
  //     singleDevice.value.maxPointTotal +
  //     " 最小变形量：" +
  //     singleDevice.value.minChange
  // );
  singleDevice.value.singlePoints.sort((a, b) => {
    let numA = parseInt(a.point.split("-")[1], 10);
    let numB = parseInt(b.point.split("-")[1], 10);
    return numA - numB; // 升序排序
  });
  singleProject.value.singleDevices.push(singleDevice.value);
  console.log(singleProject.value);
  addMessage(singleProject.value);
  openMessage("获取传感器数据成功", "success");
};

// 添加到整个项目
const add_project = () => {
  singleProject.value.tableIndex = tableIndex.value.toString();
  tableIndex.value++;
  singleProject.value.imgsCount = imgsCount.value.toString();
  singleProject.value.projectMaxChange =
    singleProject.value.singleDevices[0].maxChange;
  for (let i = 0; i < singleProject.value.singleDevices.length; i++) {
    if (
      singleProject.value.singleDevices[i].maxChange >=
      singleProject.value.projectMaxChange
    ) {
      singleProject.value.projectMaxChange =
        singleProject.value.singleDevices[i].maxChange;
      singleProject.value.projectMaxPoint =
        singleProject.value.singleDevices[i].maxPoint;
      singleProject.value.projectMaxPointTotal =
        singleProject.value.singleDevices[i].maxPointTotal;
      singleProject.value.projectMaxPointDir =
        singleProject.value.singleDevices[i].maxPointDir;
    }
  }
  totalProject.value.singleProjects.push({ ...singleProject.value });
  singleProject.value.tableIndex = tableIndex.value.toString();
  singleProject.value.singleDevices = []; // 重置单个设备数组
  console.log(totalProject.value);
  openMessage("添加成功", "success");
  addMessage(totalProject.value);
};

// 格式化日期
const formatDate = (sendDate, method) => {
  const date = new Date(sendDate);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if (method === "get_slope_info") {
    return `${year}年${month < 10 ? "0" + month : month}月`;
  } else if (method === "sensor_data_list") {
    return `${year}年${month < 10 ? "0" + month : month}月${
      day < 10 ? "0" + day : day
    }日`;
  }
};

// 格式化输入日期
const inputDate = date => {
  var originalDate = new Date(date);

  // 格式化输出
  var formattedDate =
    originalDate.getFullYear() +
    "-" +
    (originalDate.getMonth() + 1).toString().padStart(2, "0") +
    "-" +
    originalDate
      .getDate()
      .toString()
      .padStart(2, "0") +
    " " +
    originalDate
      .getHours()
      .toString()
      .padStart(2, "0") +
    ":" +
    originalDate
      .getMinutes()
      .toString()
      .padStart(2, "0") +
    ":" +
    originalDate
      .getSeconds()
      .toString()
      .padStart(2, "0");
  return formattedDate;
};

// 导出word
const getWord = () => {
  // 使用拦截器
axios.interceptors.request.use(
  (config) => {
    // 判断是否是导出文档的请求
    if (config.url === 'http://localhost:5113/api/Word/GetWord' && config.method === 'post') {
      // 显示加载中状态
      const loading = showLoading();
      // 将 loading 实例存储到 config 中
      config.loadingInstance = loading;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    // 如果配置中有 loading 实例，则关闭它
    const loadingInstance = response.config.loadingInstance;
    hideLoading(loadingInstance);

    return response;
  },
  (error) => {
    // 如果配置中有 loading 实例，则关闭它
    const loadingInstance = error.config && error.config.loadingInstance;
    hideLoading(loadingInstance);

    return Promise.reject(error);
  }
);

// 导出文档的请求
axios
  .post("http://localhost:5113/api/Word/GetWord", totalProject.value, {
    headers: {
      "Content-Type": "application/json"
    },
    // 可选：添加回调函数，在请求完成时关闭加载
    // 但拦截器已经处理了关闭逻辑，可以省略
  })
  .then(response => {
    console.log(response.data.message);
    openMessage("导出成功", "success");
  })
  .catch(error => {
    openMessage(error.message || "导出失败", "error");
  });
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between; /* 左右分布 */
  align-items: center; /* 垂直居中 */
  margin-top: 20px; /* 可选：调整顶部间距 */
}

.title {
  font-weight: bold; /* 加粗字体 */
  margin-left: 150px; /* 可选：调整标题左边距 */
}

.buttons {
  display: flex;
  gap: 10px; /* 按钮之间的间距 */
  margin-right: 150px; /* 可选：调整按钮右边距 */
}

.login,
.get {
  font-weight: bold; /* 可选：加粗按钮文字 */
}

.form {
  height: 100%;
  width: 80%;
  margin: 0 auto;
  margin-top: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.message-container {
  width: 80%;
  height: 200px;
  border: 1px solid #ccc;
  border-radius: 5px;
  overflow-y: auto; /* 显示垂直滚动条 */
  padding: 10px;
  font-family: monospace;
  background-color: #f9f9f9;
}

.custom-label {
  font-weight: bold; /* 加粗字体 */
}

.message {
  margin: 5px 0;
}

.upload-demo {
  margin: 0 20px 20px 20px;
  height: 500px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.custom-file-upload {
  padding: 10px 20px;
  /* 水平居中 */
  margin-top: 10px;
  margin-left: 20px;
  border: 2px dashed #ccc;
  border-radius: 5px;
  font-size: 16px;
  color: #333;
  background-color: #f8f8f8;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.uploaded-image {
  max-width: 100px;
  max-height: 100px;
  object-fit: cover;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.image-filename {
  font-size: 8px;
}

.custom-file-upload:hover {
  background-color: #e9e9e9;
}
</style>