import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Main from '@/pages/Main.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'patientsList',
    component: Main
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
