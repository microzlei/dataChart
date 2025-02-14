<template>
  <div>
    <!-- 添加单个设备按钮 -->
    <button @click="addSingleDevice">添加单个设备</button>
    <!-- 添加单个项目按钮 -->
    <button @click="addSingleProject">添加单个项目</button>
    <!-- 添加整个项目按钮 -->
    <button @click="addTotalProject">添加整个项目</button>
  </div>
</template>

<script>
import { reactive } from 'vue';

export default {
  setup() {
    // 整个项目
    const totalProject = reactive({
      monitorDate: [], // 监测日期
      singleProject: [], // 单个项目数据
    });

    // 存储所有设备的数组
    const allDevices = reactive([]);

    // 添加单个设备
    function addSingleDevice() {
      // 添加固定的设备数据
      const newDevice = {
        point: "设备" + (allDevices.length + 1),
        direction: "北",
        change: "0.5",
        total: "1.5"
      };
      allDevices.push(newDevice);
      console.log("添加的单个设备数据：", allDevices);
    }

    // 添加单个项目
    function addSingleProject() {
      // 添加固定的项目数据
      const newProject = {
        project: "项目" + (totalProject.singleProject.length + 1),
        tableIndex: "001" + (totalProject.singleProject.length + 1),
        imgs: ["img" + (totalProject.singleProject.length + 1) + ".jpg"],
        singleDevice: [...allDevices] // 复制当前所有设备数据
      };
      totalProject.singleProject.push(newProject);
      console.log("添加的单个项目数据：", totalProject.singleProject);
      // 清空设备数据，为下一个项目做准备
      allDevices.splice(0, allDevices.length);
    }

    // 添加整个项目
    function addTotalProject() {
      // 添加固定的总项目数据
      totalProject.monitorDate.push("2024-11-15");
      console.log("添加的整个项目数据：", totalProject);
    }

    return {
      addSingleDevice,
      addSingleProject,
      addTotalProject
    };
  }
};
</script>