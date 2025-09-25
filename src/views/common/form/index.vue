<template>
  <div>
    <head-title tite="用户管理"></head-title>
    <div class="padding">
      <el-card class="box-card">
        <template #header>
          <el-form :model="data.queryParams" ref="queryForm" :inline="true" label-width="140px">
            <el-form-item label="用户id" prop="id">
              <el-input v-model="data.queryParams.id" placeholder="请输入用户昵称" clearable />
            </el-form-item>
            <el-form-item label="用户昵称" prop="userName">
              <el-input v-model="data.queryParams.userName" placeholder="请输入用户昵称" clearable />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="data.queryParams.email" placeholder="请输入邮箱" clearable />
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="data.queryParams.phone" placeholder="请输入手机" clearable />
            </el-form-item>

            <el-form-item label="用户类型：" prop="type">
              <el-select v-model="data.queryParams.type" placeholder="请选择用户类型">
                <el-option label="普通用户" value="0" />
                <el-option label="代理商" value="1" />
                <el-option label="后台管理员" value="2" />
                <el-option label="模拟账户" value="3" />
              </el-select>
            </el-form-item>
            <el-form-item label="状态：" prop="status">
              <el-select v-model="data.queryParams.status" placeholder="请选择状态">
                <el-option label="禁用" value="1" />
                <el-option label="启用" value="0" />
              </el-select>
            </el-form-item>
            <el-form-item label="是否禁止注册：">
              <el-switch
                @change="forbidStatusChange"
                v-model="data.forbidStatus"
                active-text="禁止"
                inactive-text="不禁止"
              />
            </el-form-item>
            <el-form-item label="是否禁止登录：">
              <el-switch
                @change="forbidLoginStatusChange"
                v-model="data.forbidLoginStatus"
                active-text="禁止"
                inactive-text="不禁止"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :icon="Search" @click="getlists">搜索</el-button>
              <el-button type="primary" @click="reset()">
                <el-icon>
                  <Refresh />
                </el-icon>重置
              </el-button>
              <el-button v-if="data.operation == 1" type="primary" @click="userShowTrue">新增用户</el-button>
              <el-button v-if="data.operation == 1" @click="showDialog" type="primary">新增普通管理员</el-button>
              <el-upload
                style="margin-left: 12px;"
                class="upload"
                action="#"
                :show-file-list="false"
                :on-change="handleExcel"
                accept="'.xlsx', '.xls'"
                :auto-upload="false"
                v-if="data.operation == 1"
                :headers="data.headers"
              >
                <el-button type="primary">导入</el-button>
              </el-upload>

              <!-- <el-button type="primary" @click="add">
                <el-icon>
                  <Plus />
                </el-icon>新增
              </el-button>-->
            </el-form-item>
          </el-form>
        </template>
        <!-- </div> -->
        <!-- <div style="padding: 30px 0"> -->
        <div class="flex_box">
          <!-- <el-button type="primary" @click="add"
            ><el-icon> <Plus /> </el-icon>新增</el-button
          >-->
          <el-button v-if="data.operation == 1" type @click="exportExcel">
            <el-icon>
              <Download />
            </el-icon>导出
          </el-button>
          <el-button type @click="getlists">
            <el-icon>
              <RefreshRight />
            </el-icon>刷新
          </el-button>
        </div>

        <el-table :data="data.topics" style="width: 100%;" id="out-table">
          <!-- <el-table-column type="index" width="50" /> -->
          <el-table-column prop="id" label="用户ID"></el-table-column>
          <el-table-column prop="userName" label="用户昵称"></el-table-column>
          <el-table-column prop="email" label="邮箱"></el-table-column>
          <el-table-column prop="phone" label="手机号"></el-table-column>
          <el-table-column prop="areaCode" label="手机国际区号"></el-table-column>
          <el-table-column prop="avatar" label="头像">
            <template #default="scope">
              <el-avatar shape="square" :size="50" :src="scope.row.avatar" />
            </template>
          </el-table-column>
          <el-table-column prop="gender" label="性别">
            <template #default="scope">{{ gender(scope.row.gender) }}</template>
          </el-table-column>
          <el-table-column prop="intro" label="个人简介"></el-table-column>
          <el-table-column prop="status" label="状态">
            <template #default="scope">{{ status(scope.row.status) }}</template>
          </el-table-column>
          <el-table-column prop="type" label="用户类型">
            <template #default="scope">{{ type(scope.row.type) }}</template>
          </el-table-column>
          <el-table-column prop="securitiesNo" label="证券号"></el-table-column>
          <el-table-column label="操作" v-if="data.operation == 1" fixed="right">
            <template #default="scope">
              <div style="display: flex;">
                <el-button type="primary" size="small" @click="set(scope.row)">
                  <el-icon>
                    <Edit />
                  </el-icon>编辑
                </el-button>
                <!-- <el-button
                  type="danger"
                  size="small"
                  @click="deletelist(scope.row)"
                >
                  <el-icon> <Delete /> </el-icon>删除
                </el-button>-->
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="mt-15 fr mb-15">
          <el-pagination
            v-model:currentPage="data.queryParams.pageNum"
            v-model:page-size="data.queryParams.pageSize"
            :page-sizes="[5, 10, 30, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="data.total"
            @size-change="getlists"
            @current-change="getlists"
          />
        </div>
      </el-card>
      <el-dialog v-model="data.show" :title="data.title" width="50%">
        <el-form :model="data.ParamsData" ref="queryForm" label-width="100px">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="data.ParamsData.email" placeholder="请输入邮箱" clearable />
          </el-form-item>
          <el-form-item v-show="data.title === '新增用户'" label="登陆密码" prop="password">
            <el-input v-model="data.ParamsData.password" placeholder="请输入登陆密码" clearable />
          </el-form-item>
          <el-form-item label="昵称" prop="userName">
            <el-input v-model="data.ParamsData.userName" placeholder="请输入昵称" clearable />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="data.ParamsData.status" placeholder="请选择状态">
              <el-option label="禁用" :value="1" />
              <el-option label="启用" :value="0" />
            </el-select>
          </el-form-item>
          <el-form-item label="邀请码" prop="uid">
            <el-input v-model="data.ParamsData.uid" placeholder="请输入邀请码" clearable />
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="data.ParamsData.phone" placeholder="请输入手机号" clearable />
          </el-form-item>

          <el-form-item label="角色" prop="type">
            <el-select v-model="data.ParamsData.type" placeholder="请选择角色">
              <el-option label="普通用户" :value="0" />
              <el-option label="代理商" :value="1" />
              <el-option label="后台管理员" :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="性别" prop="gender">
            <el-select v-model="data.ParamsData.gender" placeholder="请选择角色">
              <el-option label="未知" :value="0" />
              <el-option label="男" :value="1" />
              <el-option label="女" :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="上传图片" prop="avatar">
            <el-upload
              class="upload-demo"
              :on-success="handleAvatarSuccess"
              :action="proxy.$uploaUrl"
              :show-file-list="false"
            >
              <el-image
                v-if="data.ParamsData.avatar"
                style="width: 178px; height: 178px;"
                :src="data.ParamsData.avatar"
                fit="cover"
              />
              <el-icon v-else class="avatar-uploader-icon">
                <Plus />
              </el-icon>
            </el-upload>
          </el-form-item>
          <el-form-item label="个人简介：" prop="intro">
            <div style="width: 400px;">
              <el-input
                v-model="data.ParamsData.intro"
                placeholder="请输入个人简介"
                show-word-limit
                type="textarea"
                input-style="height:100px"
              />
            </div>
          </el-form-item>
        </el-form>

        <template #footer>
          <div class="dialog-footer">
            <el-button @click="data.show = false">取消</el-button>
            <el-button type="primary" @click="updatelist">提交</el-button>
          </div>
        </template>
      </el-dialog>
      <el-dialog v-model="data.userShow" :title="data.title" width="50%">
        <el-form :model="data.formData" ref="queryformData" label-width="120px">
          <el-form-item label="请选择方式注册" prop="areaCode">
            <el-select v-model="data.value" class="m-2" placeholder="Select" size="large">
              <el-option label="手机号注册" value="手机号注册" />
              <el-option label="邮箱注册" value="邮箱注册" />
            </el-select>
          </el-form-item>

          <el-form-item label="区号" v-if="data.value == '手机号注册'" prop="areaCode">
            <el-input type="number" v-model="data.formData.areaCode" placeholder="请输入区号" clearable />
          </el-form-item>
          <el-form-item label="手机号" v-if="data.value == '手机号注册'" prop="phone">
            <el-input type="number" v-model="data.formData.phone" placeholder="请输入手机号" clearable />
          </el-form-item>
          <el-form-item label="邮箱" v-if="data.value == '邮箱注册'" prop="email">
            <el-input v-model="data.formData.email" placeholder="请输入邮箱" clearable />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="data.formData.password"
              placeholder="请输入密码（密码必须由6-12位数字及字母组成）"
              clearable
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="data.userShow = false">取消</el-button>
            <el-button type="primary" @click="addUser">提交</el-button>
          </div>
        </template>
      </el-dialog>
      <el-dialog v-model="data.dialogVisible" title="新增普通管理员" width="30%">
        <el-form ref="formRef" label-width="100px" :model="data.addForm" :rules="data.rules">
          <el-form-item label="账号" prop="email">
            <el-input v-model="data.addForm.email" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="data.addForm.password" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="data.dialogVisible = false">取消</el-button>
            <el-button :loading="data.addLoading" type="primary" @click="addData">确定</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
