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
        name:'AttendanceRules',
        path:'attendancerules',
        component:() => import('@/views/Attendance/AttendanceRules'),
      },
      {
        name:'AttendanceRecords',
        path:'attendancerecords',
        component:() => import('@/views/Attendance/AttendanceRecords'),
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
        component:() => import('@/views/Dashboard'),
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
