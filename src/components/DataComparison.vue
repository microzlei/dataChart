<template>
  <div class="stats-container">
    <div v-for="(item, index) in statsData" :key="index" class="stats-item">
      <div class="stats-numbers">{{ formattedNumber(item.number) }}</div>
      <div class="stats-title">{{ item.type }}</div>

      <div class="stats-changes">
        <div class="stats-change">
          环比
          <span class="percentage" :class="{ up: item.环比[0] !== '-', down: item.环比[0] === '-' }">
            {{ item.环比 }}
            <span v-if="item.环比[0] !== '-'">↑</span>
            <span v-else>↓</span>
          </span>
        </div>
        <div class="stats-change">
          同比
          <span class="percentage" :class="{ up: item.同比[0] !== '-', down: item.同比[0] === '-' }">
            {{ item.同比 }}
            <span v-if="item.同比[0] !== '-'">↑</span>
            <span v-else>↓</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script>
export default {
  name: "StatsComponent",
  props: {
    statsData: {
      type: Array,
      required: true
    }
  },
  methods: {
    formattedNumber(number) {
      return Number(number).toLocaleString();
    }
  }
};
</script>
  
  <style scoped>
.stats-container {
  padding: 10px;
  background-color: #f1f8ff;
  border-radius: 8px;
  max-width: 300px;
}

.stats-item {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.stats-numbers {
  font-size: 24px;
  font-weight: bold;
  color: #1d63eb;
  margin-bottom: 5px;
}

.stats-title {
  font-size: 12px;
  color: #888;
  margin-bottom: 10px;
}

.stats-changes {
  display: flex;
  width: 100%;
  justify-content: space-between;
}

.stats-change {
  font-size: 14px;
  color: #333;
}

.percentage {
  margin-left: 5px;
}

.up {
  color: #e74c3c;
}

.down {
  color: #2ecc71;
}
</style>
  