// 引入导出Excel表格依赖
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'

import { Delete, Edit, Search, Share, Upload } from '@element-plus/icons-vue'
import Editor from '@/components/Editor'
import headTitle from '@/components/head/index.vue'
import {
  ref,
  reactive,
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
  getCurrentInstance
} from 'vue'
import {
  userList,
  updateNewsList,
  forbid,
  getForbid,
  forbidLogin,
  getForbidLoginStatus,
  register,
  ExcelRegister,
  adminRegister
} from '../../../api/user'
import { ElMessage } from 'element-plus'
const { proxy } = getCurrentInstance()
const formRef = ref(null)
/**
 * 数据渲染功能
 */
//声明 数据
const data = reactive({
  topics: [],
  forbidStatus: false,
  forbidLoginStatus: false,
  headers: { 'Content-Type': 'multipart/form-data;charset=UTF-8' },
  operation: localStorage.getItem('operation') || 0,
  queryParams: {
    userName: '',
    status: null,
    email: '',
    phone: '',
    type: null,
    pageNum: 1,
    pageSize: 10
  },
  ParamsData: {},
  show: false,
  userShow: false,
  total: 1,
  title: '新增用户',
  value: '手机号注册',
  dialogVisible: false,
  addLoading: false,
  rules: {
    email: [
      {
        required: true,
        message: '请输入',
        trigger: ['change', 'blur']
      }
    ]
  },
  addForm: {
    code: '8888'
  },
  formData: {
    code: '8888',
    areaCode: '86',
    isOaRegister: '1'
  }
})
let handleExcel = (file) => {
  let formData = new FormData() //声明一个FormDate对象
  formData.append('file', file.raw) //把文件信息放入对象中
  //调用后台导入的接口
  ExcelRegister(formData)
    .then((res) => {
      res.data.data.forEach((item) => {
        let title = '第' + item.data + '行' + ',' + item.message
        ElMessage({
          message: title,
          type: item.status ? 'success' : 'error'
        })
      })
      getlists() // 导入表格之后可以获取导入的数据渲染到页面，此处的方法是获取导入的数据
    })
    .catch((err) => {
      //  console.log(err);
    })
}
const queryForm = ref(null)
//请求数据
onMounted(async () => {
  getlists()
  conso()
  getGetForbid()
  getGetForbidLoginStatus()
})
let getGetForbid = () => {
  getForbid()
    .then((res) => {
      data.forbidStatus = res.data.data
    })
    .catch((err) => {
      console.log(err)
    })
}
const addData = () => {
  formRef.value.validate((valid) => {
    if (!valid) return
    data.addLoading = true
    adminRegister(data.addForm)
      .then((res) => {
        console.log(res)
        ElMessage({
          type: res.data.msg ? 'error' : 'success',
          message: res.data.msg || res.data.data
        })
        getlists()
        data.dialogVisible = false
      })
      .finally(() => (data.addLoading = false))
  })
}
let getGetForbidLoginStatus = () => {
  getForbidLoginStatus()
    .then((res) => {
      data.forbidLoginStatus = res.data.data
    })
    .catch((err) => {
      console.log(err)
    })
}
// 打开新增用户的弹框
let userShowTrue = () => {
  data.userShow = true
}
const showDialog = () => {
  data.addForm = {
    code: '8888'
  }
  data.dialogVisible = true
}
//获取新闻列表
let getlists = async () => {
  let res = await userList(data.queryParams).catch((err) => {
    console.log(err)
  })
  console.log(res)
  data.topics = res.data.data.data.records
  data.total = res.data.data.data.total
}
const handleAvatarSuccess = (response, uploadFile) => {
  data.ParamsData.avatar = uploadFile.response.data
}
let forbidStatusChange = (value) => {
  forbid({
    forbidStatus: value
  })
    .then((res) => {
      ElMessage({
        message: res.data.data,
        type: 'success'
      })
    })
    .catch((err) => {
      console.log(err)
    })
}
let forbidLoginStatusChange = (value) => {
  forbidLogin({
    forbidLoginStatus: value
  })
    .then((res) => {
      ElMessage({
        message: res.data.data.message,
        type: 'success'
      })
    })
    .catch((err) => {
      console.log(err)
    })
}
//新建编辑新闻
let updatelist = async () => {
  let res = await updateNewsList(data.ParamsData).catch((err) => {
    console.log(err)
  })
  console.log(res)
  // return
  if (res && res.data.code == 0) {
    data.show = false
    getlists()
    ElMessage({
      message: '保存成功',
      type: 'success'
    })
  }
}
let addUser = () => {
  if (data.value == '手机号注册' && !data.formData.phone) {
    return ElMessage({
      type: 'error',
      message: '请输入手机号'
    })
  }
  if (data.value == '邮箱注册' && !data.formData.email) {
    return ElMessage({
      type: 'error',
      message: '请输入邮箱'
    })
  }
  if (!data.formData.password) {
    return ElMessage({
      type: 'error',
      message: '请输入密码'
    })
  }
  let reg = new RegExp(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/)
  let password = data.formData.password
  if (!reg.test(password)) {
    return ElMessage({
      type: 'error',
      message: '密码必须由6-12位数字及字母组成'
    })
  }
  register(data.formData).then((res) => {
    console.log(res)
    if (res) {
      data.userShow = false
      getlists()
      ElMessage({
        type: 'success',
        message: res.data.msg || res.data.data
      })
    }
  })
}
//删除新闻
let deletelist = async (row) => {
  ElMessageBox.confirm('是否确认删除', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    adminDeleteById({ id: row.id }).then((res) => {
      ElMessage({
        type: 'success',
        message: res.data.data.message
      })
      inquire()
    })
  })
}
let conso = () => {}

