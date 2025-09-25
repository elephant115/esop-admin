<template>
  <div>
    <!-- <head-title tite="关于我们"></head-title> -->
    <div class="padding">
      <el-card class="mt-50" title="关于我们">
        <template #header>
          <div class="card-header">
            <span class="mt-15">关于我们</span>
          </div>
        </template>
        <el-form
          ref="formRef"
          inline
          :model="data.form"
          :rules="data.rules"
          label-width="120px"
        >
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="上传图片" prop="platformImg">
                <el-upload
                  class="upload-demo"
                  :on-success="handleAvatarSuccess"
                  :action="proxy.$uploaUrl"
                  :show-file-list="false"
                >
                  <el-image
                    v-if="data.form.platformImg"
                    style="width: 178px; height: 178px;"
                    :src="data.form.platformImg"
                    fit="cover"
                  />
                  <el-icon v-else class="avatar-uploader-icon"
                    ><Plus
                  /></el-icon> </el-upload></el-form-item
            ></el-col>
            <el-col :span="24">
              <el-form-item label="编号" prop="id">
                <el-input
                  clearable
                  class="w-700"
                  placeholder="请输入"
                  v-model="data.form.id"
                /> </el-form-item
            ></el-col>
            <el-col :span="24">
              <el-form-item label="客服电话" prop="customerTel">
                <el-input
                  class="w-700"
                  clearable
                  placeholder="请输入"
                  v-model="data.form.customerTel"
                /> </el-form-item
            ></el-col>
            <el-col :span="24">
              <el-form-item label="官网地址" prop="officialAddress">
                <el-input
                  class="w-700"
                  clearable
                  placeholder="请输入"
                  v-model="data.form.officialAddress"
                /> </el-form-item
            ></el-col>
            <el-col :span="24">
              <el-form-item label="官方邮箱" prop="officialEmail">
                <el-input
                  class="w-700"
                  clearable
                  placeholder="请输入"
                  v-model="data.form.officialEmail"
                /> </el-form-item
            ></el-col>
            <el-col :span="24">
              <el-form-item label="APP介绍" prop="platformDetil">
                <el-input
                  type="textarea"
                  class="w-700"
                  :autosize="{ minRows: 3 }"
                  clearable
                  placeholder="请输入"
                  v-model="data.form.platformDetil"
                /> </el-form-item
            ></el-col>
            <el-col :span="24">
              <el-form-item label="免责申明" prop="disclaimers">
                <el-input
                  type="textarea"
                  class="w-700"
                  :autosize="{ minRows: 3 }"
                  clearable
                  placeholder="请输入"
                  v-model="data.form.disclaimers"
                /> </el-form-item
            ></el-col>
            <el-col :span="24" v-if="data.operation == 1">
              <el-button v-loading="data.addLoading" type="primary" @click="addData">保存</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive,getCurrentInstance } from 'vue-demi'
import headTitle from '@/components/head/index.vue'
import { platformList, platformUpdate } from '@/api/regulation/aboutUs'
import { ElMessage, ElMessageBox } from 'element-plus'
const { proxy } = getCurrentInstance()
const formRef = ref(null)
const data = reactive({
  form: {
    pageNum: 1,
    pageSize: 10
  },
  tableData: [],
  title: '',
  addForm: {},
  addLoading: false,
  tableLoading: false,
  operation: localStorage.getItem('operation') || 0,
  rules: {
    platformImg: [
      {
        required: true,
        message: '请输入',
        trigger: ['change', 'blur']
      }
    ],
    id: [
      {
        required: true,
        message: '请输入',
        trigger: ['change', 'blur']
      }
    ],
    customerTel: [
      {
        required: true,
        message: '请输入',
        trigger: ['change', 'blur']
      }
    ],
    officialAddress: [
      {
        required: true,
        message: '请输入',
        trigger: ['change', 'blur']
      }
    ],
    officialEmail: [
      {
        required: true,
        message: '请输入',
        trigger: ['change', 'blur']
      }
    ],
    platformDetil: [
      {
        required: true,
        message: '请输入',
        trigger: ['change', 'blur']
      }
    ],
    disclaimers: [
      {
        required: true,
        message: '请输入',
        trigger: ['change', 'blur']
      }
    ]
  },
  total: 0
})
onMounted(() => {})
const beforeAvatarUpload = () => {}

const inquire = (num) => {
  platformList({}).then((res) => {
    console.log(res)
      data.form = res.data.data[0]
    //   data.total = res.data.data.data.total
  })
}
const handleAvatarSuccess = (response, uploadFile) => {
  console.log(uploadFile)
  data.form.platformImg = uploadFile.response.data
}
const addData = () => {
  formRef.value.validate((valid) => {
    if (!valid) return
    data.addLoading = true
    platformUpdate(data.form)
      .then((res) => {
        ElMessage({
          type: 'success',
          message: '保存成功'
        })
        inquire()
       
      })
      .finally(() => (data.addLoading = false))
  })
}

inquire()
</script>

<style lang="scss" scoped>
.text-center {
  text-align: right;
}
.mt-15 {
  margin-top: 15px;
}
.fr {
  float: right;
}
.mb-15 {
  margin-bottom: 15px;
}
.mt-50 {
  margin-top: 50px;
}
.w-700 {
  width: 700px;
}

.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

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
