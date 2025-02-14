<template>
  <div class="selector-container">
    <!-- 时间范围单选按钮 -->
    <div>
      <button
        v-for="period in periods"
        :key="period"
        class="period-button"
        :class="{ 'is-active': selectedPeriod === period }"
        @click="selectPeriod(period)"
      >
        {{ period }}
      </button>
    </div>

    <!-- 机构下拉选择框 -->
    <div>

      <select id="institution-select" v-model="selectedInstitution" class="institution-select">
        <option value="all">所有机构</option>
        <option v-for="institution in institutions" :key="institution" :value="institution">
          {{ institution }}
        </option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  name: 'querySelector',
  props: {
    periods: {
      type: Array,
      required: true,
    },
    institutions: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      selectedPeriod: this.periods[0], // 默认选择第一个时间范围
      selectedInstitution: 'all', // 默认选择“所有机构”
    };
  },
  methods: {
    selectPeriod(period) {
      this.selectedPeriod = period;
      this.$emit('periodChanged', period);
    },
  },
  watch: {
    selectedInstitution(newVal) {
      this.$emit('institutionChanged', newVal);
    },
  },
};
</script>

<style scoped>
.selector-container {
  margin: 20px;
  display: flex;
  flex-direction: column;
}

.period-button {
  margin: 5px;
  padding: 3px 20px;
  font-size: 16px;
  font-weight: bold;
  border: 5px solid transparent;
  border-radius: 50px;
  background-color: white;
  cursor: pointer;
  outline: none;
}

.period-button.is-active {
  color: #007bff;
  background-color: white;
}

.institution-select {
  padding: 5px;
  margin-top: 5px;
  font-size: 16px;
  border: transparent;
  background-color: transparent;
  outline: none;
  color: #8D8E8E;
}
</style>