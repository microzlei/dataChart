import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../view/home/getData.vue')
  },
  {
    path: '/chart',
    name: 'Chart',
    component: () => import('../components/dataChart.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router;