import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path:'/index',
    name:'Home',
    component:() => import('@/views/Index'),
    children: [
      {
        name:'Device',
        path:'',
        component:() => import('@/views/Dashboard'),
      },
      {
        name:'Device',
        path:'device',
        component:() => import('@/views/Device/Device'),
      },
      {
        name:'Group',
        path:'employeemanagement',
        component:() => import('@/views/Group/Group'),
      },
      {
        name:'Statistics',
        path:'statistics',
        component:() => import('@/views/Statistics'),
      },
      {
        name:'Setting update',
        path:'setting_update',
        component:() => import('@/views/Setting/Setting_update'),
      },
      {
        name:'Setting user',
        path:'setting_user',
        component:() => import('@/views/Setting/Setting_user'),
      },
      {
        name:"Dashboard",
        path:'dashboard',
        component:() => import('@/views/Dashboard.vue'),
      }
    ]
  },
  {
    name:'Login',
    path:'/',
    component: () => import('@/views/Login')
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
