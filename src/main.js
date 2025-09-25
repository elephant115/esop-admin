/*
 * @Author: 小周
 * @Date: 2022-03-Th 05:04:17
 * @Last Modified by:   小周
 * @Last Modified time: 2022-03-Th 05:04:17
 * @ descript 配置
 */
import { createApp } from 'vue'
import App from './App.vue'
// import Vue from 'vue' Vue

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { asyncRoutes } from '@/router'
import router from './router'
import store from './store/index'
import { getToken } from '@/utils/store.js'
// 如果您正在使用CDN引入，请删除下面一行。
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
const debounce = (fn, delay) => {
  let timer = null;
  return function () {
    let context = this;
    let args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  }
}
console.log(getToken());
function initMent() {
  let obj
  obj = localStorage.getItem("limitsAuthority") ? JSON.parse(localStorage.getItem("limitsAuthority")) : []
  let localRoute = asyncRoutes // 全部路由
  let showRoute = [] // 要展示的路由
  let selectedNode = obj// 选中的节点
  // 如果在第一层父节点的name那么把这块节点全部push到要展示的路由数组里
  localRoute.forEach((item) => {
    selectedNode.forEach((items) => {
      if (item.name == items) {
        showRoute.push(item)
      }
    })
  })
  // 根据上面存进去的路由循环过滤出一样的name 然后剩下没有父节点的子节点的name
  selectedNode.forEach((item, index) => {
    showRoute.forEach((items) => {
      if (items.name == item) {
        selectedNode = selectedNode.filter((itemss) => itemss != items.name)
      }
      items.children.forEach((itemsss) => {
        selectedNode = selectedNode.filter((itemss) => itemss != itemsss.name)
      })
    })
  })
  // 根据子节点的name去全部路由里面找对应的父节点和子节点push到要展示的路由里面
  selectedNode.forEach((item) => {
    localRoute.forEach((items) => {
      items.children.forEach((itemss) => {
        if (item == itemss.name) {
          // 判断当前要展示的路由里面是否有selectedNode子节点的name
          let flag = true
          showRoute.forEach((itemsss) => {
            if (itemsss.name == items.name) {
              flag = false
            }
          })
          if (flag) {
            // 如果没有获取当前子节点的父节点push到要展示的路由里面
            let localRoute = items
            // items包含了所有子节点所以要清空
            localRoute.children = []
            localRoute.children.push(itemss)
            // 拿到当前的父子节点push进去
            showRoute.push(localRoute)
          } else {
            // 如果有了在次循环要展示的路由直接push到当前父节点的children里面
            showRoute.forEach((itemsss) => {
              if (itemsss.name == items.name) {
                itemsss.children.push(itemss)
              }
            })
          }
        }
      })
    })
  })
  showRoute.forEach(item => {
    router.addRoute(item)
  })

}
async function init() { 
  await initMent()
}
router.beforeEach(async (to, from, next) => {
  next()
})
const _ResizeObserver = window.ResizeObserver;
window.ResizeObserver = class ResizeObserver extends _ResizeObserver {
  constructor(callback) {
    callback = debounce(callback, 16);
    super(callback);
  }
}

// 初始化
import initApp from './init'
// 权限
import './permission'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
initApp(app)
async function call() {
  await init()
  console.log('call');
  app
    .use(router)
    .use(store)
    .use(ElementPlus, {
      locale: zhCn
    })
    .mount('#app')
}
call()