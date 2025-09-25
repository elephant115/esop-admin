<!--
 * @Author: 小周
 * @Date: 2022-02-28 15:40:20
 * @LastEditTime: 2022-04-18 11:32:34
 * @LastEditors: 小周
 * @Description: 登录页面
 * @FilePath: \vue3-practice\src\views\login\index.vue
-->
<template>
  <div class="login-container">
    <div class="login-plane">
      <h1 class="title">系统登录</h1>
      <div class="login-plane-form">
        <el-form :model="ruleForm" :rules="formRules" ref="formRef" label-width="80px">
          <el-form-item label="用户名:" prop="email">
            <el-input v-model="ruleForm.email" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="密码:" prop="password">
            <el-input v-model="ruleForm.password" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-button @click="submitForm" style="width: 100%" type="primary">登录</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, unref } from 'vue'
import { useRouter } from 'vue-router'
import { setToken, getToken, setUid } from '@/utils/store.js'
import { login } from '@/api/login'
import { constRoutes, asyncRoutes } from '@/router'
import { ElMessage } from 'element-plus'
import { adminUserList } from '@/api/system/role'
import store from '@/store/index.js'
const formRef = ref(null)
const ruleForm = reactive({
  email: '',
  password: ''
})

// 表单校验
const formRules = reactive({
  email: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
})

const router = useRouter()

// 提交表单
const submitForm = () => {
  console.log('router', constRoutes)
  // resources
  const form = unref(formRef)
  if (!form) return
  form.validate(async (valid) => {
    if (!valid) return
    let res = await login({
      email: ruleForm.email,
      password: ruleForm.password
    })
    if (res.data.code == 0) {
      setToken(res.data.data.data.token)
      localStorage.setItem('operation', res.data.data.data.operation)
      setTimeout(() => {
        adminUserList(
          {
            uid: res.data.data.data.uid
          },
          res.data.data.data.token
        ).then((res) => {
          let obj = res.data.data.data.records[0].limitsAuthority || []
          localStorage.setItem('limitsAuthority', obj)
          store.commit('user/getLimitsAuthority', obj)
          obj = localStorage.getItem('limitsAuthority')
            ? JSON.parse(localStorage.getItem('limitsAuthority'))
            : []
          let localRoute = asyncRoutes // 全部路由
          let showRoute = [] // 要展示的路由
          let selectedNode = obj // 选中的节点
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
                selectedNode = selectedNode.filter(
                  (itemss) => itemss != items.name
                )
              }
              items.children.forEach((itemsss) => {
                selectedNode = selectedNode.filter(
                  (itemss) => itemss != itemsss.name
                )
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
          showRoute.forEach((item) => {
            router.addRoute(item)
          })
          console.log(showRoute);
          router.push('/')
        })
      }, 100)
    } else {
      ElMessage({
        type: 'error',
        message: res.data.msg
      })
    }
  })
}
</script>

<style lang="scss" scoped>
.login-container {
  position: relative;
  display: flex;
  min-width: 940px;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: #5794ff;
  box-sizing: border-box;
  .login-plane {
    position: absolute;
    z-index: 9999;
    width: 500px;
    height: 400px;
    top: 50%;
    left: 50%;
    border-radius: 10px;
    background-color: #fff;
    transform: translate(-50%, -50%);
    .title {
      display: block;
      text-align: center;
      font-size: 30px;
      padding: 20px 0;
      letter-spacing: 4px;
    }
    &-form {
      padding: 45px 55px;
      box-sizing: border-box;
    }
  }
}
</style>
