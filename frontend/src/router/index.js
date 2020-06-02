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
        name:'Visitor',
        path:'visitor',
        component:() => import('@/views/Person/Visitor'),
      },
      {
        name:'AddVisitor',
        path:'addVisitor',
        component:() => import('@/views/Person/AddVisitor'),
      },
      {
        name:'VisitorGroup',
        path:'visitorgroup',
        component:() => import('@/views/Person/VisitorGroup'),
      },
      {
        name:'Blacklist',
        path:'blacklist',
        component:() => import('@/views/Person/Blacklist'),
      },
      {
        name:'AddBlacklist',
        path:'addBlacklist',
        component:() => import('@/views/Person/AddBlacklist'),
      },
      {
        name:'BlacklistGroup',
        path:'blacklistgroup',
        component:() => import('@/views/Person/BlacklistGroup'),
      },
      {
        name:'RegRecord',
        path:'regrecord',
        component:() => import('@/views/Person/RegRecord'),
      },
      {
        name:'SearchPeople',
        path:'searchpeople',
        component:() => import('@/views/Person/SearchPeople'),
      },
      {
        name:'AttendanceRules',
        path:'attendancerules',
        component:() => import('@/views/Attendance/AttendanceRules'),
      },
      {
        name:'AttendanceArea',
        path:'attendancearea',
        component:() => import('@/views/Attendance/AttendanceArea'),
      },
      {
        name:'AttendanceRecords',
        path:'attendancerecords',
        component:() => import('@/views/Attendance/AttendanceRecords'),
      },
      {
        name:'AttendanceStatistics',
        path:'attendancestatistics',
        component:() => import('@/views/Attendance/AttendanceStatistics'),
      },
      {
        name:'Account',
        path:'account',
        component:() => import('@/views/System/Account'),
      },
      {
        name:'OperationLog',
        path:'operationlog',
        component:() => import('@/views/System/OperationLog'),
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
  // mode: 'history',
  routes
})

export default router
