import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Main from '@/pages/Main.vue'
import PatientInfo from '@/pages/PatientInfo.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'patientsList',
    component: Main
  },
  {
    path: '/patient/:id',
    name: 'patientInfo',
    component: PatientInfo
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
