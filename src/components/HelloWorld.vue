<template>
  <div class="screen">
    <!-- <h1>Students List</h1>
    <ul>
      <li
        v-for="student in students"
        :key="student.id"
      >{{ student.name }} - {{ student.age }} years old</li>
      <li v-for="people in peoples.data" :key="people.id">{{ people.name }}</li>
    </ul>
    <div class="login">
      <h2>Login</h2>
      <div>
        <form @submit.prevent="login">
          <div>
            <label for="username">用户名:</label>
            <input type="text" id="username" v-model="form.username" placeholder="请输入用户名" />
          </div>
          <div>
            <label for="password">密码:</label>
            <input type="password" id="password" v-model="form.password" placeholder="请输入密码" />
          </div>
          <div>
            <button type="submit">登录</button>
          </div>
        </form>
        <div v-if="message">{{ message }}</div>
      </div>
    </div>-->
    <div id="app">
      <querySelector
        :periods="periods"
        :institutions="institutions"
        @periodChanged="handlePeriodChange"
        @institutionChanged="handleInstitutionChange"
      />
      <label v-if="periods === '本月'">hello world</label>
    </div>
    <div class="data-comparison">
      <dataComparison :statsData="statsData" />
    </div>
    <div>
      <trendCharts :data="data2" :bottom="30" legendWidth="80%" :colors="['#1677ff','#30c696']" />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { getStudents, getPeoples, user } from "@/utils/api";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import querySelector from "@/components/QuerySelector.vue";
import dataComparison from "@/components/DataComparison.vue";
import trendCharts from "@/components/TrendCharts.vue";
import md5 from "md5";

export default {
  name: "HelloWorld",
  data() {
    return {
      students: [],
      peoples: [],
      periods: ["本月", "本季度", "本年"],
      institutions: ["机构A", "机构B", "机构C"],
      statsData: [
        {
          type: "门急诊人次",
          number: "252000",
          环比: "1.99%",
          同比: "-3.24%"
        },
        {
          type: "门诊人次",
          number: "122000",
          环比: "-2.49%",
          同比: "-2.07%"
        }
      ],
      apiData: null,
      params: {
        ver: 3,
        sign: "7799d46ec239700efa0d22e36d253da4",
        key: 1730688604,
        time: Date.now().toString(),
        method: "login",
        loginName: "zhanglei",
        password: "#{z2J5Va&S"
      }
    };
  },
  components: {
    querySelector,
    dataComparison,
    trendCharts
  },
  methods: {
    handleDateChange(newDate) {
      console.log("Selected date:", newDate);
    },
    handleInstitutionChange(newInstitution) {
      console.log("Selected institution:", newInstitution);
    },
    async fetchData() {
      try {
        const response = await axios.post(
          "http://api.cloudeyes.cn/api/method",
          this.params
        );
        this.apiData = response.data; // 存储返回的数据
        console.log("API Data:", this.apiData);
      } catch (error) {
        console.error("Error fetching data from API:", error);
      }
    }
  },
  async created() {
    const router = useRouter();
    const token = localStorage.getItem("token");

    // 生成签名并赋值给params中的sign字段
    const secret = "d8d4b41d56eb439792b8266641673615"; // 你的密钥
    const sign = md5(this.params.time + secret);
    this.params.sign = sign;

    this.fetchData();
    if (token) {
      //跳转到首页
      router.push("/");
    } else {
      try {
        const response = await getStudents();
        const data = await getPeoples();
        if (response.status === 200) {
          this.students = response.data.value;
          this.peoples = data;
        }
        console.log("students:", this.students);
        console.log("peoples:", this.peoples);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    }
  },
  setup() {
    const form = reactive({
      username: "",
      password: ""
    });

    const data2 = ref([
      { name: "门诊", data: [50, 55, 60, 65, 70, 75, 80, 85, 70, 60, 55, 50] },
      { name: "急诊", data: [60, 65, 50, 55, 60, 70, 75, 60, 50, 55, 60, 65] }
    ]);
    const router = useRouter();
    const message = ref("");

    function generateSign(time, secret) {
      const input = time + secret;
      const md5 = require("md5");
      return md5(input);
    }

    // 使用示例
    const time = Date.now().toString(); // 当前时间戳
    const secret = "d8d4b41d56eb439792b8266641673615"; // 你的密钥
    const sign = generateSign(time, secret);
    console.log("Sign:", sign);

    const login = async () => {
      try {
        const response = await user(form.username, form.password);
        message.value = response.data;
        if (response.data.token) {
          //跳转到首页
          localStorage.setItem("token", response.data.token);
          router.push("/newComponent");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    return {
      form,
      login,
      message,
      data2
    };
  }
};
</script>

<style>
.screen {
  margin: 0;
  padding: 0;
  border: none;
  background-color: #f3f5f7;
}
</style>