import { createApp } from 'vue'
import App from './App.vue'
import dataV from '@jiaminghi/data-view'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import Promise from 'es6-promise'
Promise.polyfill()

createApp(App).use(dataV).use(router).use(ElementPlus).mount('#app')
