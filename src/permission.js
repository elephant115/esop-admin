import store from '@/store/index.js'
import router from './router'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/store.js'
import { setUser } from '@/utils/userStore.js'
import { asyncRoutes } from '@/router'


NProgress.configure({ showSpinner: false })

const whiteList = ['/login']
let flag = 0
router.beforeEach(async (to, from, next) => {
    // if (flag === 0 && to.matched.length == 0) { 
    //   flag++
    //   router.push(to.path); 
    // } else if (flag !== 0 && to.matched.length == 0) {
    //   next('/')
    // } else {
    //   next()
    // }
    NProgress.start()
    const hasToken = getToken()
    console.log(hasToken, 'hasTokenhasToken')
    // console.log(store, 'storestore')
    if (hasToken) {
        // 判断token是否存在，进行业务处理
        if (to.path === '/login') {
            next({ path: '/' })
            NProgress.done()
        } else {
            console.log(store.state.user.hebing);
            console.log(router.menus);
            // 具体业务处理 数据模拟
            let loginInfo = {
                userInfo: {
                    actualName: '雷电法王',
                    admin: true,
                    userId: '1184273454397001728',
                    conditionDeptIds: [],
                    conditionUserId: null,
                    roles: ['管理员'],
                    permissions: [
                        'embroadcast:first:page',
                        'regulation:page', // 权限管理
                        'resources:page', // 规则配置
                        'userManage:page',
                        'common:page',
                        'media:object:list',
                        'auditManagement:page',
                        'audit:deal:list',
                        'sys:employee:list',
                        'sys:app:list',
                        'sys:tenant:list',
                        'pact:type:remove',
                        'planManagement:page',
                        'contract:page',
                        'data:page',
                        'information:page',
                        'equity:page',
                        'version:page'
                    ]
                }
            }
            store.commit('user/SET_LOGININFO', loginInfo)
            store.dispatch('permission/filterRoutes', loginInfo.userInfo.permissions)
            setUser(loginInfo.userInfo)
            console.log(to, from);
            // if (from.path === '/') {
            //     let obj
            //     obj = localStorage.getItem("limitsAuthority") ? JSON.parse(localStorage.getItem("limitsAuthority")) : []
            //     let localRoute = asyncRoutes // 全部路由
            //     let showRoute = [] // 要展示的路由
            //     let selectedNode = obj// 选中的节点
            //     // 如果在第一层父节点的name那么把这块节点全部push到要展示的路由数组里
            //     localRoute.forEach((item) => {
            //         selectedNode.forEach((items) => {
            //             if (item.name == items) {
            //                 showRoute.push(item)
            //             }
            //         })
            //     })
            //     // 根据上面存进去的路由循环过滤出一样的name 然后剩下没有父节点的子节点的name
            //     selectedNode.forEach((item, index) => {
            //         showRoute.forEach((items) => {
            //             if (items.name == item) {
            //                 selectedNode = selectedNode.filter((itemss) => itemss != items.name)
            //             }
            //             items.children.forEach((itemsss) => {
            //                 selectedNode = selectedNode.filter((itemss) => itemss != itemsss.name)
            //             })
            //         })
            //     })
            //     // 根据子节点的name去全部路由里面找对应的父节点和子节点push到要展示的路由里面
            //     selectedNode.forEach((item) => {
            //         localRoute.forEach((items) => {
            //             items.children.forEach((itemss) => {
            //                 if (item == itemss.name) {
            //                     // 判断当前要展示的路由里面是否有selectedNode子节点的name
            //                     let flag = true
            //                     showRoute.forEach((itemsss) => {
            //                         if (itemsss.name == items.name) {
            //                             flag = false
            //                         }
            //                     })
            //                     if (flag) {
            //                         // 如果没有获取当前子节点的父节点push到要展示的路由里面
            //                         let localRoute = JSON.parse(JSON.stringify(items))
            //                         // items包含了所有子节点所以要清空
            //                         localRoute.children = []
            //                         localRoute.children.push(itemss)
            //                         // 拿到当前的父子节点push进去
            //                         showRoute.push(localRoute)
            //                     } else {
            //                         // 如果有了在次循环要展示的路由直接push到当前父节点的children里面
            //                         showRoute.forEach((itemsss) => {
            //                             if (itemsss.name == items.name) {
            //                                 itemsss.children.push(itemss)
            //                             }
            //                         })
            //                     }
            //                 }
            //             })
            //         })
            //     })
            //     showRoute.forEach(item => {
            //         router.addRoute(item)
            //     })
            // }
            next();
        }
    } else {
        // token不存在
        if (whiteList.indexOf(to.path) !== -1) {
            next()
        } else {
            next(`/login?redirect=${to.path}`)
            NProgress.done()
        }
    }
})
router.afterEach(() => {
    NProgress.done()
})