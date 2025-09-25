<template>
  <div>
    <el-card class="box-card">
      <template #header>
        <div class="title" style="padding-bottom: 20px; font-weight: bold;">
          新闻
        </div>
        <el-form
          :model="data.queryParams"
          ref="queryForm"
          :inline="true"
          label-width="100px"
        >
          <el-form-item label="新闻名称" prop="name">
            <el-input
              v-model="data.queryParams.name"
              placeholder="请输入标题"
              clearable
            />
          </el-form-item>

          <el-form-item label="分类：" prop="categoryId">
            <el-select
              v-model="data.queryParams.categoryId"
              placeholder="请选择分类"
            >
              <el-option label="快讯" value="1" />
              <el-option label="新闻" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态：" prop="status">
            <el-select
              v-model="data.queryParams.status"
              placeholder="请选择状态"
            >
              <el-option label="禁用" value="1" />
              <el-option label="启用" value="0" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :icon="Search" @click="getlists"
              >搜索</el-button
            >
            <el-button type="primary" @click="reset()">
              <el-icon>
                <Refresh /> </el-icon
              >重置
            </el-button>
            <el-button v-if="data.operation == 1" type="primary" @click="add">
              <el-icon>
                <Plus /> </el-icon
              >新增
            </el-button>
          </el-form-item>
        </el-form>
      </template>
      <!-- </div> -->
      <!-- <div style="padding: 30px 0"> -->

      <el-table :data="data.topics" style="width: 100%; padding: 50px 0;">
        <el-table-column type="index" width="100" label="序号" />
        <el-table-column prop="name" label="新闻名称"></el-table-column>
        <el-table-column prop="categoryId" label="分类">
          <template #default="scope">
            <div>
              {{ categoryId(scope.row.categoryId) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="coverImage" label="封面图片">
          <template #default="scope">
            <el-avatar shape="square" :size="50" :src="scope.row.coverImage" />
          </template>
        </el-table-column>
        <el-table-column prop="coverPicture" label="摘录"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <div>
              {{ status(scope.row.status) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="postTime" label="发布时间"></el-table-column>
        <el-table-column v-if="data.operation == 1" label="操作" fixed="right" width="150">
          <template #default="scope">
            <div style="display: flex;">
              <el-button type="primary" size="small" @click="set(scope.row)">
                <el-icon>
                  <Edit /> </el-icon
                >编辑
              </el-button>
              <el-button
                type="danger"
                size="small"
                @click="deletelist(scope.row)"
              >
                <el-icon>
                  <Delete /> </el-icon
                >删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="demo-pagination-block">
        <el-pagination
          v-show="data.total > 0"
          :page-size="10"
          layout="total, prev, pager, next"
          :total="data.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <el-dialog v-model="data.show" :title="title" width="50%">
      <el-form :model="data.ParamsData" ref="queryForm" label-width="100px">
        <el-form-item label="新闻名称" prop="name">
          <el-input
            v-model="data.ParamsData.name"
            placeholder="请输入标题"
            clearable
          />
        </el-form-item>

        <el-form-item label="分类：" prop="categoryId">
          <el-select
            v-model="data.ParamsData.categoryId"
            placeholder="请选择分类"
          >
            <el-option label="快讯" value="1" />
            <el-option label="新闻" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态：" prop="status">
          <el-switch
            v-model="data.ParamsData.status"
            active-text="禁用"
            inactive-text="启用"
          />
          <!-- <el-switch
            v-model="data.ParamsData.status"
            active-text="禁用"
            inactive-text="启用"
            active-value="0"
            inactive-value="0"
          /> -->
        </el-form-item>
        <el-form-item label="排序：" prop="sort">
          <el-input-number v-model="data.ParamsData.sort" :min="1" />
        </el-form-item>

        <el-form-item label="发布日期：" prop="postTime;">
          <el-date-picker
            v-model="data.ParamsData.postTime"
            type="date"
            placeholder="发布日期"
            :default-value="new Date(2010, 9, 1)"
          />
        </el-form-item>
        <el-form-item label="封面图片：" prop="coverImage">
          <el-upload
                  class="upload-demo"
                  :on-success="handleAvatarSuccess"
                  :action="proxy.$uploaUrl"
                  :show-file-list="false"
                >
                  <el-image
                    v-if="data.ParamsData.coverImage"
                    style="width: 178px; height: 178px;"
                    :src="data.ParamsData.coverImage"
                    fit="cover"
                  />
                  <el-icon v-else class="avatar-uploader-icon"
                    ><Plus
                  /></el-icon> </el-upload>
        </el-form-item>
        <el-form-item label="简短介绍：" prop="coverPicture">
          <div style="width: 400px;">
            <el-input
              v-model="data.ParamsData.coverPicture"
              placeholder="请输入内容"
              show-word-limit
              type="textarea"
              input-style="height:100px"
            />
          </div>
        </el-form-item>
        <el-form-item label="内容：" prop="content">
          <Toolbar
            style="border-bottom: 1px solid #ccc;"
            :editor="editorRef"
            :defaultConfig="data.toolbarConfig"
            :mode="data.mode"
          />
          <Editor
            style="height: 200px; overflow-y: hidden;"
            v-model="data.ParamsData.content"
            :defaultConfig="data.editorConfig"
            :mode="data.mode"
            @onCreated="handleCreated"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="show = false">取消</el-button>
          <el-button type="primary" @click="updatelist">提交</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { Delete, Edit, Search, Share, Upload } from '@element-plus/icons-vue'
// import Editor from '@/components/Editor'
import '@wangeditor/editor/dist/css/style.css'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import {
  ref,
  reactive,
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
  shallowRef,
  getCurrentInstance
} from 'vue'
import {
  getNewsList,
  updateNewsList,
  deleteNewsList
} from '../../api/information'
import { ElMessage } from 'element-plus'
const { proxy } = getCurrentInstance()
/**
 * 数据渲染功能
 */
//声明 数据
const data = reactive({
  mode: 'default',
  topics: [],
  toolbarConfig:{},
  editorConfig: { placeholder: '请输入内容...' },
  operation: localStorage.getItem('operation') || 0,
  queryParams: {
    name: '',
    status: null,
    categoryId: null,
    pageNum: 1,
    pageSize: 10
  },
  ParamsData: {
    name: '',
    status: false,
    categoryId: '',
    coverImage:'',
    coverPicture: '',
    content: '',
    postTime: '',
    sort: 1
  },
  show: false,
  total: 0
})
const editorRef = shallowRef()
const queryForm = ref(null)
let title = ref('新增新闻')
//请求数据
onMounted(async () => {
  getlists()
  conso()
})
const handleCreated = (editor) => {
  editorRef.value = editor // 记录 editor 实例，重要！
}
const handleAvatarSuccess = (response, uploadFile) => {
  console.log(uploadFile)
  data.ParamsData.coverImage = uploadFile.response.data
}
//获取新闻列表
let getlists = async () => {
  let res = await getNewsList(data.queryParams)
  data.topics = res.data.data.data.records
  data.total = res.data.data.data.total
}
//新建编辑新闻
let updatelist = async () => {
  data.ParamsData.status = data.ParamsData.status ? 0 : 1
  let res = await updateNewsList(data.ParamsData)
  if (res.data.code == 0) {
    data.show = false
    ElMessage({
      message: '保存成功',
      type: 'success'
    })
  }
}
//删除新闻
let deletelist = async (item) => {
  item
  let res = await deleteNewsList({ id: item.id })
}
let conso = () => {
  console.log(data.topics)
}

let categoryId = (e) => {
  if (e == 1) {
    return '快讯'
  } else {
    return '新闻'
  }
}
let status = (e) => {
  if (e == 1) {
    return '禁用'
  } else {
    return '启用'
  }
}
let reset = () => {
  queryForm.value.resetFields()
}

let add = () => {
  data.show = true
}
let set = (item) => {
  data.show = true
  data.ParamsData = item
}
// 选择每页多少条
const handleSizeChange = (row) => {
  console.log(1111)
  // data.queryParams.pageSize = row
  // data.queryParams.pageNum = 1
  //   getlists()
}

// 点击页面进行跳转
const handleCurrentChange = (row) => {
  console.log(2222, row)
  data.queryParams.pageNum = row
  getlists()
}
</script>

<style lang="scss" scoped>
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