let reset = () => {
  queryForm.value.resetFields()
}

let add = () => {
  data.title = '新增用户'
  data.show = true
  data.ParamsData = {}
}
let set = (item) => {
  data.title = '修改用户'
  data.show = true
  data.ParamsData = JSON.parse(JSON.stringify(item))
}
let gender = (e) => {
  if (e == 0) {
    return '未知'
  } else if (e == 1) {
    return '男'
  } else {
    return '女'
  }
}
let type = (e) => {
  if (e == 0) {
    return '普通用户'
  } else if (e == 1) {
    return '代理商'
  } else if (e == 2) {
    return '后台管理员'
  } else if (e == 4) {
    return '普通管理员'
  }
}
let status = (e) => {
  if (e == 0) {
    return '启用'
  } else {
    return '禁用'
  }
}

// 导出表格  按钮点击后触发事件
const exportExcel = () => {
  /* 从表生成工作簿对象 */
  var wb = XLSX.utils.table_to_book(document.querySelector('#out-table'))
  /* 获取二进制字符串作为输出 */
  var wbout = XLSX.write(wb, {
    bookType: 'xlsx',
    bookSST: true,
    type: 'array'
  })
  try {
    FileSaver.saveAs(
      //Blob 对象表示一个不可变、原始数据的类文件对象。
      //Blob 表示的不一定是JavaScript原生格式的数据。
      //File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。
      //返回一个新创建的 Blob 对象，其内容由参数中给定的数组串联组成。
      new Blob([wbout], { type: 'application/octet-stream' }),
      //设置导出文件名称
      'idea.xlsx'
    )
  } catch (e) {
    if (typeof console !== 'undefined') console.log(e, wbout)
  }
  return wbout
}
</script>

<style lang="scss" scoped>
.mt-15 {
  margin-top: 15px;
}
.fr {
  float: right;
}
.mb-15 {
  margin-bottom: 15px;
}
.flex_box {
  display: flex;
  justify-content: end;
  padding: 20px;
}
.demo-pagination-block {
  display: flex;
  justify-content: center;
}

.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
