import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path:'/index',
    name:'종합 현황판',
    component:() => import('@/views/Index'),
    children: [
      {
        name:'종합 현황판',
        path:'',
        component:() => import('@/views/Dashboard'),
      },
      {
        name:'단말기/목록',
        path:'device/list',
        component:() => import('@/views/Device/Device'),
      },
      {
        name:'단말기/스크린샷',
        path:'device/screen',
        component:() => import('@/views/Device/DeviceScreen'),
      },
      {
        name:'단말기/로그',
        path:'device/log',
        component:() => import('@/views/Device/DeviceLog'),
      },
      {
        name:'인사/사원/추가',
        path:'people/employee/add',
        component:() => import('@/views/Person/AddEmployee'),
      },
      {
        name:'인사/사원',
        path:'people/employee',
        component:() => import('@/views/Person/EmployeeGroup'),
      },
      {
        name:'인사/방문자/추가',
        path:'people/visitor/add',
        component:() => import('@/views/Person/AddVisitor'),
      },
      {
        name:'인사/방문자',
        path:'people/visitor',
        component:() => import('@/views/Person/VisitorGroup'),
      },
      {
        name:'인사/블랙리스트/추가',
        path:'people/blacklist/add',
        component:() => import('@/views/Person/AddBlacklist'),
      },
      {
        name:'인사/블랙리스트',
        path:'people/blacklist',
        component:() => import('@/views/Person/BlacklistGroup'),
      },
      {
        name:'인사/등록기록',
        path:'people/regrecord',
        component:() => import('@/views/Person/RegRecord'),
      },
      {
        name:'인사/사진 검색',
        path:'people/search',
        component:() => import('@/views/Person/SearchPeople'),
      },
      {
        name:'출입/출입 기록',
        path:'access/records',
        component:() => import('@/views/Attendance/AttendanceRecords'),
      },
      {
        name:'출입/출근 기록',
        path:'access/statistics',
        component:() => import('@/views/Attendance/AttendanceStatistics'),
      },
      {
        name:'시스템/계정',
        path:'system/account',
        component:() => import('@/views/System/Account'),
      },
      {
        name:'시스템/작업 기록',
        path:'system/log',
        component:() => import('@/views/System/OperationLog'),
      },
      {
        name:"종합 현황판",
        path:'dashboard',
        component:() => import('@/views/Dashboard'),
      },
      {
        name:"통계/단말기",
        path:'report/device',
        component:() => import('@/views/Reports/DeviceReport'),
      },
      {
        name:"시스템/계정/추가",
        path:'system/account/add',
        component:() => import('@/views/System/AddAccount'),
      },
      {
        name:"인사/미등록자",
        path:'people/stranger',
        component:() => import('@/views/Person/Stranger'),
      },
      {
        name:"인사/미등록자/추가",
        path:'people/stranger/add',
        component:() => import('@/views/Person/AddStranger'),
        props:true
      },
      {
        name:"통계/출입",
        path:'report/access',
        component:() => import('@/views/Reports/AccessReport'),
        props:true
      },
      {
        name:"열화상/단말기",
        path:'itc/device',
        component:() => import('@/views/ITC/ITC_device'),
        props:true
      },
      {
        name:"열화상/기록",
        path:'itc/records',
        component:() => import('@/views/ITC/ITC_records'),
        props:true
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
