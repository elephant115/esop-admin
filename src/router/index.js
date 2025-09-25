import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layout/index.vue'

// 权限管理
import UserManageRouter from './modules/common.js'
// 规则管理
import regulation from './modules/regulation.js'
// 规则配置
import resources from './modules/resources.js'
// 新闻资讯
import information from './modules/information.js'
// APP
import app from './modules/app.js'
// 权益
import equity from './modules/equity.js'
// 合约管理
import contract from './modules/contract.js'
// 计划管理
import planManagement from './modules/planManagement.js'
// 审核管理
import auditManagement from './modules/auditManagement.js'
// 数据管理
import data from './modules/data.js'
// 数据管理
import system from './modules/system.js'
// 系统路由
export const asyncRoutes = [
  // ...UserManageRouter,
  ...regulation,
  ...resources,
  ...information,
  ...app,
  ...equity,
  ...contract,
  ...planManagement,
  ...auditManagement,
  ...system,
]
export const constRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/common',
    name: 'common'
  },
  {
    path: '/common',
    component: Layout,
    redirect: '/common/form',
    common: "common",
    meta: {
      title: '权限管理',
      icon: 'personnel',
      roles: ['common:page']
    },
    children: [
      {
        path: '/common/form',
        name: 'commonform',
        component: () => import('@/views/common/form'),
        meta: {
          title: '用户管理',
          icon: 'personnel-manage',
          roles: ['common:page']
        }
      }
    ]
  },
  // ...data,
  // ...system,
  {
    path: '/login',
    name: 'login',
    component: () =>
      import('@/views/login/index.vue')
  },
  {
    path: '/401',
    name: '401',
    component: () =>
      import('@/views/error/401.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: () =>
      import('@/views/error/404.vue')
  }
]

// constRoutes.push(system)

// asyncRoutes.forEach((item) => {
//     constRoutes.push(item)
// })
const routerHistory = createWebHistory('/#/')
// history: createWebHistory(process.env.BASE_URL),
const router = createRouter({
  history: routerHistory,
  routes: constRoutes
})

export default router