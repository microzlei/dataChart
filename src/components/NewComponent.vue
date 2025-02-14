<template>
  <div>
    <h1>New Component</h1>
    <button @click="logout">Logout</button>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
const logout = () => {
  localStorage.removeItem('token');
  router.push('/')
}
</script>

<style>

</style>