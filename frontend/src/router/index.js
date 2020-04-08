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
        name:'Employee',
        path:'employee',
        component:() => import('@/views/Person/Employee'),
      },
      {
        name:'AddEmployee',
        path:'addemployee',
        component:() => import('@/views/Person/AddEmployee'),
      },
      {
        name:'EmployeeGroup',
        path:'employeegroup',
        component:() => import('@/views/Person/EmployeeGroup'),
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
